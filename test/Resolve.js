import test from 'ava';
import Resolve from '../src/Resolve';

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
  const resolve = new Resolve(parent);

  t.is(resolve.end(), parent);
});

test('shorthand methods', (t) => {
  const resolve = new Resolve();
  const obj = {};

  resolve.shorthands.forEach((method) => {
    obj[method] = 'alpha';
    t.is(resolve[method]('alpha'), resolve);
  });

  t.deepEqual(resolve.entries(), obj);
});

test('sets methods', (t) => {
  const resolve = new Resolve();
  const instance = resolve.modules.add('src').end().extensions.add('.js').end();

  t.is(instance, resolve);
});

test('toConfig empty', (t) => {
  const resolve = new Resolve();

  t.deepEqual(resolve.toConfig(), {});
});

test('toConfig with values', (t) => {
  const resolve = new Resolve();

  resolve
    .plugin('stringify')
    .use(StringifyPlugin)
    .end()
    .modules.add('src')
    .end()
    .extensions.add('.js')
    .end()
    .alias.set('React', 'src/react');

  t.deepEqual(resolve.toConfig(), {
    plugins: [new StringifyPlugin()],
    modules: ['src'],
    extensions: ['.js'],
    alias: { React: 'src/react' },
  });
});

test('merge empty', (t) => {
  const resolve = new Resolve();
  const obj = {
    modules: ['src'],
    extensions: ['.js'],
    alias: { React: 'src/react' },
  };
  const instance = resolve.merge(obj);

  t.is(instance, resolve);
  t.deepEqual(resolve.toConfig(), obj);
});

test('merge with values', (t) => {
  const resolve = new Resolve();

  resolve.modules
    .add('src')
    .end()
    .extensions.add('.js')
    .end()
    .alias.set('React', 'src/react');

  resolve.merge({
    modules: ['dist'],
    extensions: ['.jsx'],
    alias: { ReactDOM: 'src/react-dom' },
  });

  t.deepEqual(resolve.toConfig(), {
    modules: ['src', 'dist'],
    extensions: ['.js', '.jsx'],
    alias: { React: 'src/react', ReactDOM: 'src/react-dom' },
  });
});

test('merge with omit', (t) => {
  const resolve = new Resolve();

  resolve.modules
    .add('src')
    .end()
    .extensions.add('.js')
    .end()
    .alias.set('React', 'src/react');

  resolve.merge(
    {
      modules: ['dist'],
      extensions: ['.jsx'],
      alias: { ReactDOM: 'src/react-dom' },
    },
    ['alias'],
  );

  t.deepEqual(resolve.toConfig(), {
    modules: ['src', 'dist'],
    extensions: ['.js', '.jsx'],
    alias: { React: 'src/react' },
  });
});

test('plugin with name', (t) => {
  const resolve = new Resolve();

  resolve.plugin('alpha');

  t.is(resolve.plugins.get('alpha').name, 'alpha');
  t.is(resolve.plugins.get('alpha').type, 'resolve.plugin');
});

test('plugin empty', (t) => {
  const resolve = new Resolve();
  const instance = resolve.plugin('stringify').use(StringifyPlugin).end();

  t.is(instance, resolve);
  t.true(resolve.plugins.has('stringify'));
  t.deepEqual(resolve.plugins.get('stringify').get('args'), []);
});

test('plugin with args', (t) => {
  const resolve = new Resolve();

  resolve.plugin('stringify').use(StringifyPlugin, ['alpha', 'beta']);

  t.true(resolve.plugins.has('stringify'));
  t.deepEqual(resolve.plugins.get('stringify').get('args'), ['alpha', 'beta']);
});
