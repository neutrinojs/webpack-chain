const Chainable = require('../src/Chainable');

test('calling .end() returns parent', () => {
  const parent = { parent: true };
  const chain = new Chainable(parent);

  expect(chain.end()).toBe(parent);
});

test('using .batch() receives context', () => {
  const chain = new Chainable();
  const context = chain.batch((current) => {
    expect(current).toBe(chain);
  });

  expect(context).toBe(chain);
});
