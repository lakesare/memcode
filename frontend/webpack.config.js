process.noDeprecation = true;
const path = require('path');

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');


const outputPath = path.join(__dirname, '/webpackedFiles');

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
      // {
      //   test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
      //   use: [{
      //     loader: 'file-loader',
      //     options: {
      //       name: '[name].[ext]',
      //       outputPath: 'fonts/',    // where the fonts will go
      //       publicPath: '../'       // override the default path
      //     }
      //   }]
      // },
      { // for images
        test: /\.(jpg|png|svg|gif)$/,
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

  devtool: 'source-map',

  // allows to import from the deep nested folders:
  // instead of: import '../../../../../services',
  // import '~/services'
  // idea from http://stackoverflow.com/questions/27502608/resolving-require-paths-with-webpack#comment60353452_35047907
  resolve: {
    alias: { '~': path.resolve(__dirname) }
  },

  stats: {
    modules: false,
    maxModules: 0,
    children: false
  },

  plugins: [
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
    new ExtractTextPlugin('/index.css'),
    new webpack.ProvidePlugin({
      React: 'react',
      PropTypes: 'prop-types',
      'window.Quill': 'quill',
      connect: ['react-redux', 'connect']
    }),
    new WebpackNotifierPlugin({
      alwaysNotify: true,
      excludeWarnings: true
    }),
    new WorkboxPlugin.InjectManifest({
      swSrc: './service-worker.js',
      // places it into /webpackedFiles/webpacked-service-worker.js,
      // useless-subdirectory is needed for node'd express.static() route.
      swDest: './webpacked-service-worker.js'
    })
  ],

  output: {
    filename: 'index.js',
    path: outputPath
  }
};
