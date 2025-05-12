module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
  },
  globals: {
    kakao: 'readonly'
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
  ],
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false,
    ecmaVersion: 2020
  },
  rules: {
    'vue/multi-word-component-names': 'off'
  },
}; 