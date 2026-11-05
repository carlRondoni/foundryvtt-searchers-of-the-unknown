# Searchers of the Unknown for Foundry VTT

[Español](README.es.md) · **English**

![Foundry VTT](https://img.shields.io/badge/Foundry-v13%20%E2%80%93%20v14-orange)
![Version](https://img.shields.io/badge/version-0.6.2-blue)
![License](https://img.shields.io/badge/license-MIT-green)

A game system for [Foundry VTT](https://foundryvtt.com) based on **Searchers of the Unknown**, Nicolas Dessaux's minimalist way to play old-school D&D: descending AC, roll-under d20, HP = hit dice, and characters that fit on one line.

The interface is **bilingual (English / Spanish)** and follows each user's Foundry language setting.

## Features

- **AC and MV are calculated** from armor and shield.
- Characters start at **level 1 and roll 1d8 HP**. On level up, all hit dice are re-rolled and the better total is kept.
- Number of attacks by level (1, 2 at level 5, 3 at level 9...).
- Built-in rolls: **attack** (d20 ≤ target AC + level, uses the targeted token), **stealth and stunts**, **saving throw**, **dangers** (1d8 / 2d8 / 4d8) and monster **morale**.
- **Initiative** `1d10 + AC`.
- Weapons as items (small d4, ranged d6, melee d8, two-handed d10).
- **Race** selector (human, dwarf, hobbit, elf), with no effect on the rules.
- Two-tab sheet: **Sheet** and **Background**.

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

## Project structure

```
searchers-of-the-unknown/
├── system.json          manifest
├── searchers.mjs        entry point (registration, hooks)
├── lang/                en.json, es.json
├── module/
│   ├── config.mjs       armor, weapons, races
│   ├── data.mjs         data models (character, monster, weapon)
│   ├── actor.mjs        rolls and rules
│   └── sheets.mjs       actor and item sheets
├── templates/           Handlebars templates
└── styles/              CSS
```

## Credits and licenses

- **Searchers of the Unknown** is the work of Nicolas Dessaux. This is an unofficial fan project, non-commercial and not affiliated with its author. This repository does not include the game's text: you need the original rulebook to play.
- *Dungeons & Dragons* is a registered trademark of Wizards of the Coast. This project is not affiliated with them and claims no rights over the mark.
- *Foundry Virtual Tabletop* is a trademark of Foundry Gaming LLC. This project is not affiliated with them.
- The **code** is released under the [MIT](LICENSE) license.
