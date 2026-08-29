"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

export type PendingUpload = { path: string; base64: string };

type UploadCtx = {
  /** Reads a picked file, downscales it and queues it for the next save. Returns the public path. */
  addFile: (file: File) => Promise<string>;
  /** A data URL to show for a path that has not been deployed yet. */
  previewFor: (path: string) => string | undefined;
  pending: PendingUpload[];
  clearPending: () => void;
  pendingBytes: number;
};

const Ctx = createContext<UploadCtx | null>(null);

const MAX_EDGE = 1800;
const JPEG_QUALITY = 0.82;

function slugify(name: string): string {
  return (
    name
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) || "image"
  );
}

/** Draws the picked image onto a canvas so large phone photos don't blow the request limit. */
async function downscale(file: File): Promise<{ dataUrl: string; ext: string }> {
  const isTransparent = file.type === "image/png" || file.type === "image/webp";
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not available in this browser.");
  if (!isTransparent) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
  }
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close?.();

  const type = isTransparent ? "image/png" : "image/jpeg";
  return { dataUrl: canvas.toDataURL(type, JPEG_QUALITY), ext: isTransparent ? "png" : "jpg" };
}

export function UploadProvider({ children }: { children: React.ReactNode }) {
  const [pending, setPending] = useState<PendingUpload[]>([]);
  const [previews, setPreviews] = useState<Record<string, string>>({});

  const addFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) throw new Error("Please choose an image file.");
    const { dataUrl, ext } = await downscale(file);
    const base64 = dataUrl.slice(dataUrl.indexOf(",") + 1);
    const publicPath = `/uploads/${Date.now().toString(36)}-${slugify(file.name)}.${ext}`;
    setPending((p) => [...p, { path: `public${publicPath}`, base64 }]);
    setPreviews((p) => ({ ...p, [publicPath]: dataUrl }));
    return publicPath;
  }, []);

  const value = useMemo<UploadCtx>(
    () => ({
      addFile,
      previewFor: (path) => previews[path],
      pending,
      clearPending: () => setPending([]),
      pendingBytes: pending.reduce((n, u) => n + u.base64.length, 0),
    }),
    [addFile, pending, previews],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useUploads(): UploadCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useUploads must be used inside UploadProvider");
  return ctx;
}
