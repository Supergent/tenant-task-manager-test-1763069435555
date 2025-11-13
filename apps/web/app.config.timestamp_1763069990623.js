// app.config.ts
import { defineConfig } from "@tanstack/start/config";
import tsConfigPaths from "vite-tsconfig-paths";
var app_config_default = defineConfig({
  vite: {
    plugins: [
      tsConfigPaths({
        projects: ["./tsconfig.json"]
      })
    ]
  },
  server: {
    // Cloudflare Workers preset
    preset: "cloudflare-module",
    // Polyfills for Node.js APIs
    unenv: {
      polyfills: {
        Buffer: true,
        process: true
      }
    },
    // Rollup configuration
    rollupConfig: {
      external: ["node:async_hooks"]
    }
  }
});
export {
  app_config_default as default
};
