/**
 * Writes back to the repository through the GitHub Git Data API, so a content save and
 * any images it references land in a single commit. Vercel picks the push up and redeploys.
 */

const API = "https://api.github.com";

export type GhFile = {
  path: string;
  /** UTF-8 text, or base64 when `encoding` is "base64". */
  content: string;
  encoding?: "utf-8" | "base64";
};

export type GhConfig = { token: string; owner: string; repo: string; branch: string };

export function githubConfig(): GhConfig | null {
  const token = process.env.GITHUB_TOKEN;
  const slug = process.env.GITHUB_REPO;
  if (!token || !slug || !slug.includes("/")) return null;
  const [owner, repo] = slug.split("/");
  return { token, owner, repo, branch: process.env.GITHUB_BRANCH || "main" };
}

async function gh<T>(cfg: GhConfig, path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub ${init?.method || "GET"} ${path} failed (${res.status}): ${body.slice(0, 400)}`);
  }
  return (await res.json()) as T;
}

/** Read a text file from the branch. Returns null when the file does not exist yet. */
export async function readFile(cfg: GhConfig, path: string): Promise<string | null> {
  const res = await fetch(
    `${API}/repos/${cfg.owner}/${cfg.repo}/contents/${encodeURI(path)}?ref=${encodeURIComponent(cfg.branch)}`,
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${cfg.token}`,
        Accept: "application/vnd.github.raw",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    },
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub read ${path} failed (${res.status})`);
  return await res.text();
}

/** Commit one or more files to the branch in a single commit. Returns the commit URL. */
export async function commitFiles(
  cfg: GhConfig,
  files: GhFile[],
  message: string,
): Promise<{ commitUrl: string; sha: string }> {
  const base = `/repos/${cfg.owner}/${cfg.repo}`;

  const ref = await gh<{ object: { sha: string } }>(cfg, `${base}/git/ref/heads/${cfg.branch}`);
  const headSha = ref.object.sha;
  const headCommit = await gh<{ tree: { sha: string } }>(cfg, `${base}/git/commits/${headSha}`);

  const tree = await Promise.all(
    files.map(async (f) => {
      const blob = await gh<{ sha: string }>(cfg, `${base}/git/blobs`, {
        method: "POST",
        body: JSON.stringify({ content: f.content, encoding: f.encoding || "utf-8" }),
      });
      return { path: f.path, mode: "100644" as const, type: "blob" as const, sha: blob.sha };
    }),
  );

  const newTree = await gh<{ sha: string }>(cfg, `${base}/git/trees`, {
    method: "POST",
    body: JSON.stringify({ base_tree: headCommit.tree.sha, tree }),
  });

  const commit = await gh<{ sha: string; html_url: string }>(cfg, `${base}/git/commits`, {
    method: "POST",
    body: JSON.stringify({ message, tree: newTree.sha, parents: [headSha] }),
  });

  await gh(cfg, `${base}/git/refs/heads/${cfg.branch}`, {
    method: "PATCH",
    body: JSON.stringify({ sha: commit.sha, force: false }),
  });

  return { commitUrl: commit.html_url, sha: commit.sha };
}
