const Orderable = require('../src/Orderable');
const ChainedMap = require('../src/ChainedMap');

const Ordered = Orderable(class Test extends ChainedMap {});

test('before', () => {
  const ordered = new Ordered();
  const instance = ordered.set('gamma').before('beta');

  expect(instance).toBe(ordered);
  expect(ordered.__before).toBe('beta');
});

test('after', () => {
  const ordered = new Ordered();
  const instance = ordered.set('gamma').after('alpha');

  expect(instance).toBe(ordered);
  expect(ordered.__after).toBe('alpha');
});

test('before throws with after', () => {
  const ordered = new Ordered();

  expect(() => ordered.after('alpha').before('beta')).toThrow();
});

test('after throws with before', () => {
  const ordered = new Ordered();

  expect(() => ordered.before('beta').after('alpha')).toThrow();
});

test('ordering before', () => {
  const map = new ChainedMap();

  map.set('beta', new Ordered().set('beta', 'beta'));
  map.set('alpha', new Ordered().set('alpha', 'alpha').before('beta'));

  expect(map.values().map((o) => o.values())).toStrictEqual([
    ['alpha'],
    ['beta'],
  ]);
});

test('ordering after', () => {
  const map = new ChainedMap();

  map.set('beta', new Ordered().set('beta', 'beta').after('alpha'));
  map.set('alpha', new Ordered().set('alpha', 'alpha'));

  expect(map.values().map((o) => o.values())).toStrictEqual([
    ['alpha'],
    ['beta'],
  ]);
});

test('ordering before and after', () => {
  const map = new ChainedMap();

  map.set('beta', new Ordered().set('beta', 'beta'));
  map.set('gamma', new Ordered().set('gamma', 'gamma').after('beta'));
  map.set('alpha', new Ordered().set('alpha', 'alpha').before('beta'));

  expect(map.values().map((o) => o.values())).toStrictEqual([
    ['alpha'],
    ['beta'],
    ['gamma'],
  ]);
});

test('merge with before', () => {
  const ordered = new Ordered();
  const instance = ordered.set('gamma').merge({
    before: 'beta',
  });

  expect(instance).toBe(ordered);
  expect(ordered.__before).toBe('beta');
});

test('merge with after', () => {
  const ordered = new Ordered();
  const instance = ordered.set('gamma').merge({
    after: 'alpha',
  });

  expect(instance).toBe(ordered);
  expect(ordered.__after).toBe('alpha');
});

test('merging throws using before with after', () => {
  expect(() =>
    new Ordered().merge({ before: 'beta', after: 'alpha' }),
  ).toThrow();
});
