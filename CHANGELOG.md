# Changelog

[Español](CHANGELOG.es.md) · **English**

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and versions follow `0.MINOR.PATCH` (new feature → minor, fix → patch).

## [Unreleased]

Planned:
- Exploration tracker window (overland turns, dungeon turns and combat rounds, with configurable durations and a 1d6 encounter roll in dungeons).
- Chat commands for the oracles (a first attempt did not work on Foundry v14; see the note under 0.4.0).
- Torches, rests and timers.
- Apply damage to targets automatically.
- Confirm the license (or get the author's permission) for the background tables before making the repository public.

## [0.5.0] - Bilingual (English / Spanish)

### Added
- Full **English and Spanish** support: `lang/en.json` and `lang/es.json`, localized sheets, chat messages, notifications, keybindings and document types. Other languages fall back to English.
- Table texts in both languages (`module/tables-text.mjs`). A roll shows the text in the language of the user who rolls.
- `README.md` and `README.es.md`, `LICENSE` (MIT) and this changelog.
- Credits for the sources of the tables and the base game.

### Changed
- Whole project consolidated and reorganized: table structure in `tables.mjs`, texts in `tables-text.mjs`, system id in a single `SYSTEM_ID` constant.
- The world's Rollable Tables are created in the language of the GM who first loads the world. Sheet buttons use the system texts of each user's language instead of the world table's text, so edits made to a world table apply only when rolling on the table directly.

## [0.4.0] - Action and Theme oracles

### Added
- **Action Oracle** and **Theme Oracle** (1d100), translated to Spanish. Based on the oracles from *Ironsworn* by Shawn Tomkin (CC BY 4.0).
- **Inspiration**: one Action and one Theme in a single chat message. Shortcut `Alt + I`.
- Macros `game.sotu.rollAction()`, `game.sotu.rollTheme()` and `game.sotu.rollInspiration()`.

### Note
- A `0.4.1` attempt to add slash commands (`/oraculo`, `/pregunta`, `/inspiracion`...) through the `chatMessage` hook and then through a `ChatLog#processMessage` patch did not work on Foundry v14 and was reverted. It was never released.

## [0.3.0] - Guiding question

### Added
- **Guiding question** table (1d6: who, what, where, when, why, how). Shortcut `Alt + P` and macro `game.sotu.rollQuestion()`.
- Oracle and Guiding question share one internal definition of "utility tables", so new helper tables need a single entry.

## [0.2.0] - Character creation and solo-play oracle

### Added
- **Level 0 start** with a fixed 4 HP. Leveling from 0 to 1 costs 2000 XP.
- **HP roll once per level**: the button appears after each level up and disappears once rolled (level up no longer rolls HP by itself).
- **Race** selector and one-time **random race** roll, plus a **sex** selector.
- **Random weapon** (category, then a specific weapon), limited to 3 weapons, or 2 with a shield.
- **Exploding damage dice**: a die that rolls its maximum is rolled again and added.
- **Background tables** as world Rollable Tables (reason to adventure, dark secret, family background), translated to Spanish. Each sheet button rolls once, appends the result to the description and disappears.
- **Two-tab sheet**: Sheet and Background (monsters get Sheet and Description).
- **Random name** by race and sex, from local lists in `module/names.mjs`.
- **Oracle** table (1d6: No, and... / No / No, but... / Yes, but... / Yes / Yes, and...). Shortcut `Alt + O` and macro `game.sotu.rollOracle()`.

### Changed
- Races are: human, dark elf, dwarf, half-orc, half-elf, halfling. Characters saved with the old races are migrated (hobbit → halfling, any other unknown race → human).
- Layout adjustments: race, sex and dice buttons aligned; weapons header and buttons aligned.

## [0.1.0] - Initial version

### Added
- Foundry VTT system manifest (compatible with v13, verified on v14).
- Actor types **character** and **monster**, and Item type **weapon**.
- Character **AC and MV calculated** from armor and shield; number of attacks by level; XP needed to level up (2000 × level).
- Rolls: **attack** (d20 ≤ target AC + level, uses the targeted token, with a damage button), **stealth and stunts**, **saving throw**, **dangers** (1d8 / 2d8 / 4d8), monster **morale**, **rest** and **level up**.
- **Initiative** `1d10 + AC`.
- Weapons as items, with damage by category (d4, d6, d8, d10).
- Dice So Nice and Dice Tray declared as recommended modules.
