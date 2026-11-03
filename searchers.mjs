import { SotuActor } from "./module/actor.mjs";
import { CharacterData, MonsterData, WeaponData } from "./module/data.mjs";
import { SotuActorSheet, SotuItemSheet } from "./module/sheets.mjs";
import { SYSTEM_ID, loc } from "./module/config.mjs";
import {
  seedTables, rollOracle, rollQuestion, rollAction, rollTheme, rollInspiration
} from "./module/tables.mjs";

Hooks.once("init", () => {
  console.log("Searchers of the Unknown | Inicializando / Initializing");

  CONFIG.Actor.documentClass = SotuActor;
  CONFIG.Actor.dataModels = { character: CharacterData, monster: MonsterData };
  CONFIG.Item.dataModels = { weapon: WeaponData };

  // Iniciativa: 1d10 + CA (el decimal desempata)
  CONFIG.Combat.initiative = { formula: "1d10 + @ac", decimals: 2 };

  const { DocumentSheetConfig } = foundry.applications.apps;
  DocumentSheetConfig.registerSheet(Actor, SYSTEM_ID, SotuActorSheet, {
    types: ["character", "monster"], makeDefault: true, label: "SOTU.Sheet"
  });
  DocumentSheetConfig.registerSheet(Item, SYSTEM_ID, SotuItemSheet, {
    types: ["weapon"], makeDefault: true, label: "SOTU.Sheet"
  });

  // Registro de las tablas ya creadas en el mundo
  game.settings.register(SYSTEM_ID, "seededTables", {
    scope: "world", config: false, type: Object, default: {}
  });

  // Atajos de teclado (reasignables en Configurar controles)
  game.keybindings.register(SYSTEM_ID, "oracle", {
    name: "SOTU.Keys.Oracle",
    hint: "SOTU.Keys.OracleHint",
    editable: [{ key: "KeyO", modifiers: ["Alt"] }],
    onDown: () => { rollOracle(); return true; }
  });
  game.keybindings.register(SYSTEM_ID, "question", {
    name: "SOTU.Keys.Question",
    hint: "SOTU.Keys.QuestionHint",
    editable: [{ key: "KeyP", modifiers: ["Alt"] }],
    onDown: () => { rollQuestion(); return true; }
  });
  game.keybindings.register(SYSTEM_ID, "inspiration", {
    name: "SOTU.Keys.Inspiration",
    hint: "SOTU.Keys.InspirationHint",
    editable: [{ key: "KeyI", modifiers: ["Alt"] }],
    onDown: () => { rollInspiration(); return true; }
  });

  // Para macros: game.sotu.rollOracle(), etc.
  game.sotu = { rollOracle, rollQuestion, rollAction, rollTheme, rollInspiration };
});

// El GM crea las tablas (en su idioma) la primera vez que carga el mundo
Hooks.once("ready", async () => {
  if (game.user.isGM) await seedTables();
});

// Botón "Daño" dentro de los mensajes de ataque
Hooks.on("renderChatMessageHTML", (message, html) => {
  html.querySelectorAll("[data-sotu-damage]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const actor = await fromUuid(btn.dataset.actorUuid);
      const roll = await new Roll(btn.dataset.sotuDamage).evaluate();
      await roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor }),
        flavor: loc("SOTU.Chat.DamageFlavor")
      });
    });
  });
});
