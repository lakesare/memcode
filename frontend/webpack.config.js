process.noDeprecation = true;
const path = require('path');

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');

module.exports = {
  entry: {
    index: ['babel-polyfill', './index'],
  },

  module: {
    rules: [
      {
        test: /\.json$/,
        use: ['json-loader']
      },
      {
        test: /\.js$/,
        // image-drop is not needed, but just in case if we need it
        exclude: /node_modules(?!\/quill-image-drop-module|quill-image-resize-module)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['es2015', 'react', 'stage-0'],
              plugins: ['transform-decorators-legacy']
            }
          }
        ]
      },
      {
        test: /\.(css|scss)$/,
        exclude: /(node_modules)/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader?sourceMap',
            'sass-loader?sourceMap'
          ]
        })
      },
      { // for fonts
        test: /\.(ttf|eot|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: ['file-loader']
      },
      { // for images
        test: /\.(jpg|png|svg|gif)$/,
        use: ['file-loader?name=[name].[ext]?[hash]&publicPath=/webpacked-files/']
      }
    ],
  },

  devtool: 'source-map',

  // allows to import from the deep nested folders:
  // instead of: import '../../../../../services',
  // import '~/services'
  // idea from http://stackoverflow.com/questions/27502608/resolving-require-paths-with-webpack#comment60353452_35047907
  resolve: {
    alias: { '~': path.resolve(__dirname) }
  },

  plugins: [
    new ExtractTextPlugin('/index.css'),
    new webpack.ProvidePlugin({
      React: 'react',
      PropTypes: 'prop-types',
      'window.Quill': 'quill',
      connect: ['react-redux', 'connect']
    }),
    new WebpackNotifierPlugin({ alwaysNotify: true, excludeWarnings: true })
  ],

  output: {
    filename: 'index.js',
    path: path.join(__dirname, '/webpackedFiles')
  }
};
