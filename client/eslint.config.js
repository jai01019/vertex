
import js from "@eslint/js";
import globals from "globals";

export default [
    {
        ignores: ["node_modules/**", "dist/**", "build/**"],
    },
    {
        files: ["**/*.{js,jsx}"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            parserOptions: {
                ecmaFeatures: { jsx: true },
            },
            globals: globals.browser,
        },
        rules: {
            ...js.configs.recommended.rules,
        },
    },
];
