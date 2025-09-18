import { defineConfig, searchForWorkspaceRoot } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      allow: [
        // allow monorepo root & common folders
        searchForWorkspaceRoot(process.cwd()),
        path.resolve(__dirname),
        path.resolve(__dirname, "../../.dfx/local"),
        path.resolve(__dirname, "../../src/declarations"),
      ],
    },
  },
  resolve: {
    alias: {
      "@declarations": path.resolve(__dirname, "../../src/declarations"),
    },
  },
});
