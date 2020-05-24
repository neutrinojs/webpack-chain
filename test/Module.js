const Module = require('../src/Module');

test('is Chainable', () => {
  const parent = { parent: true };
  const module = new Module(parent);

  expect(module.end()).toBe(parent);
});

test('is ChainedMap', () => {
  const module = new Module();

  module.set('a', 'alpha');

  expect(module.get('a')).toBe('alpha');
});

test('rule', () => {
  const module = new Module();
  const instance = module.rule('compile').end();

  expect(instance).toBe(module);
  expect(module.rules.has('compile')).toBe(true);
});

test('defaultRule', () => {
  const module = new Module();
  const instance = module.defaultRule('banner').end();

  expect(instance).toBe(module);
  expect(module.defaultRules.has('banner')).toBe(true);
});

test('toConfig empty', () => {
  const module = new Module();

  expect(module.toConfig()).toStrictEqual({});
});

test('toConfig with values', () => {
  const module = new Module();

  module.rule('compile').test(/\.js$/);
  module.noParse(/.min.js/);

  expect(module.toConfig()).toStrictEqual({
    rules: [{ test: /\.js$/ }],
    noParse: /.min.js/,
  });
});
