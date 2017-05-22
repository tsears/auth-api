var allTestFiles = [];
var TEST_REGEXP = /^\/base\/test\/\S*(spec|test)\.js$/i;

var pathToModule = function (path) {
    return path.replace(/^\/base\//, '').replace(/\.js$/, '');
};

Object.keys(window.__karma__.files).forEach(function (file) {
    if (TEST_REGEXP.test(file)) {
        // Normalize paths to RequireJS module names.
        allTestFiles.push(pathToModule(file));
    }
});

require.config({
    // Karma serves files under /base, which is the basePath from your config file
    baseUrl: '/base/',
    enforceDefine: false,
    xhtml: false,
    waitSeconds: 30,

    // dynamically load all test files
    deps: allTestFiles,
    callback: window.__karma__.start,
});
