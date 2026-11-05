#!/usr/bin/env node
// Comprobaciones de consistencia del sistema. Uso: node scripts/check.mjs
import { readFileSync, readdirSync, statSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const fail = msg => errors.push(msg);
const read = p => readFileSync(join(ROOT, p), "utf8");

const walk = dir => readdirSync(join(ROOT, dir)).flatMap(name => {
  const rel = join(dir, name);
  if (name === "node_modules" || name.startsWith(".")) return [];
  return statSync(join(ROOT, rel)).isDirectory() ? walk(rel) : [rel];
});
const files = walk(".");

// 1. Sintaxis de los módulos
for (const f of files.filter(f => f.endsWith(".mjs"))) {
  try { execFileSync(process.execPath, ["--check", join(ROOT, f)], { stdio: "pipe" }); }
  catch (e) { fail(`Sintaxis inválida en ${f}: ${e.stderr?.toString().split("\n")[0]}`); }
}

// 2. JSON válidos
let manifest;
try { manifest = JSON.parse(read("system.json")); } catch (e) { fail(`system.json inválido: ${e.message}`); }
const lang = {};
for (const l of ["en", "es"]) {
  try { lang[l] = JSON.parse(read(`lang/${l}.json`)); } catch (e) { fail(`lang/${l}.json inválido: ${e.message}`); }
}

// 3. Idiomas: mismas claves y mismos {placeholders}
if (lang.en && lang.es) {
  const ph = s => [...s.matchAll(/\{(\w+)\}/g)].map(m => m[1]).sort().join(",");
  for (const k of new Set([...Object.keys(lang.en), ...Object.keys(lang.es)])) {
    if (!(k in lang.en)) fail(`Falta en lang/en.json: ${k}`);
    else if (!(k in lang.es)) fail(`Falta en lang/es.json: ${k}`);
    else if (ph(lang.en[k]) !== ph(lang.es[k])) fail(`Placeholders distintos en ${k}`);
  }
  // Foundry expande los puntos y descarta TODO el archivo si una clave es texto y a la vez padre de otra
  const keys = Object.keys(lang.en);
  for (const k of keys) if (keys.some(x => x.startsWith(`${k}.`))) fail(`Clave a la vez texto y padre de otras: ${k}`);
  // 4. Todas las claves SOTU.* usadas en código y plantillas existen
  for (const f of files.filter(f => /\.(mjs|hbs)$/.test(f) && !f.includes("lang/"))) {
    for (const [k] of read(f).matchAll(/SOTU\.[A-Za-z0-9_.]*[A-Za-z0-9_]\.?/g)) {
      if (k.endsWith(".")) {
        if (!Object.keys(lang.en).some(x => x.startsWith(k))) fail(`Ninguna clave con el prefijo ${k} (${f})`);
      } else if (!(k in lang.en)) fail(`Clave inexistente ${k} (${f})`);
    }
  }
}

// 5. Versión coherente (system.json, READMEs, CHANGELOGs)
if (manifest) {
  const v = manifest.version;
  if (!/^\d+\.\d+\.\d+$/.test(v)) fail(`Versión no válida en system.json: ${v}`);
  for (const f of ["README.md", "README.es.md"]) if (!read(f).includes(v)) fail(`${f} no menciona la versión ${v}`);
  for (const f of ["CHANGELOG.md", "CHANGELOG.es.md"]) {
    const first = read(f).match(/^## \[(\d+\.\d+\.\d+)\]/m)?.[1];
    if (first !== v) fail(`${f}: la última versión es ${first} y system.json dice ${v}`);
  }
  if (!manifest.languages?.every(l => files.includes(l.path))) fail("system.json: hay idiomas con archivo inexistente");
  for (const m of manifest.esmodules ?? []) if (!files.includes(m)) fail(`esmodule inexistente: ${m}`);
}

if (errors.length) {
  console.error(`\n✖ ${errors.length} problema(s):\n` + errors.map(e => ` - ${e}`).join("\n"));
  process.exit(1);
}
console.log("✔ Todo correcto: sintaxis, idiomas y versiones.");
