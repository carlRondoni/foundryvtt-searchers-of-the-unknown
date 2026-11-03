export const SYSTEM_ID = "searchers-of-the-unknown";

/** Localiza una clave; con datos sustituye los {placeholders}. */
export const loc = (key, data) => (data ? game.i18n.format(key, data) : game.i18n.localize(key));

/** Las "label" son claves de idioma (lang/*.json); se localizan al usarlas. */
export const ARMORS = {
  none:    { label: "SOTU.Armor.none",    ac: 9, mv: 12 },
  leather: { label: "SOTU.Armor.leather", ac: 7, mv: 9 },
  chain:   { label: "SOTU.Armor.chain",   ac: 5, mv: 6 },
  plate:   { label: "SOTU.Armor.plate",   ac: 3, mv: 3 }
};
export const SHIELD = { ac: -1, mv: -1 };

/** examples: sufijos de SOTU.WeaponName.* usados por el arma aleatoria */
export const WEAPONS = {
  small:     { label: "SOTU.WeaponCategory.small",     short: "SOTU.WeaponShort.small",     die: "1d4",  examples: ["dagger", "sling", "knife"] },
  range:     { label: "SOTU.WeaponCategory.range",     short: "SOTU.WeaponShort.range",     die: "1d6",  examples: ["bow", "crossbow", "javelin"] },
  melee:     { label: "SOTU.WeaponCategory.melee",     short: "SOTU.WeaponShort.melee",     die: "1d8",  examples: ["mace", "sword", "hammer"] },
  twohanded: { label: "SOTU.WeaponCategory.twohanded", short: "SOTU.WeaponShort.twohanded", die: "1d10", examples: ["greatsword", "polearm", "battleaxe"] }
};

/** El orden es el de la tirada aleatoria (1d6). */
export const RACES = {
  human:    "SOTU.Race.human",
  darkelf:  "SOTU.Race.darkelf",
  dwarf:    "SOTU.Race.dwarf",
  halforc:  "SOTU.Race.halforc",
  halfelf:  "SOTU.Race.halfelf",
  halfling: "SOTU.Race.halfling"
};

export const SEXES = {
  male:   "SOTU.Sex.male",
  female: "SOTU.Sex.female"
};

/** { clave: texto localizado } para usar en <select>. */
export const localized = (table, fn = v => v) =>
  Object.fromEntries(Object.entries(table).map(([k, v]) => [k, fn(v)]));
