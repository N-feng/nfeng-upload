module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/recommended',
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    '@vue/prettier'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/no-v-html': 'off',
    'vue/require-default-prop': 'off',
    'vue/require-prop-types': 'off',
    'prettier/prettier': [{
      semi: false,
      singleQuote: true,
      endOfLine: "auto"
    }],
    'space-before-function-paren': ["error", "never"],
    'import/no-unresolved': [
      2,
      {
        ignore: ['^@/', '^./', '^'] // @ 是设置的路径别名
      }
    ]
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [['@', './', './src']]
      }
    }
  }
}