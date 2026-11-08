import { ARMORS, SHIELD, WEAPONS, RACES } from "./config.mjs";

const { NumberField, StringField, BooleanField, SchemaField } = foundry.data.fields;
const { TypeDataModel } = foundry.abstract;

const int = (initial, min = 0) => new NumberField({ required: true, integer: true, min, initial });

/** Personaje jugador: CA y MV se derivan de armadura + escudo. */
export class CharacterData extends TypeDataModel {
  static defineSchema() {
    return {
      level: int(1, 1),
      xp: int(0),
      hp: new SchemaField({
        value: new NumberField({ required: true, integer: true, initial: 0 }), // puede ser <= 0
        max: int(0) // se fija con la primera tirada de 1d8
      }),
      hpRolled: new BooleanField({ initial: false }),
      armor: new StringField({ required: true, initial: "none", choices: Object.keys(ARMORS) }),
      shield: new BooleanField({ initial: false }),
      race: new StringField({ required: true, initial: "human", choices: Object.keys(RACES) }),
      biography: new StringField({ initial: "" })
    };
  }

  static migrateData(source) {
    const legacy = { halfling: "hobbit", darkelf: "elf", halfelf: "elf", halforc: "human" };
    if (source.race in legacy) source.race = legacy[source.race];
    else if (source.race && !(source.race in RACES)) source.race = "human";
    // Ya no existe el nivel 0. Sus PG se conservan como total anterior para la tirada de 1d8.
    if (source.level === 0) source.level = 1;
    return super.migrateData(source);
  }

  prepareDerivedData() {
    const armor = ARMORS[this.armor] ?? ARMORS.none;
    this.ac = armor.ac + (this.shield ? SHIELD.ac : 0);
    this.mv = armor.mv + (this.shield ? SHIELD.mv : 0);
    this.hd = this.level;
    this.attacks = 1 + Math.floor(Math.max(0, this.level - 1) / 4);
    this.saveTarget = this.level + 4;
    this.xpNeeded = 2000 * this.level;
  }
}

/** Monstruo / PNJ: (CA, MV, DG, PG, #AT, D) tal cual en el módulo. */
export class MonsterData extends TypeDataModel {
  static defineSchema() {
    return {
      ac: new NumberField({ required: true, integer: true, initial: 6 }),
      mv: int(9),
      hd: int(1, 1),
      hp: new SchemaField({
        value: new NumberField({ required: true, integer: true, initial: 4 }),
        max: int(4)
      }),
      attacks: int(1, 1),
      damage: new StringField({ required: true, initial: "1d6" }),
      biography: new StringField({ initial: "" })
    };
  }

  prepareDerivedData() {
    this.saveTarget = this.hd + 4;
    this.xpValue = 100 * this.hd;
  }
}

export class WeaponData extends TypeDataModel {
  static defineSchema() {
    return {
      category: new StringField({ required: true, initial: "melee", choices: Object.keys(WEAPONS) }),
      description: new StringField({ initial: "" })
    };
  }

  prepareDerivedData() {
    this.damage = (WEAPONS[this.category] ?? WEAPONS.melee).die;
  }
}

/** Peligros posibles de un pergamino; "" = sin daño. */
export const SCROLL_DANGERS = ["", "1d8", "2d8", "4d8"];

/** Pergamino: un solo uso; el nivel del conjuro debe ser <= nivel del PJ. */
export class ScrollData extends TypeDataModel {
  static defineSchema() {
    return {
      level: int(1, 1),
      danger: new StringField({ required: true, blank: true, initial: "", choices: SCROLL_DANGERS }),
      description: new StringField({ initial: "" })
    };
  }
}
