import { defineEslintConfig } from '@subframe7536/eslint-config'

export default defineEslintConfig({
  overrideRules: {
    'ts/no-unused-expressions': 'off',
    'antfu/top-level-function': 'off',
  },
})
