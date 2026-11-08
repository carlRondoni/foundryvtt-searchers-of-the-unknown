import { SYSTEM_ID, ARMORS, WEAPONS, RACES, loc, localized } from "./config.mjs";

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2, ItemSheetV2 } = foundry.applications.sheets;
const TPL = `systems/${SYSTEM_ID}/templates`;

export class SotuActorSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
  /** Pestaña activa; se conserva entre re-renderizados. */
  #tab = "sheet";

  static DEFAULT_OPTIONS = {
    classes: ["sotu", "actor"],
    position: { width: 540, height: 660 },
    window: { resizable: true },
    form: { submitOnChange: true },
    actions: {
      attack: SotuActorSheet.#attack,
      stealth: SotuActorSheet.#stealth,
      save: SotuActorSheet.#save,
      rest: SotuActorSheet.#rest,
      longRest: SotuActorSheet.#longRest,
      rollHP: SotuActorSheet.#rollHP,
      levelUp: SotuActorSheet.#levelUp,
      danger: SotuActorSheet.#danger,
      morale: SotuActorSheet.#morale,
      addWeapon: SotuActorSheet.#addWeapon,
      editWeapon: SotuActorSheet.#editWeapon,
      deleteWeapon: SotuActorSheet.#deleteWeapon,
      changeTab: SotuActorSheet.#changeTab
    }
  };

  static PARTS = { body: { template: `${TPL}/actor.hbs` } };

  async _prepareContext(options) {
    const ctx = await super._prepareContext(options);
    const actor = this.document;
    const isCharacter = actor.type === "character";
    const ac = loc("SOTU.Sheet.AC");
    const mv = loc("SOTU.Sheet.MV");
    return Object.assign(ctx, {
      actor,
      system: actor.system,
      isCharacter,
      wounded: actor.wounded,
      canLevelUp: isCharacter && actor.system.xp >= actor.system.xpNeeded,
      tabs: [
        { id: "sheet", label: loc("SOTU.Sheet.TabSheet"), active: this.#tab === "sheet" },
        {
          id: "background",
          label: loc(isCharacter ? "SOTU.Sheet.TabBackground" : "SOTU.Sheet.TabDescription"),
          active: this.#tab === "background"
        }
      ],
      showSheet: this.#tab === "sheet",
      showBackground: this.#tab === "background",
      races: localized(RACES, loc),
      armors: localized(ARMORS, a => `${loc(a.label)} (${ac} ${a.ac}, ${mv} ${a.mv})`),
      weapons: actor.itemTypes.weapon
    });
  }

  #item(target) {
    return this.document.items.get(target.closest("[data-item-id]")?.dataset.itemId);
  }

  static #attack(event, target) {
    return this.document.attack(target.dataset.itemId ? this.#item(target) : null);
  }
  static #stealth() { return this.document.stealth(); }
  static #save() { return this.document.save(); }
  static #rest() { return this.document.rest(); }
  static #longRest() { return this.document.longRest(); }
  static #rollHP() { return this.document.rollHP(); }
  static #levelUp() { return this.document.levelUp(); }
  static #danger(event, target) { return this.document.danger(target.dataset.dice); }
  static #morale() { return this.document.morale(); }
  static #addWeapon() {
    return this.document.createEmbeddedDocuments("Item", [{ name: loc("SOTU.Sheet.NewWeapon"), type: "weapon" }]);
  }
  static #editWeapon(event, target) { return this.#item(target)?.sheet.render(true); }
  static #deleteWeapon(event, target) { return this.#item(target)?.delete(); }

  static #changeTab(event, target) {
    this.#tab = target.dataset.navTab;
    const root = this.element;
    root.querySelectorAll("[data-nav-tab]").forEach(b => b.classList.toggle("active", b.dataset.navTab === this.#tab));
    root.querySelectorAll("[data-panel]").forEach(p => p.classList.toggle("active", p.dataset.panel === this.#tab));
  }
}

export class SotuItemSheet extends HandlebarsApplicationMixin(ItemSheetV2) {
  static DEFAULT_OPTIONS = {
    classes: ["sotu", "item"],
    position: { width: 420, height: 320 },
    form: { submitOnChange: true }
  };

  static PARTS = { body: { template: `${TPL}/item.hbs` } };

  async _prepareContext(options) {
    const ctx = await super._prepareContext(options);
    return Object.assign(ctx, {
      item: this.document,
      system: this.document.system,
      categories: localized(WEAPONS, w => `${loc(w.label)} · ${w.die}`)
    });
  }
}
