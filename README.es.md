# Searchers of the Unknown para Foundry VTT

**Español** · [English](README.md)

![Foundry VTT](https://img.shields.io/badge/Foundry-v13%20%E2%80%93%20v14-orange)
![Versión](https://img.shields.io/badge/versi%C3%B3n-0.6.2-blue)
![Licencia](https://img.shields.io/badge/licencia-MIT-green)

Sistema de juego para [Foundry VTT](https://foundryvtt.com) basado en **Searchers of the Unknown**, la forma mínima de jugar D&D old-school de Nicolas Dessaux: CA descendente, d20 por debajo, PG = dados de golpe y fichas que caben en una línea.

La interfaz es **bilingüe (español / inglés)** y sigue el idioma de Foundry de cada usuario.

## Características

- **CA y MV calculados** a partir de la armadura y el escudo.
- Los personajes empiezan en **nivel 1 y tiran 1d8 PG**. Al subir de nivel se vuelven a tirar todos los dados de golpe y se conserva el mejor total.
- Número de ataques según el nivel (1, 2 en nivel 5, 3 en nivel 9...).
- Tiradas integradas: **ataque** (d20 ≤ CA del objetivo + nivel, usa el token marcado), **sigilo y proezas**, **salvación**, **peligros** (1d8 / 2d8 / 4d8) y **moral** de monstruos.
- **Iniciativa** `1d10 + CA`.
- Armas como objetos (pequeña d4, distancia d6, cuerpo a cuerpo d8, dos manos d10).
- Selector de **raza** (humano, enano, hobbit, elfo), sin efecto en las reglas.
- Ficha con dos pestañas: **Ficha** y **Trasfondo**.

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

## Créditos y licencias

- **Searchers of the Unknown** es obra de Nicolas Dessaux. Este proyecto es un trabajo de aficionado, sin ánimo de lucro y no afiliado a su autor. Este repositorio no incluye el texto del juego: para jugar necesitas el manual original.
- *Dungeons & Dragons* es marca registrada de Wizards of the Coast. Este proyecto no está afiliado a ellos ni reclama derechos sobre la marca.
- *Foundry Virtual Tabletop* es marca de Foundry Gaming LLC. Este proyecto no está afiliado a ellos.
- El **código** se publica bajo licencia [MIT](LICENSE).
