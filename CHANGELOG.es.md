# Registro de cambios

**Español** · [English](CHANGELOG.md)

Aquí se documentan los cambios importantes del proyecto. El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y las versiones siguen `0.MINOR.PATCH` (función nueva → minor, corrección → patch).

## [Sin publicar]

Previsto:
- Ventana de rastreo de exploración (turnos exteriores, turnos de mazmorra y asaltos de combate, con duraciones configurables y una tirada de encuentro 1d6 en mazmorras).
- Comandos de chat para los oráculos (un primer intento no funcionó en Foundry v14; ver la nota en la 0.4.0).
- Antorchas, descansos y temporizadores.
- Aplicar el daño a los objetivos automáticamente.
- Confirmar la licencia (o conseguir el permiso del autor) de las tablas de trasfondo antes de hacer público el repositorio.

## [0.5.0] - Bilingüe (español / inglés)

### Añadido
- Soporte completo en **español e inglés**: `lang/en.json` y `lang/es.json`, con fichas, mensajes del chat, avisos, atajos de teclado y tipos de documento localizados. Otros idiomas usan el inglés.
- Textos de las tablas en ambos idiomas (`module/tables-text.mjs`). Al tirar, se muestra el texto en el idioma de quien tira.
- `README.md` y `README.es.md`, `LICENSE` (MIT) y este registro de cambios.
- Créditos de las fuentes de las tablas y del juego base.

### Cambiado
- Proyecto consolidado y reorganizado: estructura de las tablas en `tables.mjs`, textos en `tables-text.mjs` e id del sistema en una única constante `SYSTEM_ID`.
- Las Rollable Tables del mundo se crean en el idioma del GM que carga el mundo por primera vez. Los botones de la ficha usan los textos del sistema en el idioma de cada usuario y no el texto de la tabla del mundo, así que las ediciones de una tabla solo se aplican al tirar directamente en ella.

## [0.4.0] - Oráculos de Acción y Tema

### Añadido
- **Oráculo de Acción** y **Oráculo de Tema** (1d100), traducidos al español. Basados en los oráculos de *Ironsworn*, de Shawn Tomkin (CC BY 4.0).
- **Inspiración**: una Acción y un Tema en un solo mensaje del chat. Atajo `Alt + I`.
- Macros `game.sotu.rollAction()`, `game.sotu.rollTheme()` y `game.sotu.rollInspiration()`.

### Nota
- Una `0.4.1` que intentó añadir comandos de chat (`/oraculo`, `/pregunta`, `/inspiracion`...) con el hook `chatMessage` y luego con un parche de `ChatLog#processMessage` no funcionó en Foundry v14 y se revirtió. Nunca se publicó.

## [0.3.0] - Pregunta guía

### Añadido
- Tabla de **Pregunta guía** (1d6: quién, qué, dónde, cuándo, por qué, cómo). Atajo `Alt + P` y macro `game.sotu.rollQuestion()`.
- El Oráculo y la Pregunta guía comparten una definición interna de "tablas de ayuda", de modo que una tabla nueva solo necesita una entrada.

## [0.2.0] - Creación de personaje y oráculo para juego en solitario

### Añadido
- **Inicio en nivel 0** con 4 PG fijos. Pasar de nivel 0 a 1 cuesta 2000 PX.
- **Tirada de PG una vez por nivel**: el botón aparece tras cada subida de nivel y desaparece al tirar (subir de nivel ya no tira los PG solo).
- Selector de **raza** y tirada de **raza aleatoria** de un solo uso, más un selector de **sexo**.
- **Arma aleatoria** (categoría y luego un arma concreta), limitada a 3 armas, o 2 con escudo.
- **Dados de daño explosivos**: un dado que saca su máximo se vuelve a tirar y se suma.
- **Tablas de trasfondo** como Rollable Tables del mundo (razón para aventurarse, secreto oscuro, origen familiar), traducidas al español. Cada botón de la ficha tira una vez, añade el resultado a la descripción y desaparece.
- **Ficha de dos pestañas**: Ficha y Trasfondo (los monstruos tienen Ficha y Descripción).
- **Nombre aleatorio** según raza y sexo, con listas locales en `module/names.mjs`.
- Tabla del **Oráculo** (1d6: No, y... / No / No, pero... / Sí, pero... / Sí / Sí, y...). Atajo `Alt + O` y macro `game.sotu.rollOracle()`.

### Cambiado
- Las razas son: humano, elfo oscuro, enano, semiorco, semielfo, mediano. Los personajes guardados con las razas antiguas se migran (hobbit → mediano, cualquier otra raza desconocida → humano).
- Ajustes de maquetación: raza, sexo y botones de dado alineados; cabecera de armas y botones alineados.

## [0.1.0] - Versión inicial

### Añadido
- Manifiesto del sistema de Foundry VTT (compatible con v13, verificado en v14).
- Tipos de actor **personaje** y **monstruo**, y tipo de objeto **arma**.
- **CA y MV del personaje calculados** a partir de armadura y escudo; número de ataques según el nivel; PX necesarios para subir de nivel (2000 × nivel).
- Tiradas: **ataque** (d20 ≤ CA del objetivo + nivel, usa el token marcado, con botón de daño), **sigilo y proezas**, **salvación**, **peligros** (1d8 / 2d8 / 4d8), **moral** de monstruos, **descanso** y **subir de nivel**.
- **Iniciativa** `1d10 + CA`.
- Armas como objetos, con daño según su categoría (d4, d6, d8, d10).
- Dice So Nice y Dice Tray declarados como módulos recomendados.
