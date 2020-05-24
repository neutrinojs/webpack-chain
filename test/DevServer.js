const DevServer = require('../src/DevServer');

test('is Chainable', () => {
  const parent = { parent: true };
  const devServer = new DevServer(parent);

  expect(devServer.end()).toBe(parent);
});

test('sets allowed hosts', () => {
  const devServer = new DevServer();
  const instance = devServer.allowedHosts.add('https://github.com').end();

  expect(instance).toBe(devServer);
  expect(devServer.toConfig()).toStrictEqual({
    allowedHosts: ['https://github.com'],
  });
});

test('shorthand methods', () => {
  const devServer = new DevServer();
  const obj = {};

  devServer.shorthands.forEach((method) => {
    obj[method] = 'alpha';
    expect(devServer[method]('alpha')).toBe(devServer);
  });

  expect(devServer.entries()).toStrictEqual(obj);
});
