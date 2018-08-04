const ChainedMap = require('./ChainedMap');
const Plugin = require('./Plugin');

module.exports = class extends ChainedMap {
  constructor(parent) {
    super(parent);
    this.minimizers = new ChainedMap(this);
    this.extend([
      'concatenateModules',
      'flagIncludedChunks',
      'mergeDuplicateChunks',
      'minimize',
      'namedChunks',
      'namedModules',
      'nodeEnv',
      'noEmitOnErrors',
      'occurrenceOrder',
      'portableRecords',
      'providedExports',
      'removeAvailableModules',
      'removeEmptyChunks',
      'runtimeChunk',
      'sideEffects',
      'splitChunks',
      'usedExports',
    ]);
  }

  minimizer(name) {
    if (!this.minimizers.has(name)) {
      this.minimizers.set(name, new Plugin(this, name));
    }

    return this.minimizers.get(name);
  }

  toConfig() {
    return this.clean(
      Object.assign(this.entries() || {}, {
        minimizer: this.minimizers.values().map(plugin => plugin.toConfig()),
      })
    );
  }

  merge(obj, omit = []) {
    const omissions = [];

    if (!omit.includes('minimizer') && 'minimizer' in obj) {
      Object.keys(obj.minimizer).forEach(name =>
        this.minimizer(name).merge(obj.minimizer[name])
      );
    }

    omissions.forEach(key => {
      if (!omit.includes(key) && key in obj) {
        this[key].merge(obj[key]);
      }
    });

    return super.merge(obj, [...omit, ...omissions, 'minimizer']);
  }
};
