const webpackConfig = require('./webpack.config');
module.exports = function (config) {
  config.set({
    plugins: [
      require('../node_modules/karma-webpack'),
      require('../node_modules/karma-mocha'),
      require('../node_modules/karma-chai'),
      require('../node_modules/karma-mocha-reporter'),
      require('../node_modules/karma-jsdom-launcher')
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
      module:  webpackConfig.module,
      plugins: webpackConfig.plugins,
      externals: {
        'cheerio': 'window',
        'react/addons': true, // important!!
        'react/lib/ExecutionEnvironment': true,
        'react/lib/ReactContext': true,
      },
    },
    webpackServer: {
      noInfo: true // please don't spam the console when running in karma!
    },
    reporters: ['mocha'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    singleRun: false,
    concurrency: Infinity,
    browsers: ['jsdom']
  });
};
