import { RACES, WEAPONS, loc } from "./config.mjs";
import { BACKGROUND_TABLES, findTable, tableText } from "./tables.mjs";
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

  /** Máximo de armas al crear: 3, o 2 si lleva escudo. */
  get weaponLimit() {
    return this.system.shield ? 2 : 3;
  }

  /** Tirada de d20 "por debajo": éxito si el resultado es <= objetivo. */
  async rollUnder(label, target) {
    const roll = await new Roll("1d20").evaluate();
    const ok = roll.total <= target;
    await roll.toMessage({
      speaker: this.speaker,
      flavor: loc("SOTU.Chat.RollUnder", { label, target, result: loc(ok ? "SOTU.Chat.Success" : "SOTU.Chat.Failure") })
    });
    return ok;
  }

  /** Sigilo y proezas: d20 <= CA + nivel */
  stealth() {
    return this.rollUnder(loc("SOTU.Chat.Stealth"), this.system.ac + this.system.hd);
  }

  /** Salvación: d20 <= nivel + 4 */
  save() {
    return this.rollUnder(loc("SOTU.Chat.Save"), this.system.hd + 4);
  }

  /** Ataque: d20 <= CA del objetivo + nivel. Usa el objetivo marcado (T) si existe. */
  async attack(weapon = null) {
    const hd = this.system.hd;
    const targetAC = game.user.targets.first()?.actor?.system?.ac;
    const hasTarget = Number.isFinite(targetAC);
    const roll = await new Roll("1d20").evaluate();
    const damage = weapon?.system.damage ?? this.system.damage ?? "1d4";
    // Dados explosivos: cada dado que saca su máximo vuelve a tirarse y se acumula
    const formula = damage.replace(/(\d*d\d+)(?![\dx])/gi, "$1x");
    const label = weapon ? loc("SOTU.Chat.AttackWith", { weapon: weapon.name }) : loc("SOTU.Chat.Attack");

    let result;
    if (hasTarget) {
      const need = targetAC + hd;
      result = loc("SOTU.Chat.HitNeed", {
        ac: targetAC, hd, need, result: loc(roll.total <= need ? "SOTU.Chat.Hit" : "SOTU.Chat.Miss")
      });
    } else {
      result = loc("SOTU.Chat.HitIf", { hd });
    }
    const btn = `<button type="button" data-sotu-damage="${formula}" data-actor-uuid="${this.uuid}">${loc("SOTU.Chat.DamageButton", { dice: damage })}</button>`;
    await roll.toMessage({ speaker: this.speaker, flavor: `<b>${label}</b><br>${result}<br>${btn}` });
  }

  /** Peligros: 1d8 (mata a un hombre), 2d8 (caballo), 4d8 (ogro) */
  async danger(formula) {
    const roll = await new Roll(formula).evaluate();
    await roll.toMessage({ speaker: this.speaker, flavor: loc("SOTU.Chat.DangerFlavor", { formula }) });
  }

  /** Moral del monstruo: 1d10 > DG => se retira o se rinde */
  async morale() {
    const hd = this.system.hd;
    const roll = await new Roll("1d10").evaluate();
    await roll.toMessage({
      speaker: this.speaker,
      flavor: loc("SOTU.Chat.MoraleFlavor", { hd, result: loc(roll.total > hd ? "SOTU.Chat.MoraleRetreat" : "SOTU.Chat.MoraleFight") })
    });
  }

  /** Descanso: todos los PG se restauran al máximo. */
  rest() {
    return this.update({ "system.hp.value": this.system.hp.max });
  }

  /** PG: nivel d8, quedándose con el mejor entre el nuevo total y el anterior. */
  async rollHP() {
    const s = this.system;
    if (s.level === 0) {
      ui.notifications.info(loc("SOTU.Notify.Level0HP"));
      return this.update({ "system.hp.max": 4, "system.hp.value": 4 });
    }
    if (s.hpRolled) return ui.notifications.warn(loc("SOTU.Notify.HPAlreadyRolled"));

    const formula = `${s.level}d8`;
    const roll = await new Roll(formula).evaluate();
    const newMax = Math.max(s.hp.max, roll.total);
    await roll.toMessage({
      speaker: this.speaker,
      flavor: loc("SOTU.Chat.HPRoll", { formula, roll: roll.total, old: s.hp.max, max: newMax })
    });
    await this.update({
      "system.hp.max": newMax,
      "system.hp.value": s.hp.value + (newMax - s.hp.max),
      "system.hpRolled": true
    });
  }

  /** Subir de nivel: +1 nivel y reactiva la tirada de PG. */
  async levelUp() {
    const s = this.system;
    if (s.xp < s.xpNeeded) return ui.notifications.warn(loc("SOTU.Notify.NeedXP", { xp: s.xpNeeded }));
    const level = s.level + 1;
    await ChatMessage.create({
      speaker: this.speaker,
      content: loc("SOTU.Chat.LevelUp", { name: this.name, level })
    });
    await this.update({
      "system.level": level,
      "system.xp": s.xp - s.xpNeeded,
      "system.hpRolled": false
    });
  }

  /** Raza aleatoria: 1d(nº de razas), una sola vez. */
  async rollRace() {
    if (this.system.raceRolled) return ui.notifications.warn(loc("SOTU.Notify.RaceAlreadyRolled"));
    const keys = Object.keys(RACES);
    const roll = await new Roll(`1d${keys.length}`).evaluate();
    const race = keys[roll.total - 1];
    await roll.toMessage({
      speaker: this.speaker,
      flavor: loc("SOTU.Chat.RandomRace", { n: keys.length, race: loc(RACES[race]) })
    });
    await this.update({ "system.race": race, "system.raceRolled": true });
  }

  /** Arma aleatoria: categoría (1d4) + arma concreta de esa categoría. */
  async rollWeapon() {
    if (this.itemTypes.weapon.length >= this.weaponLimit) {
      return ui.notifications.warn(loc("SOTU.Notify.WeaponLimit", { n: this.weaponLimit }));
    }
    const cats = Object.keys(WEAPONS);
    const catRoll = await new Roll(`1d${cats.length}`).evaluate();
    const category = cats[catRoll.total - 1];

    const examples = WEAPONS[category].examples;
    const nameRoll = await new Roll(`1d${examples.length}`).evaluate();
    const name = loc(`SOTU.WeaponName.${examples[nameRoll.total - 1]}`);

    await ChatMessage.create({
      speaker: this.speaker,
      rolls: [catRoll, nameRoll],
      sound: CONFIG.sounds.dice,
      flavor: loc("SOTU.Chat.RandomWeapon", { name, category: loc(WEAPONS[category].short), die: WEAPONS[category].die })
    });
    await this.createEmbeddedDocuments("Item", [{ name, type: "weapon", system: { category } }]);
  }

  /** Tira una tabla de trasfondo (una sola vez) y añade el resultado a la descripción. */
  async rollBackground(key) {
    if (!BACKGROUND_TABLES[key]) return;
    if (this.system.backgroundRolled?.[key]) return ui.notifications.warn(loc("SOTU.Notify.TableAlreadyRolled"));
    const table = findTable(key);
    if (!table) return ui.notifications.error(loc("SOTU.Notify.MissingTable", { name: loc(`SOTU.TableName.${key}`) }));

    const title = loc(`SOTU.TableLabel.${key}`);
    const { roll, results } = await table.roll();
    const text = results.map(r => tableText(key, r)).join(" ");

    await ChatMessage.create({
      speaker: this.speaker,
      rolls: [roll],
      sound: CONFIG.sounds.dice,
      flavor: `<b>${title}</b> (${table.formula}) → ${text}`
    });

    const bio = this.system.biography?.trim();
    const entry = `${title}: ${text}`;
    await this.update({
      "system.biography": bio ? `${bio}\n\n${entry}` : entry,
      [`system.backgroundRolled.${key}`]: true
    });
  }

  /** Nombre aleatorio según raza y sexo (se puede repetir). */
  async rollName() {
    const name = randomName(this.system.race, this.system.sex);
    await this.update({ name, "prototypeToken.name": name });
  }
}
