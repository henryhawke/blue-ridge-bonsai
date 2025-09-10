import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import pluginImport from "eslint-plugin-import";

const compat = new FlatCompat({
  baseDirectory: import.meta.url,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  ...compat.extends("plugin:@wix/cli/recommended"),
  {
    plugins: {
      import: pluginImport,
    },
    rules: {
      // Allow unresolved imports for Velo modules in local editor context
      "import/no-unresolved": "off",
    },
  },
];
