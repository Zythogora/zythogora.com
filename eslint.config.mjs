import { FlatCompat } from "@eslint/eslintrc";
import pluginQuery from "@tanstack/eslint-plugin-query";
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
  ...pluginQuery.configs["flat/recommended"],
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
            ["builtin", "external"],
            "internal",
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

      // Restrict the use of navigation utilities not localized
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "next/link",
              message: 'Please import Links from "@/lib/i18n" instead.',
            },
            {
              name: "next/navigation",
              importNames: [
                "permanentRedirect",
                "redirect",
                "usePathname",
                "useRouter",
              ],
              message:
                'Please import navigation utilities from "@/lib/i18n" instead.',
            },
            {
              name: "next/router",
              message: 'Please use the router from "@/lib/i18n" instead.',
            },
          ],
        },
      ],

      // Include jsx-a11y rules
      ...a11yPlugin.flatConfigs.recommended.rules,
    },
  },
];

export default eslintConfig;
