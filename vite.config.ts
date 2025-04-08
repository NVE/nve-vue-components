import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import * as path from "path";

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.toLocaleLowerCase().startsWith("nve-"),
        },
      },
    }),
    dts(),
    cssInjectedByJsPlugin(),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "NveVueComponents",
      fileName: "nve-vue-components",
    },
    rollupOptions: {
      external: ["vue", "nve-designsystem", "@vueuse/core"],
      output: {
        globals: {
          vue: "Vue",
          "nve-designsystem": "NveDesignsystem",
          "@vueuse/core": "@vueuse/core",
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
