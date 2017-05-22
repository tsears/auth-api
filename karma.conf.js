module.exports = function(config) {
  config.set({
  basePath: '.',
  frameworks: ['jasmine', 'requirejs'],
  files: [{
      pattern: 'app/**/*.js',
      included: false,
    }, {
      pattern: 'test/**/*.js',
      included: false,
    },
    "test.main.js",
  ],

  preprocessors: {
    'app/**/*.js': ['coverage'],
  },

  reporters: ['spec', 'coverage'],

  coverageReporter: {
    // specify a common output directory
    dir: 'coverage',
    reporters: [
      { type: 'lcov', subdir: 'report-lcov' },
      { type: 'lcovonly', subdir: '.', file: 'report-lcovonly.txt' },
      { type: 'text'},
    ],
  },

  browsers: ['ChromeHeadless'],
  });
};
