const path = require('path');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: [
    './index.js'
  ],

  module: {
    rules: [
      {
        test: /\.json$/,
        use: ['json-loader']
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['es2015', 'react', 'stage-0']
            }
          },
          {
            loader: 'eslint-loader',
            options: {
              configFile: '../.eslintrc.js'
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
            'css-loader',
            'sass-loader'
          ]
        })
      },
      { // the file-loader emits files.
        test: /\.(ttf|eot|svg|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: ['file-loader']
      }
    ],
  },

  // allows to import from the deep nested folders:
  // instead of: import '../../../../../services',
  // import '~/services'
  // idea from http://stackoverflow.com/questions/27502608/resolving-require-paths-with-webpack#comment60353452_35047907
  resolve: {
    alias: { '~': path.resolve(__dirname) }
  },

  plugins: [
    new ExtractTextPlugin('/index.css')
    // WebpackErrorNotificationConfig
  ],

  output: {
    filename: 'index.js',
    path: path.join(__dirname, '/webpacked')
  }
};
