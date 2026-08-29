import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { CONTENT_PATH, content as localContent } from "@/lib/content";
import { commitFiles, githubConfig, readFile, type GhFile } from "@/lib/github";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Total base64 payload we accept in one save, to stay inside the serverless body limit. */
const MAX_UPLOAD_BYTES = 3.5 * 1024 * 1024;
const ALLOWED_UPLOAD_DIR = "public/uploads/";

export async function GET() {
  const cfg = githubConfig();
  if (cfg) {
    try {
      const raw = await readFile(cfg, CONTENT_PATH);
      if (raw) {
        return NextResponse.json({ content: JSON.parse(raw), source: "github" });
      }
    } catch (err) {
      // Fall through to the bundled copy so the panel still opens.
      console.error("GitHub read failed:", err);
    }
  }
  return NextResponse.json({ content: localContent, source: cfg ? "bundled" : "local" });
}

export async function PUT(request: Request) {
  let body: { content?: unknown; uploads?: { path: string; base64: string }[]; message?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  if (!body.content || typeof body.content !== "object") {
    return NextResponse.json({ error: "Missing content" }, { status: 400 });
  }

  const uploads = Array.isArray(body.uploads) ? body.uploads : [];
  let total = 0;
  for (const u of uploads) {
    if (typeof u?.path !== "string" || typeof u?.base64 !== "string") {
      return NextResponse.json({ error: "Malformed upload" }, { status: 400 });
    }
    // Never let an upload escape public/uploads.
    const clean = u.path.replace(/^\/+/, "");
    if (!clean.startsWith(ALLOWED_UPLOAD_DIR) || clean.includes("..")) {
      return NextResponse.json({ error: `Rejected upload path: ${u.path}` }, { status: 400 });
    }
    u.path = clean;
    total += u.base64.length;
  }
  if (total > MAX_UPLOAD_BYTES) {
    return NextResponse.json(
      { error: "Too many new images in one save. Save in a couple of rounds." },
      { status: 413 },
    );
  }

  const json = JSON.stringify(body.content, null, 2) + "\n";
  const files: GhFile[] = [
    { path: CONTENT_PATH, content: json },
    ...uploads.map((u) => ({ path: u.path, content: u.base64, encoding: "base64" as const })),
  ];

  const cfg = githubConfig();
  if (!cfg) {
    // Local development: write straight to the working tree.
    for (const f of files) {
      const abs = path.join(process.cwd(), f.path);
      await fs.mkdir(path.dirname(abs), { recursive: true });
      if (f.encoding === "base64") await fs.writeFile(abs, Buffer.from(f.content, "base64"));
      else await fs.writeFile(abs, f.content, "utf8");
    }
    return NextResponse.json({ ok: true, mode: "local", files: files.length });
  }

  try {
    const message =
      body.message?.trim() ||
      `content: update site${uploads.length ? ` (+${uploads.length} image${uploads.length > 1 ? "s" : ""})` : ""}`;
    const { commitUrl } = await commitFiles(cfg, files, message);
    return NextResponse.json({ ok: true, mode: "github", commitUrl, files: files.length });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "GitHub commit failed" },
      { status: 502 },
    );
  }
}
