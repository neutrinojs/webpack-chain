const ChainedSet = require('../src/ChainedSet');

test('is Chainable', () => {
  const parent = { parent: true };
  const set = new ChainedSet(parent);

  expect(set.end()).toBe(parent);
});

test('creates a backing Set', () => {
  const set = new ChainedSet();

  expect(set.store instanceof Set).toBe(true);
});

test('add', () => {
  const set = new ChainedSet();

  expect(set.add('alpha')).toBe(set);
  expect(set.store.has('alpha')).toBe(true);
  expect(set.store.size).toBe(1);
});

test('prepend', () => {
  const set = new ChainedSet();

  set.add('alpha');

  expect(set.prepend('beta')).toBe(set);
  expect(set.store.has('beta')).toBe(true);
  expect([...set.store]).toStrictEqual(['beta', 'alpha']);
});

test('clear', () => {
  const set = new ChainedSet();

  set.add('alpha');
  set.add('beta');
  set.add('gamma');

  expect(set.store.size).toBe(3);
  expect(set.clear()).toBe(set);
  expect(set.store.size).toBe(0);
});

test('delete', () => {
  const set = new ChainedSet();

  set.add('alpha');
  set.add('beta');
  set.add('gamma');

  expect(set.delete('beta')).toBe(set);
  expect(set.store.size).toBe(2);
  expect(set.store.has('beta')).toBe(false);
});

test('has', () => {
  const set = new ChainedSet();

  set.add('alpha');
  set.add('beta');
  set.add('gamma');

  expect(set.has('beta')).toBe(true);
  expect(set.has('delta')).toBe(false);
  expect(set.has('beta')).toBe(set.store.has('beta'));
});

test('values', () => {
  const set = new ChainedSet();

  set.add('alpha');
  set.add('beta');
  set.add('gamma');

  expect(set.values()).toStrictEqual(['alpha', 'beta', 'gamma']);
});

test('merge with no values', () => {
  const set = new ChainedSet();
  const arr = ['alpha', 'beta', 'gamma'];

  expect(set.merge(arr)).toBe(set);
  expect(set.values()).toStrictEqual(arr);
});

test('merge with existing values', () => {
  const set = new ChainedSet();
  const arr = ['alpha', 'beta', 'gamma'];

  set.add('delta');

  expect(set.merge(arr)).toBe(set);
  expect(set.values()).toStrictEqual(['delta', 'alpha', 'beta', 'gamma']);
});

test('when true', () => {
  const set = new ChainedSet();
  const right = (instance) => {
    expect(instance).toBe(set);
    instance.add('alpha');
  };
  const left = (instance) => {
    instance.add('beta');
  };

  expect(set.when(true, right, left)).toBe(set);
  expect(set.has('alpha')).toBe(true);
  expect(set.has('beta')).toBe(false);
});

test('when false', () => {
  const set = new ChainedSet();
  const right = (instance) => {
    instance.add('alpha');
  };
  const left = (instance) => {
    expect(instance).toBe(set);
    instance.add('beta');
  };

  expect(set.when(false, right, left)).toBe(set);
  expect(set.has('alpha')).toBe(false);
  expect(set.has('beta')).toBe(true);
});
