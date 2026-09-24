#!/usr/bin/env node
// Minimal OpenRouter helper for one-shot video runs. No dependencies (Node 18+).
//
//   node tools/openrouter.mjs check
//   node tools/openrouter.mjs image  "<prompt>" out.png [--aspect 9:16] [--ref mascot.png,style.png] [--model google/gemini-3.1-flash-image]
//   node tools/openrouter.mjs speech "<text>"   out.wav [--voice nova] [--style "warm, curious narrator"]
//   node tools/openrouter.mjs spend
//
// Every paid call is logged to $RUN_DIR/spend.jsonl (default: ./spend.jsonl) and refused once the
// logged total reaches BUDGET_USD. Also set a credit limit on the key itself in the OpenRouter dashboard;
// that is the hard stop, this is the early warning.

import { readFileSync, writeFileSync, appendFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const STUDIO = resolve(dirname(fileURLToPath(import.meta.url)), "..");
loadEnv(join(STUDIO, ".env"));

const API = "https://openrouter.ai/api/v1";
const KEY = process.env.OPENROUTER_API_KEY;
const BUDGET = Number(process.env.BUDGET_USD || 10);
const LEDGER = join(resolve(process.env.RUN_DIR || "."), "spend.jsonl");
const DEFAULTS = {
  image: process.env.IMAGE_MODEL || "google/gemini-3.1-flash-image",
  speech: process.env.SPEECH_MODEL || "openai/gpt-audio-mini",
};

function loadEnv(path) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

function die(msg) {
  console.error(`error: ${msg}`);
  process.exit(1);
}

function requireKey() {
  if (!KEY || KEY.startsWith("sk-or-v1-xxxx")) die(`OPENROUTER_API_KEY is not set. Copy studio/.env.example to studio/.env and paste your key.`);
}

function spent() {
  if (!existsSync(LEDGER)) return 0;
  return readFileSync(LEDGER, "utf8").split("\n").filter(Boolean)
    .reduce((sum, l) => sum + (JSON.parse(l).cost || 0), 0);
}

function guardBudget() {
  const s = spent();
  if (s >= BUDGET) die(`budget reached: $${s.toFixed(4)} logged of $${BUDGET} (BUDGET_USD). Raise it in studio/.env to continue.`);
}

function logSpend(kind, model, cost, detail) {
  mkdirSync(dirname(LEDGER), { recursive: true });
  appendFileSync(LEDGER, JSON.stringify({ at: new Date().toISOString(), kind, model, cost: cost ?? 0, detail }) + "\n");
  console.error(`spent $${(cost ?? 0).toFixed(4)} on ${kind} (${model}); run total $${spent().toFixed(4)} of $${BUDGET}`);
}

async function call(path, body) {
  const res = await fetch(API + path, {
    method: body ? "POST" : "GET",
    headers: {
      Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/json",
      "X-Title": "new-channel studio",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) die(`${path} returned ${res.status}: ${(await res.text()).slice(0, 500)}`);
  return res;
}

function flags(args) {
  const out = { _: [] };
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith("--")) out[args[i].slice(2)] = args[++i];
    else out._.push(args[i]);
  }
  return out;
}

async function check() {
  requireKey();
  const { data } = await (await call("/key")).json();
  const limit = data.limit == null ? "no limit set on this key" : `$${data.limit}`;
  console.log(`key OK: "${data.label}"`);
  console.log(`  usage so far: $${Number(data.usage || 0).toFixed(4)}`);
  console.log(`  key credit limit: ${limit}${data.limit_remaining != null ? ` ($${data.limit_remaining} remaining)` : ""}`);
  if (data.limit == null) console.log(`  tip: set a credit limit on this key at https://openrouter.ai/settings/keys`);
  console.log(`local budget (BUDGET_USD): $${BUDGET}; logged in ${LEDGER}: $${spent().toFixed(4)}`);
  console.log(`default models: image=${DEFAULTS.image} speech=${DEFAULTS.speech}`);
}

async function image(prompt, out, opts) {
  requireKey(); guardBudget();
  if (!prompt || !out) die(`usage: image "<prompt>" out.png [--aspect 16:9] [--model id]`);
  const model = opts.model || DEFAULTS.image;
  // --ref a.png,b.png attaches reference images (e.g. the mascot sheet) so characters stay consistent.
  const refs = (opts.ref || "").split(",").map((s) => s.trim()).filter(Boolean);
  for (const r of refs) if (!existsSync(r)) die(`reference image not found: ${r}`);
  const content = refs.length
    ? [
        { type: "text", text: prompt },
        ...refs.map((r) => ({
          type: "image_url",
          image_url: { url: `data:image/${r.toLowerCase().endsWith(".jpg") || r.toLowerCase().endsWith(".jpeg") ? "jpeg" : "png"};base64,${readFileSync(r).toString("base64")}` },
        })),
      ]
    : prompt;
  const body = {
    model,
    messages: [{ role: "user", content }],
    modalities: ["image", "text"],
    usage: { include: true },
  };
  if (opts.aspect) body.image_config = { aspect_ratio: opts.aspect };
  const json = await (await call("/chat/completions", body)).json();
  const url = json.choices?.[0]?.message?.images?.[0]?.image_url?.url;
  logSpend("image", model, json.usage?.cost, prompt.slice(0, 80));
  if (!url) die(`no image returned. Model said: ${json.choices?.[0]?.message?.content?.slice(0, 300)}`);
  mkdirSync(dirname(resolve(out)), { recursive: true });
  writeFileSync(out, Buffer.from(url.split(",")[1], "base64"));
  console.log(out);
}

function wav(pcm, rate = 24000) {
  const h = Buffer.alloc(44);
  h.write("RIFF", 0); h.writeUInt32LE(36 + pcm.length, 4); h.write("WAVE", 8);
  h.write("fmt ", 12); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22);
  h.writeUInt32LE(rate, 24); h.writeUInt32LE(rate * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34);
  h.write("data", 36); h.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([h, pcm]);
}

