module.exports = {
    env: {
        browser: false,
        node: true,
        commonjs: true,
        es6: true,
        jasmine: true,
    },
    extends: 'standard',
    plugins: [
        'jasmine',
    ],
    globals: {
    },
    parserOptions: {
        sourceType: 'module',
    },
    rules: {
        'comma-dangle': [ 'error', {
            arrays: 'always-multiline',
            objects: 'always-multiline',
            imports: 'always-multiline',
            exports: 'always-multiline',
            functions: 'ignore',
        }],
        indent: ['error', 2],
        'one-var': ['warn', 'never'],
    },
};
