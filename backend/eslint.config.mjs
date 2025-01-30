import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'

/** @type {import("eslint").Linter.Config} */
export default tseslint.config(
  {
    ignores: ['dist/**', '.wrangler/**'],
  },
  eslint.configs.recommended,
  tseslint.configs.recommended
)
