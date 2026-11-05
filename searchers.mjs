import { SotuActor } from "./module/actor.mjs";
import { CharacterData, MonsterData, WeaponData } from "./module/data.mjs";
import { SotuActorSheet, SotuItemSheet } from "./module/sheets.mjs";
import { SYSTEM_ID, loc } from "./module/config.mjs";

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
