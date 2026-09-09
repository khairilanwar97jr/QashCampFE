import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from "path";
import { applyHtmlMetadata } from "./src/pageMetadata.js";

export default defineConfig({
  plugins: [react(), {
    name: "page-metadata",
    transformIndexHtml(html, context) {
      return applyHtmlMetadata(html, context.originalUrl?.split("?")[0] || context.path);
    },
  }],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
