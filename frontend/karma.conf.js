const webpackConfig = require('./webpack/development.config');
webpackConfig.entry = function(){return {}};
module.exports = function (config) {
  config.set({
    plugins: [
      require('../node_modules/karma-webpack'),
      require('../node_modules/karma-mocha'),
      require('../node_modules/karma-chai'),
      require('../node_modules/karma-mocha-reporter'),
      require('../node_modules/karma-jsdom-launcher'),
      require('../node_modules/karma-sourcemap-loader'),
    ],
    basePath: '',
    frameworks: ['mocha', 'chai'],
    files: [
      './**/*.test.js'
    ],
    preprocessors: {
      './**/*.test.js': ['webpack', 'sourcemap']
    },
    webpack: {
      module:  webpackConfig.module,
      plugins: webpackConfig.plugins,
      resolve: webpackConfig.resolve,
      externals: {
        'cheerio': 'window',
        'react/addons': true, // important!!
        'react/lib/ExecutionEnvironment': true,
        'react/lib/ReactContext': true,
      },
      devtool: 'inline-source-map'
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