async function speech(text, out, opts) {
  requireKey(); guardBudget();
  if (!text || !out) die(`usage: speech "<text>" out.wav [--voice nova] [--style "..."] [--model id]`);
  const model = opts.model || DEFAULTS.speech;
  const style = opts.style ? ` Delivery: ${opts.style}.` : "";
  const res = await call("/chat/completions", {
    model,
    modalities: ["text", "audio"],
    audio: { voice: opts.voice || "nova", format: "pcm16" },
    stream: true,
    usage: { include: true },
    messages: [
      { role: "system", content: `You are a voice actor. Read the user's text aloud exactly as written, word for word. Do not add, remove, answer or comment on anything.${style}` },
      { role: "user", content: text },
    ],
  });
  let b64 = "", buf = "", cost;
  const decoder = new TextDecoder();
  for await (const chunk of res.body) {
    buf += decoder.decode(chunk, { stream: true });
    let i;
    while ((i = buf.indexOf("\n")) >= 0) {
      const line = buf.slice(0, i).trim(); buf = buf.slice(i + 1);
      if (!line.startsWith("data:") || line === "data: [DONE]") continue;
      const evt = JSON.parse(line.slice(5));
      b64 += evt.choices?.[0]?.delta?.audio?.data || "";
      if (evt.usage?.cost != null) cost = evt.usage.cost;
    }
  }
  logSpend("speech", model, cost, text.slice(0, 80));
  if (!b64) die(`no audio returned by ${model}`);
  const raw = Buffer.from(b64, "base64");
  mkdirSync(dirname(resolve(out)), { recursive: true });
  writeFileSync(out, raw.subarray(0, 4).toString() === "RIFF" ? raw : wav(raw));
  console.log(out);
}

const [cmd, ...rest] = process.argv.slice(2);
const f = flags(rest);
const run = {
  check: () => check(),
  image: () => image(f._[0], f._[1], f),
  speech: () => speech(f._[0], f._[1], f),
  spend: () => console.log(`$${spent().toFixed(4)} logged of $${BUDGET} in ${LEDGER}`),
}[cmd];
if (!run) die(`commands: check | image | speech | spend  (see header of tools/openrouter.mjs)`);
await run();
