import { SotuActor } from "./module/actor.mjs";
import { CharacterData, MonsterData, WeaponData, ScrollData } from "./module/data.mjs";
import { SotuActorSheet, SotuItemSheet } from "./module/sheets.mjs";
import { SYSTEM_ID, loc } from "./module/config.mjs";

Hooks.once("init", () => {
  console.log("Searchers of the Unknown | Inicializando / Initializing");

  CONFIG.Actor.documentClass = SotuActor;
  CONFIG.Actor.dataModels = { character: CharacterData, monster: MonsterData };
  CONFIG.Item.dataModels = { weapon: WeaponData, scroll: ScrollData };

  // Iniciativa: 1d10 + CA. "decimals" solo indica los decimales que se muestran.
  CONFIG.Combat.initiative = { formula: "1d10 + @ac", decimals: 2 };

  const { DocumentSheetConfig } = foundry.applications.apps;
  DocumentSheetConfig.registerSheet(Actor, SYSTEM_ID, SotuActorSheet, {
    types: ["character", "monster"], makeDefault: true, label: "SOTU.SheetLabel"
  });
  DocumentSheetConfig.registerSheet(Item, SYSTEM_ID, SotuItemSheet, {
    types: ["weapon", "scroll"], makeDefault: true, label: "SOTU.SheetLabel"
  });
});

// Iniciativa por ataque: quien tiene varios #AT entra en el combate una vez por ataque
Hooks.on("createCombatant", (combatant, options, userId) => {
  if (userId !== game.user.id || options.sotuExtra) return;
  const attacks = combatant.actor?.system.attacks ?? 1;
  if (attacks <= 1) return;
  const { tokenId, sceneId, actorId, hidden } = combatant;
  const base = combatant.name;
  const extra = Array.from({ length: attacks - 1 }, (_, i) => ({
    tokenId, sceneId, actorId, hidden,
    name: loc("SOTU.Combat.AttackN", { name: base, n: i + 2 })
  }));
  combatant.parent.createEmbeddedDocuments("Combatant", extra, { sotuExtra: true });
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
