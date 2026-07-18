import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const PUBLIC_DOCUMENTS = [
  "about/index.html",
  "misaal/index.html",
  "hi/about/index.html",
  "hi/misaal/index.html",
];

const projectRoot = new URL("../../", import.meta.url);

describe("public page entrypoints", () => {
  test.each(PUBLIC_DOCUMENTS)("%s mounts the shared React shell", (relativePath) => {
    const html = readFileSync(new URL(relativePath, projectRoot), "utf8");

    expect(html).toContain('id="root"');
    expect(html).toContain('src="/src/main.jsx"');
    expect(html).toContain('id="route-content"');
    expect(html).toContain("data-route-style");
  });
});
