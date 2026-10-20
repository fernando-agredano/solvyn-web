import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // The panel runs with the admin's own session so RLS stays the real boundary: it must never get the service role.
    files: ["src/app/admin/**/*.{ts,tsx}", "src/lib/admin/**/*.{ts,tsx}", "src/proxy.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@/src/lib/supabase/server",
              message: "The admin panel must not use the service role client. Use createSessionClient so RLS applies.",
            },
          ],
          patterns: [
            {
              group: ["**/supabase/server"],
              message: "The admin panel must not use the service role client. Use createSessionClient so RLS applies.",
            },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
