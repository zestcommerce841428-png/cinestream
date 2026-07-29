// eslint-config-next ships pre-built ESLint 9 flat config arrays (not legacy .eslintrc-style
// shareable configs), so they're imported directly here rather than through FlatCompat —
// routing them through compat.extends() corrupts the merged plugin objects on this version
// and crashes ESLint with "Converting circular structure to JSON".
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    ignores: ['.next/**', 'node_modules/**', 'public/**'],
  },
  {
    rules: {
      // TMDB's API surface is huge and deeply nested (append_to_response, aggregate
      // credits, etc.) — `any` is used deliberately at those boundaries rather than
      // hand-maintaining hundreds of partial response types. Kept visible as a warning
      // rather than silenced entirely.
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
];

export default eslintConfig;
