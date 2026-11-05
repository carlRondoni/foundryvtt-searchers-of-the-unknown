# Changelog

[Español](CHANGELOG.es.md) · **English**

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and versions follow `0.MINOR.PATCH` (new feature → minor, fix → patch).

## [0.6.1] - Translations fix

### Fixed
- The interface showed raw keys (`SOTU.Sheet.Name`…) instead of text. The key `SOTU.Sheet` was both a text and the parent of other keys, which made Foundry discard the whole language file. It is now `SOTU.SheetLabel`.

## [0.6.0] - Initial version

### Added
- Foundry VTT system manifest (compatible with v13, verified on v14), based on the rules of *Searchers of the Unknown* by Nicolas Dessaux.
- Actor types **character** and **monster**, and Item type **weapon**.
- Character **AC and MV calculated** from armor and shield; number of attacks by level; XP needed to level up (2000 × level).
- Characters **start at level 1 and roll 1d8 HP**. After each level up, a button re-rolls all hit dice and the better total is kept.
- Rolls: **attack** (d20 ≤ target AC + level, uses the targeted token, with a damage button), **stealth and stunts**, **saving throw**, **dangers** (1d8 / 2d8 / 4d8), monster **morale**, **rest** and **level up**.
- **Initiative** `1d10 + AC`.
- Weapons as items, with damage by category (d4, d6, d8, d10).
- **Race** selector (human, dwarf, hobbit, elf), with no effect on the rules.
- **Two-tab sheet**: Sheet and Background (monsters get Sheet and Description).
- Full **English and Spanish** support: `lang/en.json` and `lang/es.json`, with localized sheets, chat messages, notifications and document types. Other languages fall back to English.
- `README.md` and `README.es.md`, `LICENSE` (MIT) and this changelog.
- Dice So Nice and Dice Tray declared as recommended modules.
