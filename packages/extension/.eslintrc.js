module.exports = {
  root: true,
  extends: [
    '../../.eslintrc.js',
    'plugin:node/recommended',
  ],
  rules: {
    'no-process-exit': 0,
    'node/no-unsupported-features/es-syntax': 'off',
    'node/no-missing-import': [
      'error',
      {
        allowModules: ['types', 'vscode'],
        tryExtensions: ['.ts', '.js', '.jsx', '.tsx', '.d.ts'],
      },
    ],
    'node/no-missing-require': [
      'error',
      {
        tryExtensions: ['.ts', '.js', '.d.ts'],
      },
    ],
  },
};
