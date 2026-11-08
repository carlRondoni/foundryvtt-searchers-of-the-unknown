# Registro de cambios

**Español** · [English](CHANGELOG.md)

Aquí se documentan los cambios importantes del proyecto. El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y las versiones siguen `0.MINOR.PATCH` (función nueva → minor, corrección → patch).

## [0.6.4] - Botón de subir de nivel

### Cambiado
- El botón **Subir de nivel** solo aparece cuando el personaje tiene los PX necesarios.

## [0.6.3] - Descanso por debajo de 0 PG

### Corregido
- **Descansar** ya no restaura los PG de un personaje por debajo de 0 PG, como piden las reglas. Mientras está herido, lo sustituye un botón **Descanso largo** que restaura todos los PG y lo anuncia en el chat.

### Añadido
- Los personajes heridos (por debajo de 0 PG) se ven en rojo con "Herido" en la ficha, y su token recibe el estado *Sangrando*.

## [0.6.2] - URLs del manifiesto

### Añadido
- `url`, `manifest` y `download` en `system.json`, para que Foundry pueda instalar y actualizar el sistema desde las *releases* de GitHub.

## [0.6.1] - Corrección de las traducciones

### Corregido
- La interfaz mostraba las claves (`SOTU.Sheet.Name`…) en vez del texto. La clave `SOTU.Sheet` era a la vez un texto y el padre de otras claves, lo que hacía que Foundry descartara todo el archivo de idioma. Ahora es `SOTU.SheetLabel`.

## [0.6.0] - Versión inicial

### Añadido
- Manifiesto del sistema para Foundry VTT (compatible con v13, verificado en v14), basado en las reglas de *Searchers of the Unknown* de Nicolas Dessaux.
- Tipos de actor **personaje** y **monstruo**, y tipo de objeto **arma**.
- **CA y MV calculados** a partir de la armadura y el escudo; número de ataques según el nivel; XP necesaria para subir de nivel (2000 × nivel).
- Los personajes **empiezan en nivel 1 y tiran 1d8 PG**. Tras cada subida de nivel, un botón vuelve a tirar todos los dados de golpe y se conserva el mejor total.
- Tiradas: **ataque** (d20 ≤ CA del objetivo + nivel, usa el token marcado, con botón de daño), **sigilo y proezas**, **salvación**, **peligros** (1d8 / 2d8 / 4d8), **moral** de monstruos, **descanso** y **subida de nivel**.
- **Iniciativa** `1d10 + CA`.
- Armas como objetos, con daño según la categoría (d4, d6, d8, d10).
- Selector de **raza** (humano, enano, hobbit, elfo), sin efecto en las reglas.
- **Ficha con dos pestañas**: Ficha y Trasfondo (los monstruos tienen Ficha y Descripción).
- Soporte completo en **español e inglés**: `lang/en.json` y `lang/es.json`, con fichas, mensajes del chat, avisos y tipos de documento localizados. Otros idiomas usan el inglés.
- `README.md` y `README.es.md`, `LICENSE` (MIT) y este registro de cambios.
- Dice So Nice y Dice Tray declarados como módulos recomendados.
