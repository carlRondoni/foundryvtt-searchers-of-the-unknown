import { ARMORS, SHIELD, WEAPONS, RACES, SEXES } from "./config.mjs";

const { NumberField, StringField, BooleanField, SchemaField } = foundry.data.fields;
const { TypeDataModel } = foundry.abstract;

const int = (initial, min = 0) => new NumberField({ required: true, integer: true, min, initial });

/** Personaje jugador: CA y MV se derivan de armadura + escudo. */
export class CharacterData extends TypeDataModel {
  static defineSchema() {
    return {
      level: int(0),
      xp: int(0),
      hp: new SchemaField({
        value: new NumberField({ required: true, integer: true, initial: 4 }), // puede ser <= 0
        max: int(4)
      }),
      hpRolled: new BooleanField({ initial: false }),
      armor: new StringField({ required: true, initial: "none", choices: Object.keys(ARMORS) }),
      shield: new BooleanField({ initial: false }),
      race: new StringField({ required: true, initial: "human", choices: Object.keys(RACES) }),
      raceRolled: new BooleanField({ initial: false }),
      sex: new StringField({ required: true, initial: "male", choices: Object.keys(SEXES) }),
      backgroundRolled: new SchemaField({
        reason: new BooleanField({ initial: false }),
        secret: new BooleanField({ initial: false }),
        station: new BooleanField({ initial: false })
      }),
      biography: new StringField({ initial: "" })
    };
  }

  static migrateData(source) {
    const legacy = { hobbit: "halfling" };
    if (source.race in legacy) source.race = legacy[source.race];
    else if (source.race && !(source.race in RACES)) source.race = "human";
    return super.migrateData(source);
  }

  prepareDerivedData() {
    const armor = ARMORS[this.armor] ?? ARMORS.none;
    this.ac = armor.ac + (this.shield ? SHIELD.ac : 0);
    this.mv = armor.mv + (this.shield ? SHIELD.mv : 0);
    this.hd = this.level;
    this.attacks = 1 + Math.floor(Math.max(0, this.level - 1) / 4);
    this.saveTarget = this.level + 4;
    this.xpNeeded = 2000 * Math.max(1, this.level);

    // Nivel 0: 4 PG obligatorios
    if (this.level === 0) {
      this.hp.max = 4;
      this.hp.value = Math.min(this.hp.value, 4);
    }
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
