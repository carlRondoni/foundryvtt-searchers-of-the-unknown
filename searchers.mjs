import { SotuActor } from "./module/actor.mjs";
import { CharacterData, MonsterData, WeaponData } from "./module/data.mjs";
import { SotuActorSheet, SotuItemSheet } from "./module/sheets.mjs";
import { seedBackgroundTables, rollOracle, rollQuestion, rollAction, rollTheme, rollInspiration, SYSTEM_ID } from "./module/tables.mjs";

Hooks.once("init", () => {
  console.log("Searchers of the Unknown | Inicializando");

  CONFIG.Actor.documentClass = SotuActor;
  CONFIG.Actor.dataModels = { character: CharacterData, monster: MonsterData };
  CONFIG.Item.dataModels = { weapon: WeaponData };

  // Iniciativa: 1d10 + CA (el decimal desempata)
  CONFIG.Combat.initiative = { formula: "1d10 + @ac", decimals: 2 };

  const { DocumentSheetConfig } = foundry.applications.apps;
  DocumentSheetConfig.registerSheet(Actor, "searchers-of-the-unknown", SotuActorSheet, {
    types: ["character", "monster"], makeDefault: true, label: "Searchers of the Unknown"
  });
  DocumentSheetConfig.registerSheet(Item, "searchers-of-the-unknown", SotuItemSheet, {
    types: ["weapon"], makeDefault: true, label: "Searchers of the Unknown"
  });
  game.settings.register(SYSTEM_ID, "seededTables", {
    scope: "world", config: false, type: Object, default: {}
  });
  // Atajo de teclado (reasignable en Configurar controles)
  game.keybindings.register(SYSTEM_ID, "oracle", {
    name: "Consultar el Oráculo",
    hint: "Tira 1d6 en la tabla del Oráculo (Sí/No).",
    editable: [{ key: "KeyO", modifiers: ["Alt"] }],
    onDown: () => { rollOracle(); return true; }
  });

  game.keybindings.register(SYSTEM_ID, "question", {
    name: "Pregunta guía",
    hint: "Tira 1d6: quién, qué, dónde, cuándo, por qué o cómo.",
    editable: [{ key: "KeyP", modifiers: ["Alt"] }],
    onDown: () => { rollQuestion(); return true; }
  });

  game.keybindings.register(SYSTEM_ID, "inspiration", {
    name: "Inspiración (Acción + Tema)",
    hint: "Tira una Acción y un Tema aleatorios.",
    editable: [{ key: "KeyI", modifiers: ["Alt"] }],
    onDown: () => { rollInspiration(); return true; }
  });

  game.sotu = { rollOracle, rollQuestion, rollAction, rollTheme, rollInspiration };
});

// Botón "Daño" dentro de los mensajes de ataque
Hooks.on("renderChatMessageHTML", (message, html) => {
  html.querySelectorAll("[data-sotu-damage]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const actor = await fromUuid(btn.dataset.actorUuid);
      const roll = await new Roll(btn.dataset.sotuDamage).evaluate();
      await roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor }),
        flavor: `<b>Daño</b> (${btn.dataset.sotuDamage}) · réstalo de los PG del objetivo`
      });
    });
  });
});

Hooks.once("ready", async () => {
  if (game.user.isGM) await seedBackgroundTables();
});
