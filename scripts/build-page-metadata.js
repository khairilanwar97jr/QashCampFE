import { readFile, writeFile } from "node:fs/promises";
import { applyHtmlMetadata } from "../src/pageMetadata.js";

const html = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");
await writeFile(new URL("../dist/check-availability.html", import.meta.url), applyHtmlMetadata(html, "/check-availability"));
