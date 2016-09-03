var webpackConfig = require('./webpack.config');
module.exports = function (config) {
  config.set({
    plugins: [
      require('../node_modules/karma-webpack'),
      require('../node_modules/karma-mocha'),
      require('../node_modules/karma-chai'),
      require('../node_modules/karma-chrome-launcher'),
      require('../node_modules/karma-mocha-reporter'),
    ],
    basePath: '',
    frameworks: ['mocha', 'chai'],
    files: [
      './**/*.test.js'
    ],
    preprocessors: {
      './**/*.test.js': ['webpack']
    },
    webpack: {
      module: webpackConfig.module,
      resolve: webpackConfig.resolve
    },
    reporters: ['mocha'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    singleRun: false,
    concurrency: Infinity,
    browsers: ['Chrome'],
  })
}