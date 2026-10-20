import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    // Dev-time source alias: edits in packages/* hot-reload without a rebuild.
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
        find: /^@dv\/vue$/,
        replacement: fileURLToPath(new URL("../../packages/vue/src/index.ts", import.meta.url)),
      },
    ],
  },
});
