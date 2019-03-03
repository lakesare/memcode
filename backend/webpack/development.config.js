const glob = require('glob');
const sharedConfig = require('./sharedConfig');

const getTestEntries = () => {
  const testFiles = glob.sync('./**/*.test.js', { ignore: './webpacked/**' });
  const testEntries = {};
  testFiles.forEach((testFile) => {
    testEntries['test/' + testFile.slice(2, -3)] = testFile;
  });
};

const entries = {
  ...getTestEntries(),
  ...sharedConfig._partialEntry
};

module.exports = {
  externals: sharedConfig.externals,

  entry: entries,
  output: sharedConfig.output,

  target: sharedConfig.target,
  node: sharedConfig.node,

  module: sharedConfig.module,

  resolve: sharedConfig.resolve,

  devtool: 'source-map',
  mode: 'development'
};
