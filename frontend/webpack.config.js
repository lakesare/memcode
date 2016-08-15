var HtmlWebpackPlugin = require('html-webpack-plugin');
var HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
  template:  __dirname + '/index.html',
  inject: 'body'
});

var WebpackErrorNotificationPlugin = require('webpack-error-notification');
var WebpackErrorNotificationConfig = new WebpackErrorNotificationPlugin()//(/* strategy */, /* options */)

module.exports = {




  // node: {
  //   fs: 'empty',
  //   'child_process': 'empty'
  // },



















  entry: [
    './index.js'
  ],

  module: {
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