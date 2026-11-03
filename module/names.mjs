/**
 * Listas de nombres por raza (claves de RACES) y sexo (claves de SEXES).
 * Edítalas a tu gusto: añade o quita nombres sin tocar nada más.
 */
export const NAMES = {
  human: {
    male: ["Aldric", "Bran", "Cedric", "Doran", "Edmund", "Garrick", "Hadrian", "Joren", "Leofric", "Osric", "Roland", "Wystan"],
    female: ["Adela", "Brenna", "Cecily", "Elswyth", "Gwendolyn", "Isolde", "Maren", "Odette", "Rowena", "Sybil", "Tamsin", "Ysolde"],
    surnames: ["Ashford", "Blackwood", "Corvane", "Dunmere", "Fairwind", "Greywater", "Holloway", "Thornwick", "Whitlock", "Marlowe"]
  },
  darkelf: {
    male: ["Dhaeron", "Ilvarn", "Kyrthas", "Malvorin", "Nyrael", "Szorath", "Tarlyth", "Vhaeros", "Zelnar", "Xanthir"],
    female: ["Ahlyra", "Dyrisse", "Eilistra", "Ilnaya", "Malyth", "Nhaesa", "Qiloris", "Sylvaine", "Vhesara", "Zinthra"],
    surnames: ["Kharvash", "Velquor", "Nazthyl", "Orymyr", "Ilmaris", "Zaelthor", "Vexyr", "Xylthin"]
  },
  dwarf: {
    male: ["Baldrek", "Dagran", "Durgan", "Fargrim", "Gorrin", "Harbek", "Kazrik", "Orsik", "Rurik", "Thordak"],
    female: ["Audhild", "Bryndis", "Dagny", "Frida", "Gunnhild", "Helga", "Kathra", "Ragna", "Sigrun", "Torvi"],
    surnames: ["Ironbrow", "Stonehelm", "Deepdelver", "Goldvein", "Hammerfall", "Anvilborn", "Coalbeard", "Flintforge"]
  },
  halforc: {
    male: ["Brug", "Dargut", "Grakh", "Hruk", "Krag", "Morzak", "Ruzgar", "Skarn", "Throk", "Ugoth"],
    female: ["Barga", "Dresha", "Grisha", "Hurga", "Kazra", "Mogra", "Ruzka", "Shagra", "Urzula", "Vrega"],
    surnames: ["Bonecrusher", "Skullsplitter", "Redfang", "Ironhide", "Blacktusk", "Grimjaw", "Stormhowl", "Gutripper"]
  },
  halfelf: {
    male: ["Alaric", "Caelan", "Darian", "Elias", "Faelan", "Kieran", "Lorien", "Merrick", "Soren", "Theren"],
    female: ["Aelwen", "Briseis", "Caliel", "Elara", "Faye", "Isaura", "Liriel", "Mirelle", "Seraphine", "Thalia"],
    surnames: ["Amberleaf", "Duskwalker", "Evenstar", "Moonbrook", "Silverbough", "Starweaver", "Swiftbrook", "Wanderlight"]
  },
  halfling: {
    male: ["Alton", "Corrin", "Eldon", "Finnan", "Garret", "Lyle", "Merric", "Perrin", "Roscoe", "Wendel"],
    female: ["Bree", "Callie", "Daisy", "Euphemia", "Lidda", "Marigold", "Nedda", "Rosie", "Tilly", "Verna"],
    surnames: ["Goodbarrel", "Greenbottle", "Hilltopple", "Brushgather", "Tealeaf", "Underbough", "Thorngage", "Warmhearth"]
  }
};

const pick = list => list[Math.floor(CONFIG.Dice.randomUniform() * list.length)];

/** Nombre aleatorio "Nombre Apellido" según raza y sexo. */
export function randomName(race, sex) {
  const set = NAMES[race] ?? NAMES.human;
  const first = pick(set[sex] ?? set.male);
  return `${first} ${pick(set.surnames)}`;
}
