import test from 'ava';
import Config from '../src/Config';
import { validate } from 'webpack';

class StringifyPlugin {
  constructor(...args) {
    this.values = args;
  }

  apply() {
    return JSON.stringify(this.values);
  }
}

test('is ChainedMap', t => {
  const config = new Config();

  config.set('a', 'alpha');

  t.is(config.store.get('a'), 'alpha');
});

test('shorthand methods', t => {
  const config = new Config();
  const obj = {};

  config.shorthands.map(method => {
    obj[method] = 'alpha';
    t.is(config[method]('alpha'), config);
  });

  t.deepEqual(config.entries(), obj);
});

test('node', t => {
  const config = new Config();
  const instance = config.node
    .set('__dirname', 'mock')
    .set('__filename', 'mock')
    .end();

  t.is(instance, config);
  t.deepEqual(config.node.entries(), { __dirname: 'mock', __filename: 'mock' });
});

test('entry', t => {
  const config = new Config();

  config.entry('index')
    .add('babel-polyfill')
    .add('src/index.js');

  t.true(config.entryPoints.has('index'));
  t.deepEqual(config.entryPoints.get('index').values(), ['babel-polyfill', 'src/index.js']);
});

test('merge entry as string with existing entries, with the same prop', t => {
  const configObj = {
    entry: 'src/index.js'
  };

  const config = new Config();

  config.entry('index')
    .add('babel-polyfill')
    .add('src/index.js');

  t.true(config.entryPoints.has('index'));
  t.deepEqual(config.entryPoints.get('index').values(), ['babel-polyfill', 'src/index.js']);
});

test('merge entry as string with existing entries', t => {
  t.plan(4)
  const configObj = {
    entry: 'src/other.js'
  };

  const config = new Config();

  config.entry('index')
    .add('babel-polyfill')
    .add('src/index.js');

  config.merge(configObj);

  const backToObj = config.toConfig();

  t.true(config.entryPoints.has('index'));
  t.true(config.entryPoints.has('other'));
  t.deepEqual(config.entryPoints.get('index').values(), ['babel-polyfill', 'src/index.js']);
  t.deepEqual(config.entryPoints.get('other').values(), ['src/other.js']);
});

test('merge entry as string', t => {
  t.plan(3)
  const configObj = {
    entry: 'src/index.js'
  };
  const config = new Config();
  config.merge(configObj);
  const backToObj = config.toConfig();

  t.deepEqual(backToObj.entry.index, [configObj.entry]);
  t.true(config.entryPoints.has('index'));
  t.deepEqual(config.entryPoints.get('index').values(), [configObj.entry]);
});

test('merge output as string', t => {
  const configObj = {
    output: 'dist/bundle.js'
  };
  const config = new Config().merge(configObj);
  const backToObj = config.toConfig();

  t.deepEqual(backToObj, {
    output: {
      path: 'dist',
      filename: 'bundle.js'
    }
  })
});

test('plugin empty', t => {
  const config = new Config();
  const instance = config.plugin('stringify').use(StringifyPlugin).end();

  t.is(instance, config);
  t.true(config.plugins.has('stringify'));
  t.deepEqual(config.plugins.get('stringify').get('args'), []);
});

test('plugin with args', t => {
  const config = new Config();

  config.plugin('stringify').use(StringifyPlugin, ['alpha', 'beta']);

  t.true(config.plugins.has('stringify'));
  t.deepEqual(config.plugins.get('stringify').get('args'), ['alpha', 'beta']);
});

test('toConfig empty', t => {
  const config = new Config();

  t.deepEqual(config.toConfig(), {});
});

test('toConfig with values', t => {
  const config = new Config();

  config
    .output
      .path('build')
      .end()
    .node
      .set('__dirname', 'mock')
      .end()
    .target('node')
    .plugin('stringify')
      .use(StringifyPlugin)
      .end()
    .module
      .rule('compile')
        .include
          .add('alpha')
          .add('beta')
          .end()
        .exclude
          .add('alpha')
          .add('beta')
          .end()
        .post()
        .pre()
        .test(/\.js$/)
        .use('babel')
          .loader('babel-loader')
          .options({ presets: ['alpha'] });

  t.deepEqual(config.toConfig(), {
    node: {
      __dirname: 'mock'
    },
    output: {
      path: 'build'
    },
    target: 'node',
    plugins: [new StringifyPlugin()],
    module: {
      rules: [{
        include: ['alpha', 'beta'],
        exclude: ['alpha', 'beta'],
        enforce: 'pre',
        test: /\.js$/,
        use: [{
          loader: 'babel-loader',
          options: { presets: ['alpha'] }
        }]
      }]
    }
  });
});

test('validate empty', t => {
  const config = new Config();
  const errors = validate(config.toConfig());

  t.is(errors.length, 1);
});

test('validate with entry', t => {
  const config = new Config();

  config.entry('index').add('src/index.js');

  const errors = validate(config.toConfig());

  t.is(errors.length, 0);
});

test.todo('resolve entry & output with latest webpack');
test('validate with values', t => {
  const config = new Config();

  config
    .entry('index')
      .add('babel-polyfill')
      .add('src/index.js')
      .end()
    .output
      .path('build')
      .end()
    .node
      .set('__dirname', 'mock')
      .end()
    .target('node')
    .plugin('stringify')
      .use(StringifyPlugin)
      .end()
    .module
      .rule('compile')
        .include
          .add('alpha')
          .add('beta')
          .end()
        .exclude
          .add('alpha')
          .add('beta')
          .end()
        .post()
        .pre()
        .test(/\.js$/)
        .use('babel')
          .loader('babel-loader')
          .options({ presets: ['alpha'] });

  const obj = config.toConfig();
  const errors = validate(obj);
  t.is(errors.length, 0);
});
