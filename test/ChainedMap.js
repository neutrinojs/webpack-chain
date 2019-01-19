import test from 'ava';
import ChainedMap from '../src/ChainedMap';

test('is Chainable', t => {
  const parent = { parent: true };
  const map = new ChainedMap(parent);

  t.is(map.end(), parent);
});

test('creates a backing Map', t => {
  const map = new ChainedMap();

  t.true(map.store instanceof Map);
});

test('set', t => {
  const map = new ChainedMap();

  t.is(map.set('a', 'alpha'), map);
  t.is(map.store.get('a'), 'alpha');
});

test('get', t => {
  const map = new ChainedMap();

  t.is(map.set('a', 'alpha'), map);
  t.is(map.get('a'), 'alpha');
});

test('getOrCompute', t => {
  const map = new ChainedMap();

  t.is(map.get('a'), undefined);
  t.is(map.getOrCompute('a', () => 'alpha'), 'alpha');
  t.is(map.get('a'), 'alpha');
});

test('clear', t => {
  const map = new ChainedMap();

  map.set('a', 'alpha');
  map.set('b', 'beta');
  map.set('c', 'gamma');

  t.is(map.store.size, 3);
  t.is(map.clear(), map);
  t.is(map.store.size, 0);
});

test('delete', t => {
  const map = new ChainedMap();

  map.set('a', 'alpha');
  map.set('b', 'beta');
  map.set('c', 'gamma');

  t.is(map.delete('b'), map);
  t.is(map.store.size, 2);
  t.false(map.store.has('b'));
});

test('has', t => {
  const map = new ChainedMap();

  map.set('a', 'alpha');
  map.set('b', 'beta');
  map.set('c', 'gamma');

  t.true(map.has('b'));
  t.false(map.has('d'));
  t.is(map.has('b'), map.store.has('b'));
});

test('values', t => {
  const map = new ChainedMap();

  map.set('a', 'alpha');
  map.set('b', 'beta');
  map.set('c', 'gamma');

  t.deepEqual(map.values(), ['alpha', 'beta', 'gamma']);
});

test('entries with values', t => {
  const map = new ChainedMap();

  map.set('a', 'alpha');
  map.set('b', 'beta');
  map.set('c', 'gamma');

  t.deepEqual(map.entries(), { a: 'alpha', b: 'beta', c: 'gamma' });
});

test('entries with no values', t => {
  const map = new ChainedMap();

  t.is(map.entries(), undefined);
});

test('merge with no values', t => {
  const map = new ChainedMap();
  const obj = { a: 'alpha', b: 'beta', c: 'gamma' };

  t.is(map.merge(obj), map);
  t.deepEqual(map.entries(), obj);
});

test('merge with existing values', t => {
  const map = new ChainedMap();
  const obj = { a: 'alpha', b: 'beta', c: 'gamma' };

  map.set('d', 'delta');

  t.is(map.merge(obj), map);
  t.deepEqual(map.entries(), { a: 'alpha', b: 'beta', c: 'gamma', d: 'delta' });
});

test('merge with overriding values', t => {
  const map = new ChainedMap();
  const obj = { a: 'alpha', b: 'beta', c: 'gamma' };

  map.set('b', 'delta');

  t.is(map.merge(obj), map);
  t.deepEqual(map.entries(), { a: 'alpha', b: 'beta', c: 'gamma' });
});

test('merge with omitting keys', t => {
  const map = new ChainedMap();
  const obj = { a: 'alpha', b: 'beta', c: 'gamma' };

  map.merge(obj, ['b']);

  t.deepEqual(map.entries(), { a: 'alpha', c: 'gamma' });
});

test('when true', t => {
  const map = new ChainedMap();
  const right = instance => {
    t.is(instance, map);
    instance.set('alpha', 'a');
  };
  const left = instance => {
    instance.set('beta', 'b');
  };

  t.is(map.when(true, right, left), map);
  t.true(map.has('alpha'));
  t.false(map.has('beta'));
});

