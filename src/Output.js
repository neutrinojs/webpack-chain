const ChainedMap = require('./ChainedMap');

module.exports = class extends ChainedMap {
  constructor(parent) {
    super(parent);
    this.extend([
      'auxiliaryComment',
      'chunkFilename',
      'chunkLoadTimeout',
      'chunkCallbackName',
      'crossOriginLoading',
      'devtoolFallbackModuleFilenameTemplate',
      'devtoolLineToLine',
      'devtoolModuleFilenameTemplate',
      'devtoolNamespace',
      'filename',
      'globalObject',
      'hashDigest',
      'hashDigestLength',
      'hashFunction',
      'hashSalt',
      'hotUpdateChunkFilename',
      'hotUpdateFunction',
      'hotUpdateMainFilename',
      'jsonpFunction',
      'library',
      'libraryExport',
      'libraryTarget',
      'path',
      'pathinfo',
      'publicPath',
      'sourceMapFilename',
      'sourcePrefix',
      'strictModuleExceptionHandling',
      'umdNamedDefine',
      'webassemblyModuleFilename',
    ]);
  }
};
