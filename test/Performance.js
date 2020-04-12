import test from 'ava';
import Performance from '../src/Performance';

test('is Chainable', (t) => {
  const parent = { parent: true };
  const performance = new Performance(parent);

  t.is(performance.end(), parent);
});

test('shorthand methods', (t) => {
  const performance = new Performance();
  const obj = {};

  performance.shorthands.forEach((method) => {
    obj[method] = 'alpha';
    t.is(performance[method]('alpha'), performance);
  });

  t.deepEqual(performance.entries(), obj);
});
