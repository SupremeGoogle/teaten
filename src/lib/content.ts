import raw from "../../content/site.json";
import type { SiteContent } from "./types";

/**
 * The site renders from the JSON committed in the repo. The admin panel commits a new
 * version of this file through the GitHub API, which triggers a fresh Vercel deploy.
 */
export const content = raw as unknown as SiteContent;

export const CONTENT_PATH = "content/site.json";
