import prettier from "eslint-config-prettier";
import vue from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser";

import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";

export default [
  {
    ignores: [
      "dist",
      "node_modules",
      "*.d.ts",
      ".eslintrc.js",
      "vite.config.ts",
      "demo/**",
    ],
  },

  {
    files: ["**/*.vue", "**/*.ts"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsparser,
        sourceType: "module",
        ecmaVersion: "latest",
        extraFileExtensions: [".vue"],
      },
    },

    plugins: {
      vue,
      "@typescript-eslint": tseslint,
    },

    rules: {
      ...vue.configs["essential"].rules,
      ...tseslint.configs["recommended"].rules,

      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "vue/no-deprecated-slot-attribute": ["off"], // nve-design-system uses this

      quotes: ["error", "double"],
      semi: ["error", "always"],
      "no-console": "error",
      "no-debugger": "error",

      "max-lines-per-function": [
        "warn",
        { max: 50, skipBlankLines: true, skipComments: true },
      ],
    },
  },

  prettier,
];
