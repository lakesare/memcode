
var HtmlWebpackPlugin = require('html-webpack-plugin');
var HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
  template:  __dirname + '/index.html',
  // filename: 'index.html',
  inject: 'body'
});




var WebpackErrorNotificationPlugin = require('webpack-error-notification');
var WebpackErrorNotificationConfig = new WebpackErrorNotificationPlugin()//(/* strategy */, /* options */)


module.exports = {
  entry: [
    './index.js'
  ],

  module: {
    // test: A condition that must be met
    // exclude: A condition that must not be met
    // include: A condition that must be met
    // loader: A string of “!” separated loaders
    // loaders: An array of loaders as string
    loaders: [
      {
        test: /\.json$/,
        loader: 'json' 
      }, // json-loader package is for marky (https://github.com/npm/marky-markdown#in-the-browser)
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel', // 'babel-loader' is also a legal name to reference
        query: {
          presets: ['es2015', 'react', 'stage-0']
        }
      },
      {
        test: /\.scss$/,
        exclude: /(node_modules)/,
        loaders: [
          'style', 
          'css?modules&localIdentName=[name]---[local]---[hash:base64:5]', 
          'sass'
        ]
      }
    ],

  },

  plugins: [
    HTMLWebpackPluginConfig, 
    WebpackErrorNotificationConfig
  ],

  output: {
    filename: "/index.js",
    path: __dirname + '/webpacked'
  }
}



// To fix this, run webpack -w and that will watch your files and re-execute webpack whenever any of the files Webpack is concerned about changes. 

// scss because used more than less & foundation because grid system's better than bootstraps