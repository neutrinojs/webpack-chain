const ChainedMap = require('./ChainedMap');

module.exports = class extends ChainedMap {
  constructor(parent) {
    super(parent);
    this.extend([
      'removeAvailableModules',
      'removeEmptyChunks',
      'mergeDuplicateChunks',
      'flagIncludedChunks',
      'occurrenceOrder',
      'sideEffects',
      'providedExports',
      'usedExports',
      'concatenateModules',
      'splitChunks',
      'runtimeChunk',
      'noEmitOnErrors',
      'namedModules',
      'namedChunks',
      'portableRecords',
      'minimize',
      'minimizer',
      'nodeEnv',
    ]);
  }
};
