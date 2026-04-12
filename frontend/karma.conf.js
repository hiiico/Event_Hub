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
      'src/test-setup.ts',                     // global setup (imports zone.js)
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
    // Use ChromeHeadless for CI, Chrome for local development
    browsers: process.env.CI ? ['ChromeHeadless'] : ['Chrome'],
    customLaunchers: {
      ChromeHeadless: {
        base: 'Chrome',
        flags: [
          '--headless',
          '--disable-gpu',
          '--no-sandbox',
          '--remote-debugging-port=9222'
        ]
      }
    },
    singleRun: !!process.env.CI,
    restartOnFileChange: !process.env.CI,
    browserNoActivityTimeout: 60000,
    captureTimeout: 120000
  });
};
