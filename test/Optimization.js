import test from 'ava';
import Optimization from '../src/Optimization';

test('is Chainable', t => {
  const parent = { parent: true };
  const optimization = new Optimization(parent);

  t.is(optimization.end(), parent);
});

test('shorthand methods', t => {
  const optimization = new Optimization();
  const obj = {};

  optimization.shorthands.forEach(method => {
    obj[method] = 'alpha';
    t.is(optimization[method]('alpha'), optimization);
  });

  t.deepEqual(optimization.entries(), obj);
});
