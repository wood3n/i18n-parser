module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        // 尝试解析 @types packages
        alwaysTryTypes: true,
      },
    },
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2022,
    project: [
      './tsconfig.eslint.json',
      './packages/*/tsconfig.json',
    ],
  },
  plugins: ['import', '@typescript-eslint'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        // https://typescript-eslint.io/rules/indent/#how-to-use
        '@typescript-eslint/indent': ['error', 2],
        '@typescript-eslint/no-unused-vars': 0,
        'no-unused-expressions': 'off',
        '@typescript-eslint/no-shadow': 'error',
        '@typescript-eslint/no-unused-expressions': 2,
        '@typescript-eslint/consistent-type-imports': [2, { disallowTypeAnnotations: false }],
      },
    },
    {
      files: ['*.js', '*.cjs', '*.json'],
      rules: {
        indent: ['error', 2],
        'no-shadow': 1,
      },
    },
  ],
  rules: {
    'node/no-unsupported-features/es-syntax': 0,
    'global-require': 0,
    'no-process-exit': 0,
    'no-param-reassign': 0,
    'class-methods-use-this': 0,
    'eol-last': 0,
    'no-undef': 0,
    'no-unused-vars': 0,
    'max-len': 0,
    indent: 0,
    'no-shadow': 'off',
    'no-use-before-define': 0,
    'react/no-unstable-nested-components': 0,
    'react/react-in-jsx-scope': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/prefer-namespace-keyword': 0,
    '@typescript-eslint/no-namespace': ['error', { allowDeclarations: true }],
    '@typescript-eslint/no-floating-promises': 0,
    '@typescript-eslint/no-unsafe-member-access': 0,
    '@typescript-eslint/no-unsafe-call': 0,
    '@typescript-eslint/no-unsafe-return': 0,
    '@typescript-eslint/no-unsafe-assignment': 0,
    '@typescript-eslint/no-misused-promises': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-unsafe-argument': 0,
    'space-infix-ops': 1,
    'keyword-spacing': ['error', {
      before: true,
      after: true,
    }],
    'object-curly-spacing': ['error', 'always'],
    'import/no-extraneous-dependencies': 0,
    'import/prefer-default-export': 0,
    'import/extensions': 0,
    'no-console': 0,
  },
};
