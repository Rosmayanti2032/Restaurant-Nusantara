const { setHeadlessWhen, setCommonPlugins } = require('@codeceptjs/configure');

setHeadlessWhen(process.env.HEADLESS);

setCommonPlugins();

/** @type {CodeceptJS.MainConfig} */
exports.config = {
  tests: 'e2e/**/*.test.js',
  output: 'e2e/output',
  helpers: {
    Playwright: {
      browser: 'chromium',
      url: 'http://localhost:9000',
      show: true,
      waitForTimeout: 5000
    }
  },
  include: {
    I: './steps_file.js'
  },
  name: 'restaurant-apps',
  plugins: {
    screenshotOnFail: {
      enabled: true,
      fullPage: true 
    }
  }
};