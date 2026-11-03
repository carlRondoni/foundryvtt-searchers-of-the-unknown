# Searchers of the Unknown para Foundry VTT

**Español** · [English](README.md)

![Foundry VTT](https://img.shields.io/badge/Foundry-v13%20%E2%80%93%20v14-orange)
![Versión](https://img.shields.io/badge/versi%C3%B3n-0.5.0-blue)
![Licencia](https://img.shields.io/badge/licencia-MIT-green)

Sistema de juego para [Foundry VTT](https://foundryvtt.com) basado en **Searchers of the Unknown**, la forma mínima de jugar D&D old-school de Nicolas Dessaux: CA descendente, d20 por debajo, PG = dados de golpe y fichas que caben en una línea. Añade reglas caseras y herramientas de juego en solitario.

La interfaz es **bilingüe (español / inglés)** y sigue el idioma de Foundry de cada usuario.

## Características

**Reglas del juego**
- **CA y MV calculados** a partir de la armadura y el escudo.
- Los personajes empiezan en **nivel 0 con 4 PG fijos**. Al subir de nivel se vuelven a tirar todos los dados de golpe y se conserva el mejor total.
- Número de ataques según el nivel (1, 2 en nivel 5, 3 en nivel 9...).
- Tiradas integradas: **ataque** (d20 ≤ CA del objetivo + nivel, usa el token marcado), **sigilo y proezas**, **salvación**, **peligros** (1d8 / 2d8 / 4d8) y **moral** de monstruos.
- **Dados de daño explosivos**: si un dado saca su máximo, se vuelve a tirar y se suma.
- **Iniciativa** `1d10 + CA`.
- Armas como objetos (pequeña d4, distancia d6, cuerpo a cuerpo d8, dos manos d10), con botón de **arma aleatoria**.

**Creación de personaje**
- Selectores de **raza** (humano, elfo oscuro, enano, semiorco, semielfo, mediano) y **sexo**, con tirada aleatoria de raza (una sola vez).
- **Nombre aleatorio** según raza y sexo.
- Tres **tablas de trasfondo** (razón para aventurarse, secreto oscuro y origen familiar) cuyo resultado se añade a la descripción.
- Ficha con dos pestañas: **Ficha** y **Trasfondo**.

**Herramientas de juego en solitario**
- **Oráculo** Sí/No (1d6) y **Pregunta guía** (quién, qué, dónde, cuándo, por qué, cómo).
- **Oráculos de Acción y Tema** (1d100) e **Inspiración**, que da una Acción y un Tema a la vez.
- Todas las tablas se crean como *Rollable Tables* del mundo.

## Idiomas

La interfaz y los textos de las tablas están en **español e inglés**. Al tirar en una tabla, cada usuario ve el texto en su propio idioma. Las Rollable Tables del mundo se crean en el idioma del GM que carga el mundo por primera vez.

Para añadir un idioma: copia `lang/en.json` como `lang/<código>.json`, tradúcelo, regístralo en `system.json` (`languages`) y añade sus textos a `module/tables-text.mjs`.

## Módulos recomendados

Se declaran como recomendados en el manifiesto; el sistema funciona sin ellos.

| Módulo | Para qué |
|---|---|
| [Dice So Nice](https://foundryvtt.com/packages/dice-so-nice) | Dados 3D animados en todas las tiradas |
| [Dice Tray](https://foundryvtt.com/packages/dice-calculator) | Atajos de dados en el chat (d4, d6, d8, d10, d20) |

## Instalación

**Con la URL del manifiesto** (cuando haya una *release* publicada):

1. En Foundry: *Game Systems → Install System*.
2. Pega en *Manifest URL*:
   ```
   https://github.com/carlRondoni/foundryvtt-searchers-of-the-unknown/releases/latest/download/system.json
   ```

**Manual:**

1. Descarga el `.zip` de la última *release*.
2. Descomprímelo en `Data/systems/` de modo que quede `Data/systems/searchers-of-the-unknown/system.json`.
3. Reinicia Foundry y crea un mundo con este sistema.

> La carpeta del sistema debe llamarse **`searchers-of-the-unknown`** (el `id` del sistema), aunque el repositorio se llame distinto.

## Uso rápido

| Acción | Cómo |
|---|---|
| Consultar el Oráculo | `Alt + O` |
| Pregunta guía | `Alt + P` |
| Inspiración (Acción + Tema) | `Alt + I` |

Los atajos se pueden cambiar en *Configuración → Configurar controles*. También hay macros: `game.sotu.rollOracle()`, `game.sotu.rollQuestion()`, `game.sotu.rollAction()`, `game.sotu.rollTheme()` y `game.sotu.rollInspiration()`.

## Hoja de ruta

- [ ] Rastreador de exploración (turnos de mazmorra, exteriores y asaltos de combate) con tirada de encuentros.
- [ ] Comandos de chat para los oráculos.
- [ ] Antorchas, descansos y temporizadores.
- [ ] Aplicar el daño automáticamente a los objetivos.

## Créditos y licencias

- **Searchers of the Unknown** es obra de Nicolas Dessaux. Este proyecto es un trabajo de aficionado, sin ánimo de lucro y no afiliado a su autor. Este repositorio no incluye el texto del juego: para jugar necesitas el manual original.
- Los **oráculos de Acción y Tema** son los de *Ironsworn*, de Shawn Tomkin, bajo licencia [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), traducidos al español.
- Las **tablas de trasfondo** (razón para aventurarse, secreto oscuro y origen familiar) proceden de *Liberation of the Demon Slayer*, de Venger Satanis (Kort'thalis Publishing), traducidas al español. <!-- TODO: confirmar la licencia del módulo, o pedir permiso al autor, antes de publicar estos textos -->
- *Dungeons & Dragons* es marca registrada de Wizards of the Coast. Este proyecto no está afiliado a ellos ni reclama derechos sobre la marca.
- *Foundry Virtual Tabletop* es marca de Foundry Gaming LLC. Este proyecto no está afiliado a ellos.
- El **código** se publica bajo licencia [MIT](LICENSE).