test('when false', t => {
  const map = new ChainedMap();
  const right = instance => {
    instance.set('alpha', 'a');
  };
  const left = instance => {
    t.is(instance, map);
    instance.set('beta', 'b');
  };

  t.is(map.when(false, right, left), map);
  t.false(map.has('alpha'));
  t.true(map.has('beta'));
});

test('clean undefined', t => {
  const map = new ChainedMap();
  map.set('alpha', undefined);
  map.set('beta', 'b');
  t.true('alpha' in map.entries());
  t.false('alpha' in map.clean(map.entries()));
  t.true('beta' in map.clean(map.entries()));
});

test('clean empty array', t => {
  const map = new ChainedMap();
  map.set('alpha', []);
  t.true('alpha' in map.entries());
  t.false('alpha' in map.clean(map.entries()));
});

test('clean empty object', t => {
  const map = new ChainedMap();
  map.set('alpha', {});
  t.true('alpha' in map.entries());
  t.false('alpha' in map.clean(map.entries()));
});

test('create method with nested chainedMap', t => {
  const map = new ChainedMap();
  const testRecord = {};
  map.createMethodWithMap('testMethod', 'testMethodMap', name => {
    testRecord[name] = { id: Math.random() };
    return testRecord[name];
  });
  t.is(typeof map.testMethod, 'function');
  t.truthy(map.testMethodMap instanceof ChainedMap);

  const computedValue = map.testMethod('testKey');
  t.is(typeof computedValue.id, 'number');
  t.is(computedValue, testRecord.testKey);
  t.is(map.testMethodMap.get('testKey'), testRecord.testKey);

  const reGetComputedValue = map.testMethod('testKey');
  t.is(reGetComputedValue, computedValue);

  const anotherComputedValue = map.testMethod('testKey2');
  t.is(typeof anotherComputedValue.id, 'number');
  t.is(anotherComputedValue, testRecord.testKey2);
  t.is(map.testMethodMap.get('testKey2'), testRecord.testKey2);
  t.is(map.testMethodMap.get('testKey'), testRecord.testKey);

  map.testMethodMap.clear();
  t.is(map.testMethodMap.get('testKey2'), undefined);
  t.is(map.testMethodMap.get('testKey'), undefined);
});

test('create compatible method with nested chainedMap', t => {
  const map = new ChainedMap();
  const testRecord = {};
  class TestPlugin extends ChainedMap {
    constructor(parent, name) {
      super(parent);
      this.name = name;
    }

    use(args) {
      testRecord[this.name] = args;
      return this;
    }

    toConfig() {
      return testRecord[this.name];
    }
  }

  map.createMethodWithMap(
    'testMethod',
    'testMethodMap',
    name => new TestPlugin(map, name)
  );
  map.compatible('testMethod');
  const data1 = { id: Math.random() };
  const data2 = { id: Math.random() };

  // compatible with shorthand style
  map.testMethod([data1, data2]);
  t.deepEqual(map.get('testMethod'), [data1, data2]);

  // mix-styles supported
  const data3 = { id: Math.random() };
  const childMap = map.testMethod('data3');
  t.truthy(childMap instanceof TestPlugin);
  childMap.use(data3);
  t.deepEqual(map.get('testMethod'), [data1, data2, data3]);

  // should be ok with chain
  map
    .testMethod('data4')
    .use('data4')
    .end()
    .testMethod('data5')
    .use('data5');
  t.deepEqual(map.get('testMethod'), [data1, data2, data3, 'data4', 'data5']);
  map.testMethodMap.delete('data4');
  t.deepEqual(map.get('testMethod'), [data1, data2, data3, 'data5']);

  // could be override
  map.testMethod(['data6']);
  t.deepEqual(map.get('testMethod'), ['data6']);

  map.testMethodMap.clear();
  t.deepEqual(map.get('testMethod'), []);

  map.testMethod(['data7']);
  map.testMethod([]);
  t.deepEqual(map.get('testMethod'), []);
});
