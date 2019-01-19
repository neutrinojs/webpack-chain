import test from 'ava';
import Rule from '../src/Rule';

test('is Chainable', t => {
  const parent = { parent: true };
  const rule = new Rule(parent);

  t.is(rule.end(), parent);
});

test('shorthand methods', t => {
  const rule = new Rule();
  const obj = {};

  rule.shorthands.forEach(method => {
    obj[method] = 'alpha';
    t.is(rule[method]('alpha'), rule);
  });

  t.deepEqual(rule.entries(), obj);
});

test('use', t => {
  const rule = new Rule();
  const instance = rule.use('babel').end();

  t.is(instance, rule);
  t.true(rule.uses.has('babel'));
});

test('oneOf', t => {
  const rule = new Rule();
  const instance = rule.oneOf('babel').end();

  t.is(instance, rule);
  t.true(rule.oneOfs.has('babel'));
});

test('pre', t => {
  const rule = new Rule();
  const instance = rule.pre();

  t.is(instance, rule);
  t.deepEqual(rule.get('enforce'), 'pre');
});

test('post', t => {
  const rule = new Rule();
  const instance = rule.post();

  t.is(instance, rule);
  t.deepEqual(rule.get('enforce'), 'post');
});

test('sets methods', t => {
  const rule = new Rule();
  const instance = rule.include
    .add('alpha')
    .add('beta')
    .end()
    .exclude.add('alpha')
    .add('beta')
    .end();

  t.is(instance, rule);
  t.deepEqual(rule.include.values(), ['alpha', 'beta']);
  t.deepEqual(rule.exclude.values(), ['alpha', 'beta']);
});

test('toConfig empty', t => {
  const rule = new Rule();

  t.deepEqual(rule.toConfig(), {});
});

test('toConfig with name', t => {
  const parent = new Rule(null, 'alpha');
  const child = parent.oneOf('beta');
  const grandChild = child.oneOf('gamma');

  t.deepEqual(parent.toConfig().__ruleNames, ['alpha']);
  t.deepEqual(child.toConfig().__ruleNames, ['alpha', 'beta']);
  t.deepEqual(grandChild.toConfig().__ruleNames, ['alpha', 'beta', 'gamma']);
});

test('toConfig with values', t => {
  const rule = new Rule();

  rule.include
    .add('alpha')
    .add('beta')
    .end()
    .exclude.add('alpha')
    .add('beta')
    .end()
    .post()
    .pre()
    .test(/\.js$/)
    .use('babel')
    .loader('babel-loader')
    .options({ presets: ['alpha'] })
    .end()
    .oneOf('inline')
    .resourceQuery(/inline/)
    .use('url')
    .loader('url-loader');

  t.deepEqual(rule.toConfig(), {
    test: /\.js$/,
    enforce: 'pre',
    include: ['alpha', 'beta'],
    exclude: ['alpha', 'beta'],
    oneOf: [
      {
        resourceQuery: /inline/,
        use: [
          {
            loader: 'url-loader',
          },
        ],
      },
    ],
    use: [
      {
        loader: 'babel-loader',
        options: {
          presets: ['alpha'],
        },
      },
    ],
  });
});

test('merge empty', t => {
  const rule = new Rule();
  const obj = {
    enforce: 'pre',
    test: /\.js$/,
    include: ['alpha', 'beta'],
    exclude: ['alpha', 'beta'],
    oneOf: {
      inline: {
        resourceQuery: /inline/,
        use: {
          url: {
            loader: 'url-loader',
          },
        },
      },
    },
    use: {
      babel: {
        loader: 'babel-loader',
        options: {
          presets: ['alpha'],
        },
      },
    },
  };
  const instance = rule.merge(obj);

  t.is(instance, rule);
  t.deepEqual(rule.toConfig(), {
    enforce: 'pre',
    test: /\.js$/,
    include: ['alpha', 'beta'],
    exclude: ['alpha', 'beta'],
    oneOf: [
      {
        resourceQuery: /inline/,
        use: [
          {
            loader: 'url-loader',
          },
        ],
      },
    ],
    use: [
      {
        loader: 'babel-loader',
        options: {
          presets: ['alpha'],
        },
      },
    ],
  });
});

test('merge with values', t => {
  const rule = new Rule();

  rule
    .test(/\.js$/)
    .post()
    .include.add('gamma')
    .add('delta')
    .end()
    .use('babel')
    .loader('babel-loader')
    .options({ presets: ['alpha'] });

  rule.merge({
    test: /\.jsx$/,
    enforce: 'pre',
    include: ['alpha', 'beta'],
    exclude: ['alpha', 'beta'],
    oneOf: {
      inline: {
        resourceQuery: /inline/,
        use: {
          url: {
            loader: 'url-loader',
          },
        },
      },
    },
    use: {
      babel: {
        options: {
          presets: ['beta'],
        },
      },
    },
  });

  t.deepEqual(rule.toConfig(), {
    test: /\.jsx$/,
    enforce: 'pre',
    include: ['gamma', 'delta', 'alpha', 'beta'],
    exclude: ['alpha', 'beta'],
    oneOf: [
      {
        resourceQuery: /inline/,
        use: [
          {
            loader: 'url-loader',
          },
        ],
      },
    ],
    use: [
      {
        loader: 'babel-loader',
        options: {
          presets: ['alpha', 'beta'],
        },
      },
    ],
  });
});

test('merge with omit', t => {
  const rule = new Rule();

  rule
    .test(/\.js$/)
    .post()
    .include.add('gamma')
    .add('delta')
    .end()
    .use('babel')
    .loader('babel-loader')
    .options({ presets: ['alpha'] });

  rule.merge(
    {
      test: /\.jsx$/,
      enforce: 'pre',
      include: ['alpha', 'beta'],
      exclude: ['alpha', 'beta'],
      oneOf: {
        inline: {
          resourceQuery: /inline/,
          use: {
            url: {
              loader: 'url-loader',
            },
          },
        },
      },
      use: {
        babel: {
          options: {
            presets: ['beta'],
          },
        },
      },
    },
    ['use', 'oneOf']
  );

  t.deepEqual(rule.toConfig(), {
    test: /\.jsx$/,
    enforce: 'pre',
    include: ['gamma', 'delta', 'alpha', 'beta'],
    exclude: ['alpha', 'beta'],
    use: [
      {
        loader: 'babel-loader',
        options: {
          presets: ['alpha'],
        },
      },
    ],
  });
});

test('ordered oneOfs', t => {
  const rule = new Rule();
  rule
    .oneOf('first')
    .test(/\.first$/)
    .end()
    .oneOf('second')
    .test(/\.second$/)
    .end()
    .oneOf('third')
    .test(/\.third$/)
    .end()
    .oneOf('alpha')
    .test(/\.alpha$/)
    .before('first')
    .end()
    .oneOf('beta')
    .test(/\.beta$/)
    .after('second');

  t.deepEqual(rule.toConfig().oneOf.map(o => o.test), [
    /\.alpha$/,
    /\.first$/,
    /\.second$/,
    /\.beta$/,
    /\.third$/,
  ]);
});
