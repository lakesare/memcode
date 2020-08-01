process.noDeprecation = true;

const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// const CleanWebpackPlugin = require('clean-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const querystring = require('querystring');

require('../../env.js');

module.exports = {
  entry: {
    // babel-polyfill for await async to work: http://stackoverflow.com/a/33527883/3192470
    index: ['babel-polyfill', './index']
  },
  output: {
    filename: 'index.js',
    path: path.join(__dirname, '../webpackedFiles')
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
              presets: ['@babel/preset-env', '@babel/preset-react'],
              plugins: [
                ["@babel/plugin-proposal-decorators", { legacy: true }],
                ["@babel/plugin-proposal-class-properties", { loose: true }],
                "@babel/plugin-proposal-do-expressions",
                "@babel/plugin-proposal-export-default-from",
                "@babel/plugin-proposal-export-namespace-from",
                "@babel/plugin-proposal-function-bind",
                "@babel/plugin-proposal-function-sent",
                "@babel/plugin-proposal-json-strings",
                "@babel/plugin-proposal-logical-assignment-operators",
                "@babel/plugin-proposal-nullish-coalescing-operator",
                "@babel/plugin-proposal-numeric-separator",
                "@babel/plugin-proposal-optional-chaining",
                "@babel/plugin-proposal-throw-expressions"
              ]
            }
          }
        ]
      },
      {
        test: /\.(css|scss)$/,
        exclude: (modulePath) => (
          /node_modules/.test(modulePath) &&
          !/node_modules\/tippy.js/.test(modulePath)
        ),
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: 'global'
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      { // for fonts
        test: /\.(ttf|otf|eot|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]?[hash]',
              publicPath: '/'
            }
          }
        ]
      },
      { // for images
        test: /\.(jpg|png|svg|gif|mp3)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]?[hash]',
              publicPath: '/'
            }
          }
        ]
      }
    ],
  },
  _partialPlugins: [
    // new CleanWebpackPlugin([outputPath]),
    // copies subfoldered files directly into /webpackedFiles
    new CopyWebpackPlugin([
      'nonWebpackedFiles'
    ], {
      // ___Why do we need it?
      //    Because workbox-webpack-plugin's precache-minifest will not include copied over files on next rebuilds otherwise.
      // Copies files, regardless of modification when using watch or webpack-dev-server. All files are copied on first build, regardless of this option
      copyUnmodified: true
    }),
    new MiniCssExtractPlugin({
      filename: '/index.css'
    }),
    new webpack.ProvidePlugin({
      React: 'react',
      PropTypes: 'prop-types',
      'window.Quill': 'quill',
      connect: ['react-redux', 'connect']
    }),
    new WorkboxPlugin.InjectManifest({
      swSrc: './service-worker.js',
      // places it into /webpackedFiles/webpacked-service-worker.js,
      // useless-subdirectory is needed for node'd express.static() route.
      swDest: './webpacked-service-worker.js'
    }),
    // new HtmlWebpackPlugin({
    //   template: path.resolve(__dirname, '../index.html'),
    //   hash: true,
    //   templateParameters: {
    //     env: process.env,
    //     escapedGoogleOauthCallback: querystring.escape(process.env['GOOGLE_OAUTH_CALLBACK'])
    //   }
    // })
  ],

  // allows to import from the deep nested folders:
  // instead of: import '../../../../../services',
  // import '~/services'
  // idea from http://stackoverflow.com/questions/27502608/resolving-require-paths-with-webpack#comment60353452_35047907
  resolve: {
    alias: { '~': path.resolve(__dirname, '../') }
  }
};
