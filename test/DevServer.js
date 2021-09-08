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

test('sets client', () => {
  const devServer = new DevServer();
  const instance = devServer.client.set('logging', 'verbose').end();

  expect(instance).toBe(devServer);
  expect(devServer.toConfig()).toStrictEqual({
    client: {
      logging: 'verbose',
    },
  });
});

test('sets static as array', () => {
  const devServer = new DevServer();
  const instance = devServer.static([
    {
      directory: 'asd',
      serveIndex: true,
      watch: true,
      publicPath: '/serve-public-path-url',
      staticOptions: {
        redirect: true,
      },
    },
  ]);

  expect(instance).toBe(devServer);
  expect(devServer.toConfig()).toStrictEqual({
    static: [
      {
        directory: 'asd',
        serveIndex: true,
        watch: true,
        publicPath: '/serve-public-path-url',
        staticOptions: {
          redirect: true,
        },
      },
    ],
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
