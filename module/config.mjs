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

export const WEAPONS = {
  small:     { label: "SOTU.WeaponCategory.small",     die: "1d4" },
  range:     { label: "SOTU.WeaponCategory.range",     die: "1d6" },
  melee:     { label: "SOTU.WeaponCategory.melee",     die: "1d8" },
  twohanded: { label: "SOTU.WeaponCategory.twohanded", die: "1d10" }
};

/** Solo descriptivas: la raza no tiene efecto en las reglas. */
export const RACES = {
  human:  "SOTU.Race.human",
  dwarf:  "SOTU.Race.dwarf",
  hobbit: "SOTU.Race.hobbit",
  elf:    "SOTU.Race.elf"
};

/** { clave: texto localizado } para usar en <select>. */
export const localized = (table, fn = v => v) =>
  Object.fromEntries(Object.entries(table).map(([k, v]) => [k, fn(v)]));
