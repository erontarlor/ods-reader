import {defineConfig, globalIgnores} from 'eslint/config';
import globals from 'globals';
import jsdoc from 'eslint-plugin-jsdoc';

export default defineConfig([
  globalIgnores(['coverage/', 'docs/', 'node_modules/']),
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType:  'module',
      globals:     {...globals.node}
    },
    plugins: {
      jsdoc
    },
    rules: {
      'no-unused-vars':                     ['error', {args: 'none'}],
      'no-unreachable':                     'error',
      'no-constant-condition':              ['error', {checkLoops: false}],
      'no-dupe-keys':                       'error',
      'no-dupe-else-if':                    'error',
      'no-self-compare':                    'error',
      'no-template-curly-in-string':        'error',
      'no-unexpected-multiline':            'error',
      'no-unmodified-loop-condition':       'error',
      'eqeqeq':                             ['error', 'always'],
      'curly':                              ['error', 'multi-line'],
      'no-trailing-spaces':                 'error',
      'eol-last':                           ['error', 'always'],
      'jsdoc/check-param-names':            'error',
      'jsdoc/check-property-names':         'error',
      'jsdoc/check-tag-names':              'error',
      'jsdoc/check-types':                  'error',
      'jsdoc/require-param':                'error',
      'jsdoc/require-param-description':    'off',
      'jsdoc/require-returns':              'error',
      'jsdoc/require-returns-description':  'off',
      'jsdoc/require-property':             'off',
      'jsdoc/require-property-description': 'off',
      'jsdoc/valid-types':                  'error',
      'jsdoc/check-alignment':              'error',
      'jsdoc/check-indentation':            'error',
      'jsdoc/sort-tags':                    'error'
    }
  }
]);
