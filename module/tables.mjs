import { SYSTEM_ID, loc } from "./config.mjs";
import { TEXTS } from "./tables-text.mjs";

const singles = n => Array.from({ length: n }, (_, i) => [i + 1, i + 1]);

/**
 * Tablas de trasfondo: generan un botón en la pestaña Trasfondo.
 * Para añadir otra: una entrada aquí, sus textos en tables-text.mjs, sus claves
 * SOTU.TableName.* y SOTU.TableLabel.* en lang/*.json y su BooleanField en
 * backgroundRolled (data.mjs).
 */
export const BACKGROUND_TABLES = {
  reason:  { formula: "1d8", ranges: singles(8) },
  secret: {
    formula: "1d100",
    ranges: [
      [1, 3], [4, 8], [9, 11], [12, 13], [14, 18], [19, 23], [24, 25], [26, 27], [28, 30],
      [31, 33], [34, 36], [37, 38], [39, 40], [41, 42], [43, 45], [46, 48], [49, 51],
      [52, 54], [55, 56], [57, 58], [59, 60], [61, 62], [63, 65], [66, 68], [69, 71],
      [72, 74], [75, 76], [77, 78], [79, 81], [82, 83], [84, 85], [86, 87], [88, 89],
      [90, 93], [94, 96], [97, 98], [99, 100]
    ]
  },
  station: { formula: "1d13", ranges: singles(13) }
};

/** Tablas de ayuda al juego en solitario: no generan botón en la ficha. */
export const UTILITY_TABLES = {
  oracle:   { formula: "1d6",   ranges: singles(6) },
  question: { formula: "1d6",   ranges: singles(6) },
  action:   { formula: "1d100", ranges: singles(100) },
  theme:    { formula: "1d100", ranges: singles(100) }
};

const ALL = { ...BACKGROUND_TABLES, ...UTILITY_TABLES };

/** Idioma de los textos: el del usuario si lo tenemos, si no inglés. */
const textLang = () => (TEXTS[game.i18n.lang] ? game.i18n.lang : "en");

/** Busca la RollTable del mundo asociada a una clave. */
export function findTable(key) {
  return game.tables.find(t => t.getFlag(SYSTEM_ID, "background") === key) ?? null;
}

/**
 * Texto de un resultado en el idioma de quien tira (cada jugador lo ve en el suyo).
 * Si no se encuentra, se usa el texto de la propia tabla.
 */
export function tableText(key, result) {
  const index = ALL[key].ranges.findIndex(([low]) => low === result.range[0]);
  return TEXTS[textLang()][key]?.[index] ?? result.name ?? result.description ?? "";
}

/** Tira una tabla de ayuda y publica el resultado en el chat. */
export async function rollUtility(key) {
  const table = findTable(key);
  if (!table) {
    return ui.notifications.error(loc("SOTU.Notify.MissingTable", { name: loc(`SOTU.TableName.${key}`) }));
  }
  const { roll, results } = await table.roll();
  let text = results.map(r => tableText(key, r)).join(" ");
  if (key === "question") text = loc("SOTU.QuestionFormat", { text });
  await ChatMessage.create({
    speaker: ChatMessage.getSpeaker(),
    rolls: [roll],
    sound: CONFIG.sounds.dice,
    flavor: `<b>${loc(`SOTU.TableLabel.${key}`)}</b> (${table.formula}) → <b>${text}</b>`
  });
}

export const rollOracle = () => rollUtility("oracle");
export const rollQuestion = () => rollUtility("question");
export const rollAction = () => rollUtility("action");
export const rollTheme = () => rollUtility("theme");

/** Inspiración: una Acción y un Tema aleatorios en un solo mensaje. */
export async function rollInspiration() {
  const actionTable = findTable("action");
  const themeTable = findTable("theme");
  if (!actionTable || !themeTable) return ui.notifications.error(loc("SOTU.Notify.MissingTables"));

  const [a, t] = await Promise.all([actionTable.roll(), themeTable.roll()]);
  const text = (key, r) => r.results.map(x => tableText(key, x)).join(" ");
  await ChatMessage.create({
    speaker: ChatMessage.getSpeaker(),
    rolls: [a.roll, t.roll],
    sound: CONFIG.sounds.dice,
    flavor: `<b>${loc("SOTU.Chat.Inspiration")}</b> → <b>${text("action", a)}</b> + <b>${text("theme", t)}</b><br><small>${loc("SOTU.Chat.InspirationNote")}</small>`
  });
}

/**
 * Crea (una sola vez por tabla) las RollTables del mundo, en el idioma del GM.
 * Solo la ejecuta un GM. Los jugadores las pueden leer.
 */
export async function seedTables() {
  const seeded = foundry.utils.deepClone(game.settings.get(SYSTEM_ID, "seededTables") ?? {});
  const pending = Object.keys(ALL).filter(k => !seeded[k] && !findTable(k));
  if (!pending.length) return;
  const lang = textLang();

  let folder = null;
  if (pending.some(k => k in BACKGROUND_TABLES)) {
    folder = game.folders.find(f => f.type === "RollTable" && f.getFlag(SYSTEM_ID, "backgrounds"));
    folder ??= await Folder.create({
      name: loc("SOTU.FolderName"),
      type: "RollTable",
      flags: { [SYSTEM_ID]: { backgrounds: true } }
    });
  }

  for (const key of pending) {
    const def = ALL[key];
    await RollTable.create({
      name: loc(`SOTU.TableName.${key}`),
      formula: def.formula,
      replacement: true,
      displayRoll: true,
      folder: key in BACKGROUND_TABLES ? folder.id : null,
      ownership: { default: CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER },
      flags: { [SYSTEM_ID]: { background: key } },
      results: def.ranges.map((range, i) => ({
        type: CONST.TABLE_RESULT_TYPES.TEXT,
        name: TEXTS[lang][key][i],
        range,
        weight: range[1] - range[0] + 1
      }))
    });
    seeded[key] = true;
  }
  await game.settings.set(SYSTEM_ID, "seededTables", seeded);
}
