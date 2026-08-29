import type { I18nText, Lang } from "./types";

/**
 * The content tree is a plain object, so translatable fields are found by shape:
 * an object whose values are all strings and which carries an `en` key.
 */
function isI18nText(value: unknown): value is I18nText {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const entries = Object.entries(value as Record<string, unknown>);
  if (!entries.length) return false;
  if (!("en" in (value as object))) return false;
  return entries.every(([, v]) => typeof v === "string");
}

export type TranslatableField = {
  /** Dot/bracket path, e.g. `services.categories.0.title`. */
  path: string;
  text: string;
  /** Languages still to fill for this field. */
  missing: Lang[];
};

function get(root: unknown, path: string[]): unknown {
  return path.reduce<unknown>((node, key) => (node as Record<string, unknown>)?.[key], root);
}

/**
 * Lists the fields that need translating: the English text changed since the
 * version we loaded, or a target language is simply empty. A translation the
 * owner typed by hand is left alone while its English stays the same.
 */
export function collectMissing(
  content: unknown,
  baseline: unknown,
  targets: Lang[],
): TranslatableField[] {
  const out: TranslatableField[] = [];

  const walk = (node: unknown, path: string[]) => {
    if (isI18nText(node)) {
      const text = (node.en ?? "").trim();
      if (!text) return;

      const before = get(baseline, path);
      const englishChanged = !isI18nText(before) || (before.en ?? "").trim() !== text;

      const missing = targets.filter((lang) => englishChanged || !(node[lang] ?? "").trim());
      if (missing.length) out.push({ path: path.join("."), text, missing });
      return;
    }
    if (Array.isArray(node)) {
      node.forEach((child, i) => walk(child, [...path, String(i)]));
      return;
    }
    if (node && typeof node === "object") {
      for (const [key, child] of Object.entries(node as Record<string, unknown>)) {
        walk(child, [...path, key]);
      }
    }
  };

  walk(content, []);
  return out;
}

/** Writes translations back into a deep copy of the content. */
export function applyTranslations<T>(
  content: T,
  translations: Record<string, Partial<Record<Lang, string>>>,
): T {
  const next = structuredClone(content);

  for (const [path, byLang] of Object.entries(translations)) {
    const keys = path.split(".");
    const parent = get(next, keys.slice(0, -1)) as Record<string, unknown> | undefined;
    const leafKey = keys[keys.length - 1];
    const leaf = parent?.[leafKey];
    if (!isI18nText(leaf)) continue;

    for (const [lang, text] of Object.entries(byLang)) {
      if (typeof text === "string" && text.trim()) {
        (leaf as Record<string, string>)[lang] = text.trim();
      }
    }
  }

  return next;
}
