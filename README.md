# Searchers of the Unknown for Foundry VTT

[Español](README.es.md) · **English**

![Foundry VTT](https://img.shields.io/badge/Foundry-v13%20%E2%80%93%20v14-orange)
![Version](https://img.shields.io/badge/version-0.5.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

A game system for [Foundry VTT](https://foundryvtt.com) based on **Searchers of the Unknown**, Nicolas Dessaux's minimalist way to play old-school D&D: descending AC, roll-under d20, HP = hit dice, and characters that fit on one line. It adds house rules and solo-play tools.

The interface is **bilingual (English / Spanish)** and follows each user's Foundry language setting.

## Features

**Game rules**
- **AC and MV are calculated** from armor and shield.
- Characters start at **level 0 with a fixed 4 HP**. On level up, all hit dice are re-rolled and the better total is kept.
- Number of attacks by level (1, 2 at level 5, 3 at level 9...).
- Built-in rolls: **attack** (d20 ≤ target AC + level, uses the targeted token), **stealth and stunts**, **saving throw**, **dangers** (1d8 / 2d8 / 4d8) and monster **morale**.
- **Exploding damage dice**: a die that rolls its maximum is re-rolled and added.
- **Initiative** `1d10 + AC`.
- Weapons as items (small d4, ranged d6, melee d8, two-handed d10), with a **random weapon** button.

**Character creation**
- **Race** (human, dark elf, dwarf, half-orc, half-elf, halfling) and **sex** selectors, with a one-time random race roll.
- **Random name** by race and sex.
- Three **background tables** (reason to adventure, dark secret, family background); the result is added to the description.
- Two-tab sheet: **Sheet** and **Background**.

**Solo-play tools**
- **Oracle** Yes/No (1d6) and **Guiding question** (who, what, where, when, why, how).
- **Action and Theme oracles** (1d100) and **Inspiration**, which gives one Action and one Theme at once.
- Every table is created as a world *Rollable Table*.

## Languages

The UI and the table texts are available in **English and Spanish**. Rolls on tables show the text in the language of the user who rolls. The world's Rollable Tables are created in the language of the GM who first loads the world.

To add a language: copy `lang/en.json` as `lang/<code>.json`, translate it, register it in `system.json` (`languages`) and add its texts to `module/tables-text.mjs`.

## Recommended modules

Declared as recommended in the manifest; the system works without them.

| Module | Purpose |
|---|---|
| [Dice So Nice](https://foundryvtt.com/packages/dice-so-nice) | Animated 3D dice on every roll |
| [Dice Tray](https://foundryvtt.com/packages/dice-calculator) | Dice shortcuts in the chat (d4, d6, d8, d10, d20) |

## Installation

**Manifest URL** (once a release is published):

1. In Foundry: *Game Systems → Install System*.
2. Paste into *Manifest URL*:
   ```
   https://github.com/carlRondoni/foundryvtt-searchers-of-the-unknown/releases/latest/download/system.json
   ```

**Manual:**

1. Download the `.zip` from the latest release.
2. Extract it to `Data/systems/` so you get `Data/systems/searchers-of-the-unknown/system.json`.
3. Restart Foundry and create a world with this system.

> The system folder must be named **`searchers-of-the-unknown`** (the system `id`), even if the repository has a different name.

## Quick use

| Action | How |
|---|---|
| Consult the Oracle | `Alt + O` |
| Guiding question | `Alt + P` |
| Inspiration (Action + Theme) | `Alt + I` |

Shortcuts can be changed in *Settings → Configure Controls*. Macros are also available: `game.sotu.rollOracle()`, `game.sotu.rollQuestion()`, `game.sotu.rollAction()`, `game.sotu.rollTheme()` and `game.sotu.rollInspiration()`.

## Project structure

```
searchers-of-the-unknown/
├── system.json          manifest
├── searchers.mjs        entry point (registration, shortcuts, hooks)
├── lang/                en.json, es.json
├── module/
│   ├── config.mjs       armor, weapons, races, sexes
│   ├── data.mjs         data models (character, monster, weapon)
│   ├── actor.mjs        rolls and rules
│   ├── sheets.mjs       actor and item sheets
│   ├── tables.mjs       table structure and rolling
│   ├── tables-text.mjs  table texts, per language
│   └── names.mjs        name lists by race and sex
├── templates/           Handlebars templates
└── styles/              CSS
```

## Roadmap

- [ ] Exploration tracker (dungeon turns, overland turns and combat rounds) with encounter rolls.
- [ ] Chat commands for the oracles.
- [ ] Torches, rests and timers.
- [ ] Apply damage to targets automatically.

## Credits and licenses

- **Searchers of the Unknown** is the work of Nicolas Dessaux. This is an unofficial fan project, non-commercial and not affiliated with its author. This repository does not include the game's text: you need the original rulebook to play.
- The **Action and Theme oracles** are from *Ironsworn* by Shawn Tomkin, under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), translated to Spanish.
- The **background tables** (reason to adventure, dark secret and family background) come from *Liberation of the Demon Slayer* by Venger Satanis (Kort'thalis Publishing), translated to Spanish. <!-- TODO: confirm the module's license, or get the author's permission, before publishing these texts -->
- *Dungeons & Dragons* is a registered trademark of Wizards of the Coast. This project is not affiliated with them and claims no rights over the mark.
- *Foundry Virtual Tabletop* is a trademark of Foundry Gaming LLC. This project is not affiliated with them.
- The **code** is released under the [MIT](LICENSE) license.
