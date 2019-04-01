/**
 * Notes: The order structure of the type check follows the order
 * of this document: https://github.com/neutrinojs/webpack-chain#config
 */
import Config = require('webpack-chain');
import * as webpack from 'webpack';

const config = new Config();

config
  .amd({ foo: true })
  .bail(true)
  .cache(false)
  .cache({})
  .devtool('hidden-source-map')
  .devtool(false)
  .context('')
  .externals('foo')
  .externals(/node_modules/)
  .externals({ test: false, foo: 'bar' })
  .externals(['foo', 'bar'])
  .externals((context, request, cb) => cb(null, true))
  .loader({})
  .name("config-name")
  .mode("none")
  .mode("development")
  .mode("production")
  .profile(false)
  .parallelism(2)
  .recordsPath('')
  .recordsInputPath('')
  .recordsOutputPath('')
  .stats({
    assets: false,
    publicPath: true,
    modules: false
  })
  .target('web')
  .watch(true)
  .watchOptions({})
  .when(false, config => config.watch(true), config => config.watch(false))

  .entry('main')
    .add('index.js')
    .delete('index.js')
    .clear()
    .when(false, entry => entry.clear(), entry => entry.clear())
    .end()

  .entryPoints
    .delete('main')
    .end()

  .output
    .auxiliaryComment('Test Comment')
    .auxiliaryComment({
      root: 'Root Comment'
    })
    .chunkFilename('')
    .chunkLoadTimeout(1000)
    .crossOriginLoading(true)
    .devtoolFallbackModuleFilenameTemplate('')
    .devtoolLineToLine('')
    .devtoolModuleFilenameTemplate('')
    .filename('main.js')
    .globalObject('global')
    .hashFunction('md5')
    .hashDigest('md5')
    .hashDigestLength(15)
    .hashSalt('')
    .hotUpdateChunkFilename('update')
    .hotUpdateFunction(() => {})
    .hotUpdateMainFilename('main')
    .jsonpFunction('callback')
    .library('var')
    .libraryExport(['MyModule', 'MySubModule'])
    .libraryTarget('var')
    .path('/')
    .pathinfo(true)
    .publicPath('/')
    .sourceMapFilename('index.js.map')
    .sourcePrefix('~')
    .strictModuleExceptionHandling(true)
    .umdNamedDefine(true)
    .end()

  .resolve
    .cachePredicate(({ path, request }) => true)
    .cacheWithContext(true)
    .enforceExtension(true)
    .enforceModuleExtension(true)
    .unsafeCache(false)
    .unsafeCache(/foo/)
    .symlinks(true)
    .alias
      .set('foo', 'bar')
      .end()
    .modules
      .add('index.js')
      .end()
    .aliasFields
      .add('foo')
      .end()
    .descriptionFiles
      .add('foo')
      .end()
    .extensions
      .add('.js')
      .end()
    .mainFields
      .add('browser')
      .end()
    .mainFiles
      .add('index.js')
      .end()
    .plugin('foo')
      .use(webpack.DefinePlugin, [])
      .end()
    .plugins
      .delete('foo')
      .end()
    .end()

  .resolveLoader
    .moduleExtensions
      .add('.js')
      .end()
    .packageMains
      .add('index.js')
      .end()
    .plugin('foo')
      .use(webpack.DefinePlugin)
      .end()
    .end()

  .performance
    .hints(true)
    .hints('warning')
    .maxEntrypointSize(20000)
    .maxAssetSize(20000)
    .assetFilter(filename => true)
    .end()

  .optimization
    .concatenateModules(true)
    .flagIncludedChunks(true)
    .mergeDuplicateChunks(true)
    .minimize(true)
    .namedChunks(true)
    .namedModules(true)
    .nodeEnv(true)
    .noEmitOnErrors(true)
    .occurrenceOrder(true)
    .portableRecords(true)
    .providedExports(true)
    .removeAvailableModules(true)
    .removeEmptyChunks(true)
    .runtimeChunk("single")
    .runtimeChunk({ name: ({}) => "hello" })
    .sideEffects(true)
    .splitChunks({})
    .usedExports(true)
    .minimizer('foo')
      .use(webpack.DefinePlugin)
      .tap((config) => [])
      .end()
    .end()

  .plugin('foo')
    .use(webpack.DefinePlugin, [])
    .end()

  .plugin('bar')
    .use(webpack.DefinePlugin, [])
    .before('foo')
    .end()

  .plugin('baz')
    .use(webpack.DefinePlugin, [])
    .after('bar')
    .end()

  .plugins
    .delete('foo')
    .delete('bar')
    .delete('baz')
    .end()

  .node
    .set('__dirname', true)
    .delete('__dirname')
    .clear()
    .end()

  .devServer
    .allowedHosts
      .add('host.com')
      .clear()
      .end()
    .bonjour(true)
    .clientLogLevel('error')
    .color(true)
    .compress(false)
    .contentBase('/')
    .contentBase(['foo', 'bar'])
    .disableHostCheck(true)
    .filename('hello')
    .headers({
      'Content-Type': 'text/css',
    })
    .historyApiFallback(true)
    .host('localhost')
    .hot(true)
    .hotOnly(true)
    .https(true)
    .inline(true)
    .info(true)
    .lazy(true)
    .noInfo(true)
    .open(true)
    .overlay(true)
    .overlay({
      warnings: true,
      errors: true,
    })
    .pfx('/path/to/file.pfx')
    .pfxPassphrase('passphrase')
    .port(8080)
    .progress(true)
    .proxy({})
    .public('foo')

    .publicPath('bar')
    .quiet(false)
    .setup(app => {})
    .socket('socket')
    .staticOptions({})
    .stats({
      reasons: true,
      errors: true,
      warnings: false,
    })
    .stdin(true)
    .useLocalIp(true)
    .watchContentBase(true)
    .watchOptions({})
    .end()

  .module
    .noParse(/.min.js$/)
    .rule('compile')
      .test(/.js$/)
      .include
        .add(/.js$/)
        .end()
      .exclude
        .add(/node_modules/)
        .end()
      .parser({
        opt: 'foo',
      })
      .enforce('pre')
      .use('babel')
        .tap((config) => [])
        .loader('babel-loader')
        .options({})
        .end()
      .use('eslint')
        .loader('eslint-loader')
        .options({})
        .after('babel')
        .end()
      .uses
        .delete('babel')
        .delete('eslint')
        .end()
      .pre()
      .post()
      .oneOf('inline')
        .after('vue')
        .resourceQuery(/inline/)
        .use('url')
          .loader('url-loader')
          .end()
        .end()
      .oneOfs
        .delete('inline')
        .end()
      .end()
    .rules
      .delete('compile')
      .end()
    .end()

  //** support https://webpack.js.org/configuration/module/#ruletype  */
  .module
    .rule('mjs-compile')
      .test(/\.mjs$/)
      .type('javascript/auto')
      .end()
    .end()

  .merge({})
  .toConfig();
