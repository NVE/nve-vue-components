/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
    root: true,
    extends: [
        "plugin:vue/vue3-recommended",
        "eslint:recommended",
        "@vue/eslint-config-typescript",
        "@vue/eslint-config-prettier/skip-formatting",
    ],
    parserOptions: {
        ecmaVersion: "latest",
    },
    ignorePatterns: [],
    rules: {
        "@typescript-eslint/no-unused-vars": [
            "error",
            { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
        ],
        "vue/no-unused-vars": ["error", { ignorePattern: "^_" }],
        "vue/no-console": ["warn"],
        "no-console": ["warn"],
        "vue/block-lang": ["error", { script: { lang: ["ts", "tsx"] } }],
        "no-var": ["error"],
        "vue/no-deprecated-slot-attribute": "off",
    },
};
