import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Enforce semicolons to prevent syntax errors
      "semi": ["error", "always"],
      // Enforce consistent line endings
      "linebreak-style": ["error", "unix"],
      // Prevent unused variables
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
      // Prevent duplicate imports
      "no-duplicate-imports": "error",
      // Enforce consistent quotes
      "quotes": ["error", "single", { "avoidEscape": true }],
      // Prevent syntax errors with missing brackets
      "curly": "error",
      // Prevent accidental global variables
      "no-undef": "error",
      // Prevent unreachable code
      "no-unreachable": "error",
      // Prevent syntax errors with missing return statements
      "consistent-return": "error",
      // Prevent syntax errors with missing parentheses
      "arrow-parens": ["error", "always"],
      // Prevent syntax errors with missing commas
      "comma-dangle": ["error", "always-multiline"],
    },
  },
];

export default eslintConfig;
