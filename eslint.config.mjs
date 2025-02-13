import { FlatCompat } from "@eslint/eslintrc";
import importPlugin from "eslint-plugin-import";
import a11yPlugin from "eslint-plugin-jsx-a11y";
import unusedImports from "eslint-plugin-unused-imports";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    plugins: {
      import: importPlugin,
      "unused-imports": unusedImports,
      "jsx-a11y": a11yPlugin,
    },
    rules: {
      // Force import to be ordered correctly
      "import/order": [
        "error",
        {
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
          groups: [
            ["builtin", "external", "internal"],
            "parent",
            ["sibling", "index"],
            "type",
          ],
        },
      ],

      // Forbid the use of relative parent imports
      "import/no-relative-parent-imports": ["error", { ignore: ["@"] }],

      // Enforce newline between every TSX element
      "react/jsx-newline": ["error", { prevent: false }],

      // Enforce curly braces for all control flow statements
      curly: ["error", "all"],

      // Prevent unused imports and variables
      "@typescript-eslint/no-unused-vars": "error",
      "unused-imports/no-unused-imports": "error",

      // Include jsx-a11y rules
      ...a11yPlugin.flatConfigs.recommended.rules,
    },
  },
];

export default eslintConfig;
