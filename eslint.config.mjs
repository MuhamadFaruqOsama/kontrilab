import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    ".next-local/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // The custom server intentionally stays in CommonJS for Node runtime use.
    "server.js",
  ]),
]);

export default eslintConfig;
