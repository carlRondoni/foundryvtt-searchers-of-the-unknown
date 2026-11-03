export const ARMORS = {
  none:    { label: "Sin armadura",      ac: 9, mv: 12 },
  leather: { label: "Armadura de cuero", ac: 7, mv: 9 },
  chain:   { label: "Cota de malla",     ac: 5, mv: 6 },
  plate:   { label: "Armadura de placas", ac: 3, mv: 3 }
};
export const SHIELD = { ac: -1, mv: -1 };

export const WEAPONS = {
  small: {
    label: "Arma pequeña (daga, honda…)", short: "Pequeña", die: "1d4",
    examples: ["Daga", "Honda", "Cuchillo"]
  },
  range: {
    label: "Arma a distancia (arco, ballesta…)", short: "A distancia", die: "1d6",
    examples: ["Arco", "Ballesta", "Jabalina"]
  },
  melee: {
    label: "Arma cuerpo a cuerpo (maza, espada…)", short: "Cuerpo a cuerpo", die: "1d8",
    examples: ["Maza", "Espada", "Martillo"]
  },
  twohanded: {
    label: "Arma a dos manos (mandoble, arma de asta…)", short: "A dos manos", die: "1d10",
    examples: ["Mandoble", "Arma de asta", "Hacha de guerra"]
  }
};

export const RACES = {
  human:    "Humano",
  darkelf:  "Elfo oscuro",
  dwarf:    "Enano",
  halforc:  "Semiorco",
  halfelf:  "Semielfo",
  halfling: "Mediano"
};

export const SEXES = {
  male:   "Masculino",
  female: "Femenino"
};