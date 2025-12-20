import pluginQuery from "@tanstack/eslint-plugin-query";
import importPlugin from "eslint-plugin-import";
import a11yPlugin from "eslint-plugin-jsx-a11y";
import unusedImports from "eslint-plugin-unused-imports";
import tseslint from "typescript-eslint";

const eslintConfig = [
  ...tseslint.configs.recommended,
  ...pluginQuery.configs["flat/recommended"],
  a11yPlugin.flatConfigs.recommended,
  {
    plugins: {
      import: importPlugin,
      "unused-imports": unusedImports,
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
      },
      "import/internal-regex": "^(@/|@db/)",
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      "unused-imports/no-unused-imports": "error",

      // Import ordering
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
          pathGroups: [
            {
              pattern: "@db/**",
              group: "internal",
              position: "before",
            },
            {
              pattern: "@/**",
              group: "internal",
              position: "after",
            },
          ],
          pathGroupsExcludedImportTypes: [],
        },
      ],

      // Forbid the use of relative parent imports
      "import/no-relative-parent-imports": [
        "error",
        {
          ignore: ["^@/.*", "^@db/.*"],
        },
      ],

      // Enforce curly braces for all control flow statements
      curly: ["error", "all"],

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
    },
  },
];

export default eslintConfig;
