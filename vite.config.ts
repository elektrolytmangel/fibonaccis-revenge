/// <reference types="vitest/config" />

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  // Vite's dependency pre-bundling moves kith.js to node_modules/.vite/deps, where
  // `new URL("kith_bg.wasm", import.meta.url)` no longer finds the wasm file and the
  // dev server answers with index.html instead. Serve the package as it is.
  optimizeDeps: { exclude: ["@elektrolytmangel/kith-wasm"] },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}", "tests/**/*.test.{ts,tsx}"],
  },
});
