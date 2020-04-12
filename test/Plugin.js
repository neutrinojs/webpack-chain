/* eslint-disable max-classes-per-file */
import test from 'ava';
import EnvironmentPlugin from 'webpack/lib/EnvironmentPlugin';
import Plugin from '../src/Plugin';

class StringifyPlugin {
  constructor(...args) {
    this.values = args;
  }

  apply() {
    return JSON.stringify(this.values);
  }
}

test('is Chainable', (t) => {
  const parent = { parent: true };
  const plugin = new Plugin(parent);

  t.is(plugin.end(), parent);
});

test('use', (t) => {
  const plugin = new Plugin();
  const instance = plugin.use(StringifyPlugin, ['alpha', 'beta']);

  t.is(instance, plugin);
  t.is(plugin.get('plugin'), StringifyPlugin);
  t.deepEqual(plugin.get('args'), ['alpha', 'beta']);
});

test('tap', (t) => {
  const plugin = new Plugin();

  plugin.use(StringifyPlugin, ['alpha', 'beta']);

  const instance = plugin.tap(() => ['gamma', 'delta']);

  t.is(instance, plugin);
  t.deepEqual(plugin.get('args'), ['gamma', 'delta']);
});

test('init', (t) => {
  const plugin = new Plugin();

  plugin.use(StringifyPlugin);

  const instance = plugin.init((Plugin, args) => {
    t.deepEqual(args, []);
    return new Plugin('gamma', 'delta');
  });
  const initialized = plugin.get('init')(
    plugin.get('plugin'),
    plugin.get('args'),
  );

  t.is(instance, plugin);
  t.true(initialized instanceof StringifyPlugin);
  t.deepEqual(initialized.values, ['gamma', 'delta']);
});

test('args is validated as being an array', (t) => {
  const plugin = new Plugin();

  t.throws(
    () => plugin.use(StringifyPlugin, { foo: true }),
    'args must be an array of arguments',
  );

  plugin.use(StringifyPlugin);

  t.throws(
    () => plugin.tap(() => ({ foo: true })),
    'args must be an array of arguments',
  );
  t.throws(
    () => plugin.merge({ args: 5000 }),
    'args must be an array of arguments',
  );
  t.throws(
    () => plugin.set('args', null),
    'args must be an array of arguments',
  );
});

test('toConfig', (t) => {
  const plugin = new Plugin(null, 'gamma');

  plugin.use(StringifyPlugin, ['delta']);

  const initialized = plugin.toConfig();

  t.true(initialized instanceof StringifyPlugin);
  t.deepEqual(initialized.values, ['delta']);
  t.is(initialized.__pluginName, 'gamma');
  t.is(initialized.__pluginType, 'plugin');
  t.deepEqual(initialized.__pluginArgs, ['delta']);
  t.is(initialized.__pluginConstructorName, 'StringifyPlugin');
});

test('toConfig with custom type', (t) => {
  const plugin = new Plugin(null, 'gamma', 'optimization.minimizer');
  plugin.use(StringifyPlugin);

  t.is(plugin.toConfig().__pluginType, 'optimization.minimizer');
});

test('toConfig with custom expression', (t) => {
  const plugin = new Plugin(null, 'gamma');

  class TestPlugin {}
  TestPlugin.__expression = `require('my-plugin')`;

  plugin.use(TestPlugin);

  const initialized = plugin.toConfig();

  t.is(initialized.__pluginConstructorName, `(require('my-plugin'))`);
});

test('toConfig with object literal plugin', (t) => {
  const plugin = new Plugin(null, 'gamma');

  const TestPlugin = {
    apply() {},
  };

  plugin.use(TestPlugin);

  const initialized = plugin.toConfig();

  t.is(initialized, TestPlugin);
});

test('toConfig with plugin as path', (t) => {
  const plugin = new Plugin(null, 'gamma');
  const envPluginPath = require.resolve('webpack/lib/EnvironmentPlugin');

  plugin.use(envPluginPath);

  const initialized = plugin.toConfig();

  t.true(initialized instanceof EnvironmentPlugin);
  t.is(initialized.__pluginConstructorName, 'EnvironmentPlugin');
  t.is(initialized.__pluginPath, envPluginPath);
});
