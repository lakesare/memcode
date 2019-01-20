const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// const CleanWebpackPlugin = require('clean-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = [
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
  new WorkboxPlugin.InjectManifest({
    swSrc: './service-worker.js',
    // places it into /webpackedFiles/webpacked-service-worker.js,
    // useless-subdirectory is needed for node'd express.static() route.
    swDest: './webpacked-service-worker.js'
  })
];
