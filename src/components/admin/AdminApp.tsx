"use client";

import { useCallback, useEffect, useState } from "react";
import type { SiteContent } from "@/lib/types";
import Editor from "./Editor";
import Login from "./Login";
import { UploadProvider } from "./uploads";

type Status = "checking" | "locked" | "ready" | "error";

export default function AdminApp({ fallback }: { fallback: SiteContent }) {
  const [status, setStatus] = useState<Status>("checking");
  const [draft, setDraft] = useState<SiteContent>(fallback);
  const [source, setSource] = useState<string>("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setStatus("checking");
    try {
      const res = await fetch("/api/admin/content", { cache: "no-store" });
      if (res.status === 401) {
        setStatus("locked");
        return;
      }
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setDraft(data.content as SiteContent);
      setSource(data.source as string);
      setStatus("ready");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load the content.");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (status === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream text-sm uppercase tracking-[0.2em] text-espresso-soft">
        Loading…
      </div>
    );
  }

  if (status === "locked") return <Login onSuccess={load} />;

  if (status === "error") {
    return (
      <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-4 bg-cream px-6 text-center">
        <p className="text-sm text-[#a4553f]">{error}</p>
        <button
          type="button"
          onClick={load}
          className="rounded-full bg-espresso px-6 py-2.5 text-xs uppercase tracking-[0.16em] text-cream"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <UploadProvider>
      <Editor draft={draft} setDraft={setDraft} source={source} onReload={load} />
    </UploadProvider>
  );
}
