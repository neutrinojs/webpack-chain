import test from 'ava';
import Optimization from '../src/Optimization';

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
  const optimization = new Optimization(parent);

  t.is(optimization.end(), parent);
});

test('shorthand methods', (t) => {
  const optimization = new Optimization();
  const obj = {};

  optimization.shorthands.forEach((method) => {
    obj[method] = 'alpha';
    t.is(optimization[method]('alpha'), optimization);
  });

  t.deepEqual(optimization.entries(), obj);
});

test('minimizer plugin with name', (t) => {
  const optimization = new Optimization();
  optimization.minimizer('alpha');

  t.is(optimization.minimizers.get('alpha').name, 'alpha');
  t.is(optimization.minimizers.get('alpha').type, 'optimization.minimizer');
});

test('minimizer plugin empty', (t) => {
  const optimization = new Optimization();
  const instance = optimization
    .minimizer('stringify')
    .use(StringifyPlugin)
    .end();

  t.is(instance, optimization);
  t.true(optimization.minimizers.has('stringify'));
  t.deepEqual(optimization.minimizers.get('stringify').get('args'), []);
});

test('minimizer plugin with args', (t) => {
  const optimization = new Optimization();

  optimization.minimizer('stringify').use(StringifyPlugin, ['alpha', 'beta']);

  t.true(optimization.minimizers.has('stringify'));
  t.deepEqual(optimization.minimizers.get('stringify').get('args'), [
    'alpha',
    'beta',
  ]);
});

test('minimizer plugin legacy syntax', (t) => {
  const optimization = new Optimization();
  t.throws(
    () => optimization.minimizer([new StringifyPlugin()]),
    /optimization.minimizer\(\) no longer supports being passed an array/,
  );
});

test('optimization merge', (t) => {
  const optimization = new Optimization();
  const obj = {
    minimizer: {
      stringify: {
        plugin: StringifyPlugin,
        args: ['alpha', 'beta'],
      },
    },
  };

  t.is(optimization.merge(obj), optimization);
  t.true(optimization.minimizers.has('stringify'));
  t.deepEqual(optimization.minimizers.get('stringify').get('args'), [
    'alpha',
    'beta',
  ]);
});

test('toConfig empty', (t) => {
  const optimization = new Optimization();

  t.deepEqual(optimization.toConfig(), {});
});

test('toConfig with values', (t) => {
  const optimization = new Optimization();

  optimization.minimizer('foo').use(StringifyPlugin).end().splitChunks({
    chunks: 'all',
  });

  t.deepEqual(optimization.toConfig(), {
    minimizer: [new StringifyPlugin()],
    splitChunks: {
      chunks: 'all',
    },
  });
});
