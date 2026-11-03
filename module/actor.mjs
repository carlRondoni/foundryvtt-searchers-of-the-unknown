import { RACES, WEAPONS } from "./config.mjs";
import { BACKGROUND_TABLES, findBackgroundTable } from "./tables.mjs";
import { randomName } from "./names.mjs";

export class SotuActor extends Actor {

  /** Datos para fórmulas: la iniciativa usa @ac */
  getRollData() {
    const s = this.system;
    return { ac: s.ac ?? 0, mv: s.mv ?? 0, hd: s.hd ?? 1, level: s.hd ?? 1 };
  }

  get speaker() {
    return ChatMessage.getSpeaker({ actor: this });
  }

  /** Tirada de d20 "por debajo": éxito si el resultado es <= objetivo. */
  async rollUnder(label, target) {
    const roll = await new Roll("1d20").evaluate();
    const ok = roll.total <= target;
    await roll.toMessage({
      speaker: this.speaker,
      flavor: `<b>${label}</b> · debe sacar ≤ ${target} · <b>${ok ? "ÉXITO" : "FALLO"}</b>`
    });
    return ok;
  }

  /** Sigilo y proezas: d20 <= CA + nivel */
  stealth() {
    return this.rollUnder("Sigilo / proezas", this.system.ac + this.system.hd);
  }

  /** Salvación: d20 <= nivel + 4 */
  save() {
    return this.rollUnder("Tirada de salvación", this.system.hd + 4);
  }

  /** Ataque: d20 <= CA del objetivo + nivel. Usa el objetivo marcado (T) si existe. */
  async attack(weapon = null) {
    const hd = this.system.hd;
    const targetAC = game.user.targets.first()?.actor?.system?.ac;
    const hasTarget = Number.isFinite(targetAC);
    const roll = await new Roll("1d20").evaluate();
    const damage = weapon?.system.damage ?? this.system.damage ?? "1d4";
    const formula = damage.replace(/(\d*d\d+)(?![\dx])/gi, "$1x");
    const label = weapon ? `Ataque con ${weapon.name}` : "Ataque";

    let result;
    if (hasTarget) {
      const need = targetAC + hd;
      result = `CA objetivo ${targetAC} + nivel ${hd} → necesita ≤ ${need}: <b>${roll.total <= need ? "IMPACTO" : "FALLO"}</b>`;
    } else {
      result = `Impacta si saca ≤ (CA del objetivo + ${hd})`;
    }
    const btn = `<button type="button" data-sotu-damage="${formula}" data-actor-uuid="${this.uuid}">Daño ${damage} 💥</button>`;
    await roll.toMessage({ speaker: this.speaker, flavor: `<b>${label}</b><br>${result}<br>${btn}` });
  }

  /** Peligros: 1d8 (mata a un hombre), 2d8 (caballo), 4d8 (ogro) */
  async danger(formula) {
    const roll = await new Roll(formula).evaluate();
    await roll.toMessage({ speaker: this.speaker, flavor: `<b>Daño de peligro</b> (${formula})` });
  }

  /** Moral del monstruo: 1d10 > DG => se retira o se rinde */
  async morale() {
    const hd = this.system.hd;
    const roll = await new Roll("1d10").evaluate();
    await roll.toMessage({
      speaker: this.speaker,
      flavor: `<b>Moral</b> · DG ${hd} · <b>${roll.total > hd ? "SE RETIRA / SE RINDE" : "SIGUE LUCHANDO"}</b>`
    });
  }

  /** Descanso: todos los PG se restauran al máximo. */
  rest() {
    return this.update({ "system.hp.value": this.system.hp.max });
  }

  /** Crear PJ: 1d8 por nivel. */
  async rollHP() {
    const s = this.system;

    if (s.level === 0) {
      ui.notifications.info("Los personajes de nivel 0 tienen 4 PG fijos.");
      return this.update({ "system.hp.max": 4, "system.hp.value": 4 });
    }
    if (s.hpRolled) {
      return ui.notifications.warn("Ya tiraste los PG de este nivel.");
    }

    const roll = await new Roll(`${s.level}d8`).evaluate();
    const newMax = Math.max(s.hp.max, roll.total);
    await roll.toMessage({
      speaker: this.speaker,
      flavor: `<b>Puntos de golpe</b> (${s.level}d8) · ${roll.total} vs ${s.hp.max} actuales → máx. ${newMax}`
    });
    await this.update({
      "system.hp.max": newMax,
      "system.hp.value": s.hp.value + (newMax - s.hp.max),
      "system.hpRolled": true
    });
  }

