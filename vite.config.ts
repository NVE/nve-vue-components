import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import dts from "vite-plugin-dts"
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js"
import * as path from "path"

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.toLowerCase().startsWith("nve-"),
        },
      },
    }),
    dts({
      outDir: "dist",             
      insertTypesEntry: true    
    }),
    cssInjectedByJsPlugin()
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"), 
      name: "NveVueComponents",
      fileName: (format) => `nve-vue-components.${format}.js`, 
      formats: ["es", "umd"]
    },
    rollupOptions: {
      external: ["vue", "nve-designsystem", "@vueuse/core"],
      output: {
        exports: "named",
        globals: {
          vue: "Vue",
          "nve-designsystem": "NveDesignsystem",
          "@vueuse/core": "@vueuse/core"
        }
      }
    },
    outDir: "dist",
    emptyOutDir: true
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  }
})
