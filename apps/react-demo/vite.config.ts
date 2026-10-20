import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Dev-time source alias: edits in packages/* hot-reload without a rebuild.
    // Published builds still consume dist via the packages' exports map.
    alias: [
      {
        find: "@dv/core/styles",
        replacement: fileURLToPath(new URL("../../packages/core/src/styles/index.css", import.meta.url)),
      },
      {
        find: /^@dv\/core$/,
        replacement: fileURLToPath(new URL("../../packages/core/src/index.ts", import.meta.url)),
      },
      {
        find: /^@dv\/react$/,
        replacement: fileURLToPath(new URL("../../packages/react/src/index.ts", import.meta.url)),
      },
    ],
  },
});
