const sharedConfig = require('./sharedConfig');

module.exports = {
  externals: sharedConfig.externals,

  entry: sharedConfig._partialEntry,
  output: sharedConfig.output,

  target: sharedConfig.target,
  node: sharedConfig.node,

  module: sharedConfig.module,

  resolve: sharedConfig.resolve,

  mode: 'production'
};
