import test from 'ava';
import Chainable from '../src/Chainable';

test('Calling .end() returns parent', t => {
  const parent = { parent: true };
  const chain = new Chainable(parent);

  t.is(chain.end(), parent);
});

test('Using .batch() receives context', t => {
  const chain = new Chainable();
  const context = chain.batch((current) => {
    t.is(current, chain);
  });

  t.is(context, chain);
});
