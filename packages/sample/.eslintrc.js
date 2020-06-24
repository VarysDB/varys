var OFF = 0, WARN = 1, ERROR = 2;

module.exports = exports = {
    'env': {
        'node': true,
        'es6': true,
        'mocha': true
    },

    'extends': 'eslint:recommended',

    'parser': '@typescript-eslint/parser',

    'plugins': [
        '@typescript-eslint',
        'chai-expect'
    ],

    'parserOptions': {
        'ecmaVersion': 6,
        'sourceType': 'module',
        'ecmaFeatures': {
            'jsx': true
        }
    },

    'rules': {
        // Possible Errors (overrides from recommended set)
        'no-extra-parens': OFF,
        '@typescript-eslint/no-extra-parens': [ERROR, 'all', {
            'nestedBinaryExpressions': false
        }],
        'no-unexpected-multiline': ERROR,
        // All JSDoc comments must be valid
        'valid-jsdoc': [WARN, {
            'requireReturn': false,
            'requireReturnDescription': false,
            'requireParamDescription': false,
            'prefer': {
                'return': 'returns'
            }
        }],

        // Best Practices

        // Allowed a getter without setter, but all setters require getters
        'accessor-pairs': [ERROR, {
            'getWithoutSet': false,
            'setWithoutGet': true
        }],
        'block-scoped-var': WARN,
        'consistent-return': ERROR,
        'curly': ERROR,
        'default-case': WARN,
        // the dot goes with the property when doing multiline
        'dot-location': [WARN, 'property'],
        'dot-notation': OFF,
        'eqeqeq': [ERROR, 'smart'],
        'guard-for-in': WARN,
        'no-alert': ERROR,
        'no-caller': ERROR,
        'no-case-declarations': WARN,
        'no-div-regex': WARN,
        'no-else-return': WARN,
        'no-empty-pattern': WARN,
        'no-eq-null': WARN,
        'no-eval': ERROR,
        'no-extend-native': ERROR,
        'no-extra-bind': WARN,
        'no-floating-decimal': WARN,
        'no-implicit-coercion': [WARN, {
            'boolean': false,
            'number': true,
            'string': true
        }],
        'no-implied-eval': ERROR,
        'no-invalid-this': WARN,
        'no-iterator': ERROR,
        'no-labels': WARN,
        'no-lone-blocks': WARN,
        'no-loop-func': ERROR,
        'no-magic-numbers': OFF,
        '@typescript-eslint/no-magic-numbers': OFF,
        'no-multi-spaces': OFF,
        'no-multi-str': WARN,
        'no-native-reassign': ERROR,
        'no-new-func': ERROR,
        'no-new-wrappers': ERROR,
        'no-new': WARN,
        'no-octal-escape': ERROR,
        'no-param-reassign': ERROR,
        'no-process-env': WARN,
        'no-proto': ERROR,
        'no-redeclare': ERROR,
        'no-return-assign': ERROR,
        'no-script-url': ERROR,
        'no-self-compare': ERROR,
        'no-throw-literal': ERROR,
        'no-unused-expressions': ERROR,
        'no-useless-call': ERROR,
        'no-useless-concat': ERROR,
        'no-void': WARN,
        // Produce warnings when something is commented as TODO or FIXME
        'no-warning-comments': [WARN, {
            'terms': ['TODO', 'FIXME'],
            'location': 'start'
        }],
        'no-with': WARN,
        'radix': WARN,
        'vars-on-top': ERROR,
        // Enforces the style of wrapped functions
        'wrap-iife': [ERROR, 'outside'],
        'yoda': ERROR,

        // Strict Mode - for ES6, never use strict.
        'strict': [ERROR, 'never'],

        // Variables
        'init-declarations': [WARN, 'always'/*, { 'ignoreForLoopInit': true }*/],
        'no-catch-shadow': WARN,
        'no-delete-var': ERROR,
        'no-label-var': ERROR,
        'no-shadow-restricted-names': ERROR,
        'no-shadow': WARN,
        // We require all vars to be initialized (see init-declarations)
        // If we NEED a var to be initialized to undefined, it needs to be explicit
        'no-undef-init': OFF,
        'no-undef': ERROR,
        'no-undefined': OFF,
        'no-unused-vars': OFF,
        '@typescript-eslint/no-unused-vars': [ERROR, {
            args: 'none'
        }],
        '@typescript-eslint/no-explicit-any': ERROR,
        // Disallow hoisting - let & const don't allow hoisting anyhow
        'no-use-before-define': [WARN, 'nofunc'],

        // Node.js and CommonJS
        'callback-return': [WARN, ['callback', 'next']],
        'global-require': ERROR,
        'handle-callback-err': WARN,
        'no-mixed-requires': WARN,
        'no-new-require': ERROR,
        // Use path.concat instead
        'no-path-concat': ERROR,
        'no-process-exit': ERROR,
        'no-restricted-modules': OFF,
        'no-sync': WARN,

        // ECMAScript 6 support
        'arrow-body-style': [WARN, 'as-needed'],
        'arrow-parens': [WARN, 'as-needed'],
        'arrow-spacing': [WARN, { 'before': true, 'after': true }],
        'constructor-super': ERROR,
        'generator-star-spacing': [ERROR, 'before'],
        'no-confusing-arrow': ERROR,
        'no-constant-condition': ERROR,
        'no-class-assign': ERROR,
        'no-const-assign': ERROR,
        'no-dupe-class-members': OFF,
        '@typescript-eslint/no-dupe-class-members': ERROR,
        'no-this-before-super': ERROR,
        'no-var': WARN,
        'no-return-await': OFF,
        'object-shorthand': OFF,
        'prefer-arrow-callback': WARN,
        'prefer-spread': WARN,
        'prefer-template': WARN,
        'require-yield': ERROR,

        // Stylistic - everything here is a warning because of style.
        'array-bracket-spacing': [WARN, 'never'],
        'block-spacing': [WARN, 'always'],
        'brace-style': [WARN, '1tbs', { 'allowSingleLine': false }],
        'camelcase': WARN,
        'comma-spacing': [WARN, { 'before': false, 'after': true }],
        'comma-style': [WARN, 'last'],
        'computed-property-spacing': [WARN, 'never'],
        'consistent-this': [WARN, 'self'],
        'eol-last': WARN,
        'func-names': [WARN, 'as-needed'],
        'func-style': [WARN, 'declaration'],
        'id-length': [WARN, { 'min': 2, 'max': 48 }],
        'indent': [WARN, 4, { 'SwitchCase': 1 }],
        'jsx-quotes': [WARN, 'prefer-double'],
        'keyword-spacing': [WARN],
        'linebreak-style': [WARN, 'unix'],
        'lines-around-comment': [WARN, { 'beforeBlockComment': true }],
        'max-depth': [WARN, 8],
        'max-len': [WARN, 200],
        'max-nested-callbacks': [WARN, 8],
        'max-params': OFF,
        // TODO: false-positives for @Decorators
        'new-cap': [OFF, { 'capIsNewExceptionPattern': '^@.+' }],
        // 'new-cap': [OFF],
        // '@typescript-eslint/new-cap': [WARN],
        'new-parens': WARN,
        'no-array-constructor': WARN,
        'no-bitwise': OFF,
        'no-continue': OFF,
        'no-inline-comments': OFF,
        'no-lonely-if': WARN,
        'no-mixed-spaces-and-tabs': WARN,
        'no-multiple-empty-lines': WARN,
        'no-negated-condition': OFF,
        'no-nested-ternary': WARN,
        'no-new-object': WARN,
        'no-plusplus': OFF,
        'no-spaced-func': WARN,
        'no-ternary': OFF,
        'no-trailing-spaces': [WARN, { 'skipBlankLines': true }],
        'no-underscore-dangle': WARN,
        'no-unneeded-ternary': WARN,
        'object-curly-spacing': [WARN, 'always'],
        'one-var': OFF,
        'operator-assignment': [WARN, 'never'],
        'operator-linebreak': [WARN, 'before'],
        'padded-blocks': [OFF, {
            'classes': 'always',
            'blocks': 'never',
            'switches': 'always'
        }],
        'quote-props': [OFF],
        'quotes': [ERROR, 'single'],
        'require-jsdoc': [OFF, {
            'require': {
                'FunctionDeclaration': true,
                'MethodDefinition': true,
                'ClassDeclaration': false
            }
        }],
        'semi-spacing': [WARN, { 'before': false, 'after': true }],
        'semi': [ERROR, 'always'],
        'sort-vars': OFF,
        'space-before-blocks': [WARN, 'always'],
        'space-before-function-paren': [WARN, {
            'anonymous': 'always',
            'named': 'never',
            'asyncArrow': 'always'
        }],
        'space-in-parens': [WARN, 'never'],
        'space-infix-ops': [WARN, { 'int32Hint': true }],
        'space-unary-ops': ERROR,
        'spaced-comment': [WARN, 'always'],
        'wrap-regex': OFF,

        'chai-expect/no-inner-compare': ERROR,
        'chai-expect/no-inner-literal': ERROR,
        'chai-expect/missing-assertion': ERROR,
        'chai-expect/terminating-properties': ERROR
    },

    'overrides': [
        {
            'files': ['*.test.ts', '*.spec.ts'],
            'rules': {
                'no-unused-expressions': OFF
            }
        }
    ]
};
