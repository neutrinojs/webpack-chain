import test from 'ava';
import Rule from '../src/Rule';

test('is Chainable', (t) => {
  const parent = { parent: true };
  const rule = new Rule(parent);

  t.is(rule.end(), parent);
});

test('shorthand methods', (t) => {
  const rule = new Rule();
  const obj = {};

  rule.shorthands.forEach((method) => {
    obj[method] = 'alpha';
    t.is(rule[method]('alpha'), rule);
  });

  t.deepEqual(rule.entries(), obj);
});

test('use', (t) => {
  const rule = new Rule();
  const instance = rule.use('babel').end();

  t.is(instance, rule);
  t.true(rule.uses.has('babel'));
});

test('rule', (t) => {
  const rule = new Rule();
  const instance = rule.rule('babel').end();

  t.is(instance, rule);
  t.true(rule.rules.has('babel'));
});

test('oneOf', (t) => {
  const rule = new Rule();
  const instance = rule.oneOf('babel').end();

  t.is(instance, rule);
  t.true(rule.oneOfs.has('babel'));
});

test('pre', (t) => {
  const rule = new Rule();
  const instance = rule.pre();

  t.is(instance, rule);
  t.is(rule.get('enforce'), 'pre');
});

test('post', (t) => {
  const rule = new Rule();
  const instance = rule.post();

  t.is(instance, rule);
  t.is(rule.get('enforce'), 'post');
});

test('sets methods', (t) => {
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

test('toConfig empty', (t) => {
  const rule = new Rule();

  t.deepEqual(rule.toConfig(), {});
});

test('toConfig with name', (t) => {
  const parent = new Rule(null, 'alpha');
  const child = parent.oneOf('beta');
  const grandChild = child.oneOf('gamma');
  const ruleChild = parent.rule('delta');

  t.deepEqual(parent.toConfig().__ruleNames, ['alpha']);
  t.deepEqual(parent.toConfig().__ruleTypes, ['rule']);
  t.deepEqual(child.toConfig().__ruleNames, ['alpha', 'beta']);
  t.deepEqual(child.toConfig().__ruleTypes, ['rule', 'oneOf']);
  t.deepEqual(grandChild.toConfig().__ruleNames, ['alpha', 'beta', 'gamma']);
  t.deepEqual(grandChild.toConfig().__ruleTypes, ['rule', 'oneOf', 'oneOf']);
  t.deepEqual(ruleChild.toConfig().__ruleNames, ['alpha', 'delta']);
  t.deepEqual(ruleChild.toConfig().__ruleTypes, ['rule', 'rule']);
});

test('toConfig with values', (t) => {
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
    .rule('minifier')
    .resourceQuery(/minify/)
    .use('minifier')
    .loader('minifier-loader')
    .end()
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
    rules: [
      {
        resourceQuery: /minify/,
        use: [
          {
            loader: 'minifier-loader',
          },
        ],
      },
    ],
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

test('toConfig with test function', (t) => {
  const rule = new Rule();
  const test = (s) => s.includes('.js');

  rule.test(test);

  t.deepEqual(rule.toConfig(), { test });
});

test('merge empty', (t) => {
  const rule = new Rule();
  const obj = {
    enforce: 'pre',
    test: /\.js$/,
    include: ['alpha', 'beta'],
    exclude: ['alpha', 'beta'],
    rules: {
      minifier: {
        resourceQuery: /minify/,
        use: {
          minifier: {
            loader: 'minifier-loader',
          },
        },
      },
    },
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
    rules: [
      {
        resourceQuery: /minify/,
        use: [
          {
            loader: 'minifier-loader',
          },
        ],
      },
    ],
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

test('merge with values', (t) => {
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
    rules: {
      minifier: {
        resourceQuery: /minify/,
        use: {
          minifier: {
            loader: 'minifier-loader',
          },
        },
      },
    },
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
    rules: [
      {
        resourceQuery: /minify/,
        use: [
          {
            loader: 'minifier-loader',
          },
        ],
      },
    ],
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

test('merge with omit', (t) => {
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
      rules: {
        minifier: {
          resourceQuery: /minify/,
          use: {
            minifier: {
              loader: 'minifier-loader',
            },
          },
        },
      },
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
    ['use', 'oneOf', 'rules'],
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

test('merge with include and exclude not of array type', (t) => {
  const rule = new Rule();

  rule.merge({
    test: /\.jsx$/,
    include: 'alpha',
    exclude: 'alpha',
  });

  t.deepEqual(rule.toConfig(), {
    test: /\.jsx$/,
    include: ['alpha'],
    exclude: ['alpha'],
  });
});

test('ordered rules', (t) => {
  const rule = new Rule();
  rule
    .rule('first')
    .test(/\.first$/)
    .end()
    .rule('second')
    .test(/\.second$/)
    .end()
    .rule('third')
    .test(/\.third$/)
    .end()
    .rule('alpha')
    .test(/\.alpha$/)
    .before('first')
    .end()
    .rule('beta')
    .test(/\.beta$/)
    .after('second');

  t.deepEqual(
    rule.toConfig().rules.map((o) => o.test),
    [/\.alpha$/, /\.first$/, /\.second$/, /\.beta$/, /\.third$/],
  );
});

test('ordered oneOfs', (t) => {
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

  t.deepEqual(
    rule.toConfig().oneOf.map((o) => o.test),
    [/\.alpha$/, /\.first$/, /\.second$/, /\.beta$/, /\.third$/],
  );
});