  /** Crear PJ: random race */
  async rollRace() {
    if (this.system.raceRolled) {
      return ui.notifications.warn("Este personaje ya tiró su raza aleatoria.");
    }
    const keys = Object.keys(RACES);
    const roll = await new Roll(`1d${keys.length}`).evaluate();
    const race = keys[roll.total - 1];
    await roll.toMessage({
      speaker: this.speaker,
      flavor: `<b>Raza aleatoria</b> (1d${keys.length}) → <b>${RACES[race]}</b>`
    });
    await this.update({ "system.race": race, "system.raceRolled": true });
  }

  /** Máximo de armas al crear: 3, o 2 si lleva escudo. */
  get weaponLimit() {
    return this.system.shield ? 2 : 3;
  }

  /** Arma aleatoria: categoría (1d4) + arma concreta de esa categoría. */
  async rollWeapon() {
    if (this.itemTypes.weapon.length >= this.weaponLimit) {
      return ui.notifications.warn(`Ya tienes ${this.weaponLimit} armas (máximo permitido).`);
    }
    const cats = Object.keys(WEAPONS);
    const catRoll = await new Roll(`1d${cats.length}`).evaluate();
    const category = cats[catRoll.total - 1];

    const examples = WEAPONS[category].examples;
    const nameRoll = await new Roll(`1d${examples.length}`).evaluate();
    const name = examples[nameRoll.total - 1];

    await ChatMessage.create({
      speaker: this.speaker,
      rolls: [catRoll, nameRoll],
      sound: CONFIG.sounds.dice,
      flavor: `<b>Arma aleatoria</b> → <b>${name}</b> (${WEAPONS[category].short}, ${WEAPONS[category].die})`
    });
    await this.createEmbeddedDocuments("Item", [{ name, type: "weapon", system: { category } }]);
  }

  /** Tira una tabla de trasfondo (una sola vez) y añade el resultado a la descripción. */
  async rollBackground(key) {
    const def = BACKGROUND_TABLES[key];
    if (!def) return;
    if (this.system.backgroundRolled?.[key]) {
      return ui.notifications.warn("Ya tiraste esta tabla.");
    }
    const table = findBackgroundTable(key);
    if (!table) {
      return ui.notifications.error(`No se encuentra la tabla "${def.name}". Un GM debe cargar el mundo para crearla.`);
    }

    const { roll, results } = await table.roll();
    const text = results.map(r => r.name || r.description || r.text).join(" ");

    await ChatMessage.create({
      speaker: this.speaker,
      rolls: [roll],
      sound: CONFIG.sounds.dice,
      flavor: `<b>${def.title}</b> (${def.formula}) → ${text}`
    });

    const bio = this.system.biography?.trim();
    const entry = `${def.title}: ${text}`;
    await this.update({
      "system.biography": bio ? `${bio}\n\n${entry}` : entry,
      [`system.backgroundRolled.${key}`]: true
    });
  }

  /** Nombre aleatorio según raza y sexo (se puede repetir cuantas veces quieras). */
  async rollName() {
    const name = randomName(this.system.race, this.system.sex);
    await this.update({ name, "prototypeToken.name": name });
  }

  /** Subir de nivel: +1 DG, se vuelve a tirar todo y se queda con el mayor. */
  async levelUp() {
    const s = this.system;
    if (s.xp < s.xpNeeded) {
      return ui.notifications.warn(`Necesitas ${s.xpNeeded} PX para subir de nivel.`);
    }
    const newLevel = s.level + 1;
    await ChatMessage.create({
      speaker: this.speaker,
      content: `<b>${this.name} sube a nivel ${newLevel}</b> · toca tirar los PG`
    });
    await this.update({
      "system.level": newLevel,
      "system.xp": s.xp - s.xpNeeded,
      "system.hpRolled": false
    });
  }
}
