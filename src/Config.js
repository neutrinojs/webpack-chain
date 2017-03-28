const path = require('path');
const ChainedMap = require('./ChainedMap');
const ChainedSet = require('./ChainedSet');
const Resolve = require('./Resolve');
const ResolveLoader = require('./ResolveLoader');
const Output = require('./Output');
const DevServer = require('./DevServer');
const Plugin = require('./Plugin');
const Module = require('./Module');
const Performance = require('./Performance');

module.exports = class extends ChainedMap {
  constructor() {
    super();
    this.devServer = new DevServer(this);
    this.entryPoints = new ChainedMap(this);
    this.module = new Module(this);
    this.node = new ChainedMap(this);
    this.output = new Output(this);
    this.performance = new Performance(this);
    this.plugins = new ChainedMap(this);
    this.resolve = new Resolve(this);
    this.resolveLoader = new ResolveLoader(this);
    this.extend([
      'amd',
      'bail',
      'cache',
      'devtool',
      'context',
      'externals',
      'loader',
      'profile',
      'recordsPath',
      'recordsInputPath',
      'recordsOutputPath',
      'stats',
      'target',
      'watch',
      'watchOptions'
    ]);
  }

  entry(name) {
    if (!this.entryPoints.has(name)) {
      this.entryPoints.set(name, new ChainedSet(this));
    }

    return this.entryPoints.get(name);
  }

  plugin(name) {
    if (!this.plugins.has(name)) {
      this.plugins.set(name, new Plugin(this));
    }

    return this.plugins.get(name);
  }

  toConfig() {
    const entryPoints = this.entryPoints.entries() || {};

    return this.clean(Object.assign(this.entries() || {}, {
      node: this.node.entries(),
      output: this.output.entries(),
      resolve: this.resolve.toConfig(),
      resolveLoader: this.resolveLoader.toConfig(),
      devServer: this.devServer.entries(),
      module: this.module.toConfig(),
      plugins: this.plugins.values().map(plugin => plugin.toConfig()),
      entry: Object
        .keys(entryPoints)
        .reduce((acc, key) => Object.assign(acc, { [key]: entryPoints[key].values() }), {})
    }));
  }

  merge(obj = {}) {
    Object
      .keys(obj)
      .forEach(key => {
        const value = obj[key];

        switch (key) {
          case 'node':
          case 'resolve':
          case 'resolveLoader':
          case 'devServer':
          case 'module': {
            return this[key].merge(value);
          }

          /**
           * @example:
           *
           * input:
           * '/code/example/dist/[name].js'
           *
           * output:
           * {
           *   path: '/code/example/dist',
           *   filename: '[name].js',
           * }
           *
           *
           */
          case 'output': {
            if (typeof value === 'string') {
              const filename = path.basename(value);
              const dir = path.dirname(value);
              const asObject = {
                path: dir,
                filename,
              };

              return this.output.merge(asObject);
            }
          }

          /**
           * take a string entry,
           * file name becomes property,
           * value becomes an array,
           * if the same prop exists,
           * it is merged in with existing values
           *
           * @example:
           *
           * input: './src/front/index.js'
           * output: {index: ['./src/front/index.js']}
           */
          case 'entry': {
            if (typeof value === 'string') {
              let name = path.basename(value);
              if (name.includes('.')) {
                name = name.split('.').shift();
              }

              return this.entry(name).merge([value]);
            }

            return Object
              .keys(value)
              .forEach(name => this.entry(name).merge(value[name]));
          }

          case 'plugin': {
            return Object
              .keys(value)
              .forEach(name => this.plugin(name).merge(value[name]));
          }

          /**
           * @see ./Plugin
           * merge an array of plugins
           */
          case 'plugins': {
            if (Array.isArray(value)) {
              return value
                .forEach((plugin, index) => {
                  plugin.name = plugin.name || index

                  // if Class, default Plugin.init will instantiate it
                  if (toString.call(plugin) === '[object Function]') {
                    this.plugin(plugin.name).plugin(plugin);
                  }

                  // otherwise, it is already instantiated
                  else {
                    this.plugin(plugin.name).init((args) => plugin);
                  }
                });
            }
          }

          default: {
            this.set(key, value);
          }
        }
      });

    return this;
  }
};
