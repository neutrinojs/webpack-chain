const ChainedMap = require('./ChainedMap');
const ChainedSet = require('./ChainedSet');
const ChainedValueMap = require('./ChainedValueMap');

module.exports = class extends ChainedMap {
  constructor(parent) {
    super(parent);

    this.allowedHosts = new ChainedSet(this);
    this.client = new ChainedMap(this);
    this.static = new ChainedValueMap(this);

    this.extend([
      'bonjour',
      'compress',
      'devMiddleware',
      'http2',
      'https',
      'headers',
      'historyApiFallback',
      'host',
      'hot',
      'ipc',
      'liveReload',
      'magicHtml',
      'onAfterSetupMiddleware',
      'onBeforeSetupMiddleware',
      'onListening',
      'open',
      'port',
      'proxy',
      'setupExitSignals',
      'watchFiles',
      'webSocketServer',
    ]);
  }

  toConfig() {
    return this.clean({
      allowedHosts: this.allowedHosts.values(),
      ...(this.entries() || {}),
      client: this.client.entries(),
      static: this.static.entries(),
    });
  }

  merge(obj, omit = []) {
    if (!omit.includes('allowedHosts') && 'allowedHosts' in obj) {
      this.allowedHosts.merge(obj.allowedHosts);
    }

    return super.merge(obj, ['allowedHosts']);
  }
};
