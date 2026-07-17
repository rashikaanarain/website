import { resolve, sep } from "node:path";
import { createApiHandler } from "./api.js";
import { createDatabase } from "./database.js";

const database = createDatabase();
const handleApi = createApiHandler(database);
const port = Number(process.env.PORT || 8787);
const distDirectory = resolve("dist");

function withResponseHeaders(response, pathname) {
  const headers = new Headers(response.headers);
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "DENY");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  if (pathname.startsWith("/api/")) headers.set("Cache-Control", "no-store");
  else if (pathname.startsWith("/assets/")) headers.set("Cache-Control", "public, max-age=31536000, immutable");
  else headers.set("Cache-Control", "no-cache");

  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

async function serveStatic(pathname) {
  const requestedPath = resolve(distDirectory, `.${decodeURIComponent(pathname)}`);
  if (requestedPath !== distDirectory && !requestedPath.startsWith(`${distDirectory}${sep}`)) {
    return new Response("Not found", { status: 404 });
  }

  const file = Bun.file(requestedPath);
  if (await file.exists()) return new Response(file);

  const directoryIndex = Bun.file(resolve(requestedPath, "index.html"));
  if (await directoryIndex.exists()) return new Response(directoryIndex, { headers: { "Content-Type": "text/html; charset=utf-8" } });

  const fallback = Bun.file(resolve(distDirectory, "index.html"));
  if (await fallback.exists()) return new Response(fallback, { headers: { "Content-Type": "text/html; charset=utf-8" } });

  return new Response("Run `bun run build` before starting the production server.", { status: 503 });
}

const server = Bun.serve({
  port,
  async fetch(request) {
    const url = new URL(request.url);
    try {
      if (url.pathname.startsWith("/api/")) return withResponseHeaders(await handleApi(request), url.pathname);
      if (request.method !== "GET" && request.method !== "HEAD") {
        return withResponseHeaders(new Response("Method not allowed", { status: 405 }), url.pathname);
      }
      return withResponseHeaders(await serveStatic(url.pathname === "/" ? "/index.html" : url.pathname), url.pathname);
    } catch (error) {
      console.error("Request failed", error);
      const response = url.pathname.startsWith("/api/")
        ? Response.json({ error: "The request could not be completed." }, { status: 500 })
        : new Response("The request could not be completed.", { status: 500 });
      return withResponseHeaders(response, url.pathname);
    }
  },
});

console.log(`OpenNyAI server running at ${server.url}`);

function shutdown() {
  database.close();
  server.stop();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
