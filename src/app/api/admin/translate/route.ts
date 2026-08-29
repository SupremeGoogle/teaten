import { NextResponse } from "next/server";
import { LANGS, type Lang } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const API_URL = "https://api.deepseek.com/chat/completions";
const MODEL = "deepseek-chat";
/** Texts per request — keeps each completion well inside the model's output budget. */
const BATCH_SIZE = 30;

const LANG_NAMES: Record<Lang, string> = {
  en: "English",
  sq: "Albanian",
  ru: "Russian",
};

type Entry = { path: string; text: string; missing: Lang[] };

function systemPrompt(target: Lang): string {
  return [
    `You translate website copy for Tea Ten Beauty & Spa, a beauty salon in Prishtina, Kosovo, from English into ${LANG_NAMES[target]}.`,
    "Rules:",
    "- Keep the warm, calm, premium tone of a boutique spa.",
    "- Keep brand and product names exactly as written: Tea Ten, Clarins, Circadia, Hydrafacial, Dermalux Flex, OxyGeneo, SkinPen, WhatsApp.",
    "- Keep numbers, prices, currency symbols, dates and units unchanged.",
    "- Do not add, remove or explain anything. Translate only.",
    "- Preserve leading and trailing punctuation and capitalisation style.",
    'Reply with a JSON object shaped {"items":[{"id":"<id>","text":"<translation>"}]} covering every id you were given, and nothing else.',
  ].join("\n");
}

async function translateBatch(
  apiKey: string,
  target: Lang,
  batch: { id: string; text: string }[],
): Promise<Record<string, string>> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 1.1,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt(target) },
        { role: "user", content: JSON.stringify({ items: batch }) },
      ],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`DeepSeek ${res.status}: ${body.slice(0, 300)}`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content !== "string") throw new Error("DeepSeek returned no content");

  let parsed: { items?: { id?: string; text?: string }[] };
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("DeepSeek returned malformed JSON");
  }

  const out: Record<string, string> = {};
  for (const item of parsed.items ?? []) {
    if (typeof item?.id === "string" && typeof item?.text === "string") out[item.id] = item.text;
  }
  return out;
}

export async function POST(request: Request) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "DEEPSEEK_API_KEY is not set, so automatic translation is off." },
      { status: 503 },
    );
  }

  let entries: Entry[];
  try {
    const body = await request.json();
    entries = Array.isArray(body?.entries) ? body.entries : [];
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const valid: Lang[] = LANGS.map((l) => l.code).filter((l) => l !== "en");
  const clean = entries
    .filter((e) => typeof e?.path === "string" && typeof e?.text === "string" && e.text.trim())
    .map((e) => ({
      path: e.path,
      text: e.text,
      missing: (Array.isArray(e.missing) ? e.missing : []).filter((l) => valid.includes(l)),
    }))
    .filter((e) => e.missing.length);

  if (!clean.length) return NextResponse.json({ translations: {}, translated: 0 });

  // One pass per language, so each request has a single, unambiguous instruction.
  const byTarget = new Map<Lang, { id: string; text: string }[]>();
  for (const entry of clean) {
    for (const lang of entry.missing) {
      if (!byTarget.has(lang)) byTarget.set(lang, []);
      byTarget.get(lang)!.push({ id: entry.path, text: entry.text });
    }
  }

  const translations: Record<string, Partial<Record<Lang, string>>> = {};
  const failures: string[] = [];

  for (const [lang, items] of byTarget) {
    for (let i = 0; i < items.length; i += BATCH_SIZE) {
      const batch = items.slice(i, i + BATCH_SIZE);
      try {
        const result = await translateBatch(apiKey, lang, batch);
        for (const [path, text] of Object.entries(result)) {
          translations[path] = { ...translations[path], [lang]: text };
        }
      } catch (err) {
        failures.push(err instanceof Error ? err.message : String(err));
      }
    }
  }

  if (!Object.keys(translations).length && failures.length) {
    return NextResponse.json({ error: failures[0] }, { status: 502 });
  }

  return NextResponse.json({
    translations,
    translated: Object.keys(translations).length,
    ...(failures.length ? { warning: `${failures.length} batch(es) failed: ${failures[0]}` } : {}),
  });
}
