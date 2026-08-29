"use client";

import { useState } from "react";
import Logo from "../Logo";

export default function Login({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Wrong password");
        return;
      }
      onSuccess();
    } catch {
      setError("Network error — please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-5">
      <form onSubmit={submit} className="w-full max-w-sm">
        <div className="mb-10 flex justify-center text-espresso">
          <Logo size="lg" />
        </div>
        <label className="mb-1.5 block text-[0.7rem] uppercase tracking-[0.18em] text-espresso-soft">
          Password
        </label>
        <input
          type="password"
          autoFocus
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-espresso/15 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-gold"
        />
        {error && <p className="mt-3 text-sm text-[#a4553f]">{error}</p>}
        <button
          type="submit"
          disabled={busy || !password}
          className="mt-6 w-full rounded-full bg-espresso py-3.5 text-xs uppercase tracking-[0.2em] text-cream transition-colors hover:bg-espresso-soft disabled:opacity-50"
        >
          {busy ? "Checking…" : "Sign in"}
        </button>
        <p className="mt-6 text-center text-xs text-espresso-soft/70">
          Tea Ten Beauty &amp; Spa — content panel
        </p>
      </form>
    </div>
  );
}
