# Changelog

[Español](CHANGELOG.es.md) · **English**

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and versions follow `0.MINOR.PATCH` (new feature → minor, fix → patch).

## [0.7.0] - Easy actions, initiative per attack, scrolls and starting weapons

### Added
- **Easy (1d10)** button next to stealth and stunts, for actions the GM considers easy.
- **Initiative per attack**: a character or monster with several attacks joins combat once per attack ("Orc · attack 2"), and each entry rolls its own initiative. Removing the token from combat removes all its entries.
- **Scrolls**, a new item type with spell level, optional danger damage (1d8 / 2d8 / 4d8) and description. A character can use one only if the spell level is not above their own; it is posted to the chat and used up.
- The weapons header shows the starting gear count (three weapons, or two with a shield) and turns red when it is exceeded. Adding more weapons is still allowed.

## [0.6.4] - Level up button

### Changed
- The **Level up** button only appears when the character has the XP needed.

## [0.6.3] - Rest below 0 HP

### Fixed
- **Rest** no longer restores the HP of a character below 0 HP, as the rules require. A **Long rest** button replaces it while the character is wounded, restores all HP and posts it to the chat.

### Added
- Wounded characters (below 0 HP) are shown in red with "Wounded" on the sheet, and their token gets the *Bleeding* status.

## [0.6.2] - Manifest URLs

### Added
- `url`, `manifest` and `download` in `system.json`, so Foundry can install and update the system from GitHub releases.

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
