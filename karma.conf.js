// karma.conf.js
module.exports = function (config) {
  config.set({
    frameworks: ['jasmine', 'karma-typescript'],
    files: ['src/**/*.ts'],
    preprocessors: {
      '**/*.ts': 'karma-typescript'
    },
    reporters: ['spec', 'karma-typescript'],
    browsers: ['ChromeHeadless'],
    karmaTypescriptConfig: {
      tsconfig: './tsconfig.json',
      reports: {
        html: 'coverage',
        lcovonly: 'coverage',
        'text-summary': ''
      }
    },
    specReporter: {
      maxLogLines: 5,
      suppressErrorSummary: false,
      suppressFailed: false,
      suppressPassed: false,
      suppressSkipped: true,
      showSpecTiming: true,
      failFast: false
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    singleRun: true
  });
};
