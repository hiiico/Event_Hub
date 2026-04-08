module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-coverage'),
      require('karma-jasmine-html-reporter')
    ],
    files: [
      'src/test-setup.ts',                     // ← global setup (imports zone.js)
      { pattern: 'src/**/*.spec.ts', watched: false }
    ],
    preprocessors: {
      'src/test-setup.ts': ['coverage'],
      'src/**/*.spec.ts': ['coverage']
    },
    client: {
      clearContext: false,
      jasmine: { random: false }
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    restartOnFileChange: true,
    browserNoActivityTimeout: 60000,
    captureTimeout: 120000
  });
};
