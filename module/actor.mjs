import { loc } from "./config.mjs";

export class SotuActor extends Actor {

  /** Datos para fórmulas: la iniciativa usa @ac */
  getRollData() {
    const s = this.system;
    return { ac: s.ac ?? 0, mv: s.mv ?? 0, hd: s.hd ?? 1, level: s.hd ?? 1 };
  }

  /** Herido: PJ por debajo de 0 PG. No se recupera con un descanso normal. */
  get wounded() {
    return this.type === "character" && this.system.hp.value < 0;
  }

  /** Marca el token como "Sangrando" mientras el PJ esté herido. */
  _onUpdate(changed, options, userId) {
    super._onUpdate(changed, options, userId);
    // Solo el cliente que hizo el cambio, para no repetirlo en cada jugador conectado
    if (userId !== game.user.id || this.type !== "character" || changed.system?.hp === undefined) return;
    this.toggleStatusEffect("bleeding", { active: this.wounded });
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
    const btn = `<button type="button" data-sotu-damage="${damage}" data-actor-uuid="${this.uuid}">${loc("SOTU.Chat.DamageButton", { dice: damage })}</button>`;
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

  /** Descanso: todos los PG se restauran al máximo, salvo si el PJ está por debajo de 0 PG. */
  rest() {
    if (this.wounded) return ui.notifications.warn(loc("SOTU.Notify.Wounded"));
    return this.update({ "system.hp.value": this.system.hp.max });
  }

  /** Descanso largo: el DJ decide cuándo ha pasado; recupera todos los PG de un PJ herido. */
  async longRest() {
    if (!this.wounded) return;
    await ChatMessage.create({ speaker: this.speaker, content: loc("SOTU.Chat.LongRest", { name: this.name }) });
    return this.update({ "system.hp.value": this.system.hp.max });
  }

  /** PG: nivel d8, quedándose con el mejor entre el nuevo total y el anterior. */
  async rollHP() {
    const s = this.system;
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
}
