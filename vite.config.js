import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import hostingConfig from "./.openai/hosting.json";
import { sites } from "./build/sites-vite-plugin.js";

const LOCAL_D1_DATABASE_ID = "00000000-0000-4000-8000-000000000000";

const workerConfig = {
  name: "server",
  main: "./worker/index.js",
  compatibility_date: "2026-05-22",
  d1_databases: hostingConfig.d1
    ? [{
        binding: hostingConfig.d1,
        database_name: "opennyai-sites-local",
        database_id: LOCAL_D1_DATABASE_ID,
      }]
    : [],
  assets: {
    binding: "ASSETS",
    not_found_handling: "single-page-application",
    run_worker_first: true,
  },
};

function preserveDocumentLinks() {
  return {
    name: "preserve-document-links",
    transformIndexHtml: {
      order: "pre",
      handler(html) {
        return html.replace(
          /<link(\s+)(?=[^>]*\brel=(["'])(?:canonical|alternate)\2)/gi,
          "<link vite-ignore$1",
        );
      },
    },
  };
}

export default defineConfig(async () => {
  const sitesBuild = process.env.SITES_BUILD === "1";
  const plugins = [preserveDocumentLinks(), react()];
  const pageInputs = {
    main: resolve(import.meta.dirname, "index.html"),
    "hi-home": resolve(import.meta.dirname, "hi/index.html"),
    about: resolve(import.meta.dirname, "about/index.html"),
    misaal: resolve(import.meta.dirname, "misaal/index.html"),
    "hi-about": resolve(import.meta.dirname, "hi/about/index.html"),
    "hi-misaal": resolve(import.meta.dirname, "hi/misaal/index.html"),
  };

  if (sitesBuild) {
    const { cloudflare } = await import("@cloudflare/vite-plugin");
    plugins.push(sites(), cloudflare({ config: workerConfig }));
  }

  return {
    plugins,
    ...(sitesBuild
      ? {
          environments: {
            client: {
              build: { rollupOptions: { input: pageInputs } },
            },
          },
        }
      : {
          build: {
            rollupOptions: { input: pageInputs },
          },
        }
    ),
    server: {
      proxy: sitesBuild ? undefined : {
        "/api": "http://127.0.0.1:8787",
      },
    },
  };
});
