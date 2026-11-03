import { ARMORS, WEAPONS, RACES, SEXES } from "./config.mjs";
import { BACKGROUND_TABLES } from "./tables.mjs";

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2, ItemSheetV2 } = foundry.applications.sheets;
const TPL = "systems/searchers-of-the-unknown/templates";

const labels = (table, fn) => Object.fromEntries(Object.entries(table).map(([k, v]) => [k, fn(v)]));

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
      rollHP: SotuActorSheet.#rollHP,
      levelUp: SotuActorSheet.#levelUp,
      danger: SotuActorSheet.#danger,
      morale: SotuActorSheet.#morale,
      addWeapon: SotuActorSheet.#addWeapon,
      editWeapon: SotuActorSheet.#editWeapon,
      deleteWeapon: SotuActorSheet.#deleteWeapon,
      rollRace: SotuActorSheet.#rollRace,
      rollWeapon: SotuActorSheet.#rollWeapon,
      rollBackground: SotuActorSheet.#rollBackground,
      changeTab: SotuActorSheet.#changeTab,
      rollName: SotuActorSheet.#rollName,
    }
  };

  static PARTS = { body: { template: `${TPL}/actor.hbs` } };

  async _prepareContext(options) {
    const ctx = await super._prepareContext(options);
    const actor = this.document;
    const isCharacter = actor.type === "character";
    const weapons = actor.itemTypes.weapon;
    return Object.assign(ctx, {
      actor,
      system: actor.system,
      isCharacter,
      tabs: [
        { id: "sheet", label: "Ficha", active: this.#tab === "sheet" },
        { id: "background", label: isCharacter ? "Trasfondo" : "Descripción", active: this.#tab === "background" }
      ],
      showSheet: this.#tab === "sheet",
      showBackground: this.#tab === "background",
      races: RACES,
      sexes: SEXES,
      armors: labels(ARMORS, a => `${a.label} (CA ${a.ac}, MV ${a.mv})`),
      weapons,
      canRollWeapon: isCharacter && weapons.length < actor.weaponLimit,
      backgrounds: isCharacter
        ? Object.entries(BACKGROUND_TABLES)
            .filter(([key]) => !actor.system.backgroundRolled?.[key])
            .map(([key, d]) => ({ key, label: d.title }))
        : []
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
  static #rollHP() { return this.document.rollHP(); }
  static #levelUp() { return this.document.levelUp(); }
  static #danger(event, target) { return this.document.danger(target.dataset.dice); }
  static #morale() { return this.document.morale(); }
  static #addWeapon() {
    return this.document.createEmbeddedDocuments("Item", [{ name: "Nueva arma", type: "weapon" }]);
  }
  static #editWeapon(event, target) { return this.#item(target)?.sheet.render(true); }
  static #deleteWeapon(event, target) { return this.#item(target)?.delete(); }
  static #rollRace() { return this.document.rollRace(); }
  static #rollWeapon() { return this.document.rollWeapon(); }
  static #rollBackground(event, target) { return this.document.rollBackground(target.dataset.table); }
  static #rollName() { return this.document.rollName(); }

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
      categories: labels(WEAPONS, w => `${w.label} · ${w.die}`)
    });
  }
}
