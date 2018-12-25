# webpack-chain

[![NPM version][npm-image]][npm-url]
[![NPM downloads][npm-downloads]][npm-url]
[![Build Status][travis-image]][travis-url]

应用一个链式API来生成和简化 2-4版本的webpack的配置的修改。

此文档对应于webpack-chain的v5版本，对于以前的版本，请参阅：

* [v4 docs](https://github.com/neutrinojs/webpack-chain/tree/v4)
* [v3 docs](https://github.com/neutrinojs/webpack-chain/tree/v3)
* [v2 docs](https://github.com/neutrinojs/webpack-chain/tree/v2)
* [v1 docs](https://github.com/neutrinojs/webpack-chain/tree/v1)

_注意: 虽然 webpack-chain 被广泛应用在Neutrino中，然而本软件包完全独立，可供任何项目使用。_

## 介绍

webpack 的核心配置的创建和修改基于一个有潜在难于处理的 JavaScript 对象。虽然这对于配置单个项目来说还是 OK 的，但当你尝试跨项目共享这些对象并使其进行后续的修改就会变的混乱不堪，因为您需要深入了解底层对象的结构以进行这些更改。

`webpack-chain` 尝试通过提供可链式或顺流式的 API 创建和修改webpack 配置。API的 Key 部分可以由用户指定的名称引用，这有助于 跨项目修改配置方式 的标准化。

通过以下示例可以更容易地解释这一点。

## 安装

`webpack-chain` 需要 Node.js v6.9及更高版本.  
`webpack-chain` 也只创建并被设计于使用webpack的2，3，4版本的配置对象。

你可以使用Yarn或者npm来安装此软件包（俩个包管理工具选一个就行）：

### **Yarn方式**

```bash
yarn add --dev webpack-chain
```

### **npm方式**

```bash
npm install --save-dev webpack-chain
```

## 入门

当你安装了 `webpack-chain`， 你就可以开始创建一个webpack的配置。 对于本指南，我们的示例基本配置 `webpack.config.js` 将位于我们项目的根目录。

```js
// 导入 webpack-chain 模块，该模块导出了一个用于创建一个webpack配置API的单一构造函数。
const Config = require('webpack-chain');

// 对该单一构造函数创建一个新的配置实例
const config = new Config();

// 用链式API改变配置
// 每个API的调用都会跟踪对存储配置的更改。

config
  // 修改 entry 配置
  .entry('index')
    .add('src/index.js')
    .end()
  // 修改 output 配置
  .output
    .path('dist')
    .filename('[name].bundle.js');

// 创建一个具名规则，以后用来修改规则
config.module
  .rule('lint')
    .test(/\.js$/)
    .pre()
    .include
      .add('src')
      .end()
    // 还可以创建具名use (loaders)
    .use('eslint')
      .loader('eslint-loader')
      .options({
        rules: {
          semi: 'off'
        }
      });

config.module
  .rule('compile')
    .test(/\.js$/)
    .include
      .add('src')
      .add('test')
      .end()
    .use('babel')
      .loader('babel-loader')
      .options({
        presets: [
          ['@babel/preset-env', { modules: false }]
        ]
      });

// 也可以创建一个具名的插件!
config
  .plugin('clean')
    .use(CleanPlugin, [['dist'], { root: '/dir' }]);

// 导出这个修改完成的要被webpack使用的配置对象
module.exports = config.toConfig();
```

共享配置也很简单。仅仅导出配置 和 在传递给webpack之前调用 `.toConfig()` 方法将配置导出给webpack使用。

```js
// webpack.core.js
const Config = require('webpack-chain');
const config = new Config();

// 跨目标共享配置
// Make configuration shared across targets
// ...

module.exports = config;

// webpack.dev.js
const config = require('./webpack.core');

// Dev-specific configuration
// 开发具体配置
// ...
module.exports = config.toConfig();

// webpack.prod.js
const config = require('./webpack.core');

// Production-specific configuration
// 生产具体配置
// ...
module.exports = config.toConfig();
```

## ChainedMap

webpack-chain 中的核心API接口之一是 `ChainedMap`. 一个 `ChainedMap`的操作类似于JavaScript Map, 为链式和生成配置提供了一些便利。 如果一个属性被标记一个 `ChainedMap`, 则它将具有如下的API和方法:

**除非另有说明，否则这些方法将返回 `ChainedMap` , 允许链式调用这些方法。**

```js
// 从 Map 移除所有配置.
clear()
```

```js
// 通过键值从 Map 移除单个配置.
// key: *
delete(key)
```

```js
// 获取 Map 中相应键的值
// key: *
// returns: value
get(key)
```

```js
// 获取 Map 中相应键的值
// 如果键在Map中不存在，则ChainedMap中该键的值会被配置为fn的返回值.
// key: *
// fn: Function () -> value
// returns: value
getOrCompute(key, fn)
```

```js
// 配置Map中已存在的键的值
// key: *
// value: *
set(key, value)
```

```js
// Map中是否存在一个配置值的特定键，返回 真或假
// key: *
// returns: Boolean
has(key)
```

```js
// 返回Map中已存储的所有值的数组
// returns: Array
values()
```

```js
// 返回Map中全部配置的一个对象, 其中 键是这个对象属性，值是相应键的值，
// 如果Map是空，返回 `undefined`
// 使用 `.before() 或 .after()` 的ChainedMap, 则将按照属性名进行排序。
// returns: Object, undefined if empty
entries()
````

```js
// 提供一个对象，这个对象的属性和值将映射进 Map。
// 你也可以提供一个数组作为第二个参数以便忽略合并的属性名称。
// obj: Object
// omit: Optional Array
merge(obj, omit)
```

```js
// 对当前配置上下文执行函数。
// handler: Function -> ChainedMap
  // 一个把ChainedMap实例作为单个参数的函数
batch(handler)
```

```js
// 条件执行一个函数去继续配置
// condition: Boolean
// whenTruthy: Function -> ChainedMap
  // 当条件为真，调用把ChainedMap实例作为单一参数传入的函数
// whenFalsy: Optional Function -> ChainedMap
  // 当条件为假，调用把ChainedMap实例作为单一参数传入的函数
when(condition, whenTruthy, whenFalsy)
```

## ChainedSet

webpack-chain 中的核心API接口另一个是 `ChainedSet`. 一个 `ChainedSet`的操作类似于JavaScript Map, 为链式和生成配置提供了一些便利。 如果一个属性被标记一个 `ChainedSet`, 则它将具有如下的API和方法:

**除非另有说明，否则这些方法将返回 `ChainedSet` , 允许链式调用这些方法。**

```js
// 添加/追加 给Set末尾位置一个值.
// value: *
add(value)
```

```js
// 添加 给Set开始位置一个值.
// value: *
prepend(value)
```

```js
// 移除Set中全部值.
clear()
```

```js
// 移除Set中一个指定的值.
// value: *
delete(value)
```

```js
// 检测Set中是否存在一个值.
// value: *
// returns: Boolean
has(value)
```

```js
// 返回Set中值的数组.
// returns: Array
values()
```

```js
// 连接给定的数组到 Set 尾部。
// arr: Array
merge(arr)
```

```js

// 对当前配置上下文执行函数。
// handler: Function -> ChainedSet
  // 一个把 ChainedSet 实例作为单个参数的函数
batch(handler)
```

```js
// 条件执行一个函数去继续配置
// condition: Boolean
// whenTruthy: Function -> ChainedSet
  // 当条件为真，调用把 ChainedSet 实例作为单一参数传入的函数
// whenFalsy: Optional Function -> ChainedSet
  // 当条件为假，调用把 ChainedSet 实例作为单一参数传入的函数
when(condition, whenTruthy, whenFalsy)
```

## 速记方法

存在许多简写方法，用于 使用与简写方法名称相同的键在 ChainedMap 设置一个值
例如, `devServer.hot` 是一个速记方法, 因此它可以用作:

```js
// 在 ChainedMap 上设置一个值的速记方法
devServer.hot(true);

// 上述方法等效于:
devServer.set('hot', true);
```

一个速记方法是可链式的，因此调用它将返回原实例，允许你继续链式使用

### 配置

创建一个新的配置对象

```js
const Config = require('webpack-chain');

const config = new Config();
```

移动到API的更深层将改变你正在修改的内容的上下文。 你可以通过 `config`在此引用顶级配置或者通过调用 `.end()` 方法向上移动一级 使你移回更高的上下文环境。
如果你熟悉jQuery, 这里与其 `.end()` 工作原理类似。除非另有说明，否则全部的API调用都将在当前上下文中返回API实例。 这样，你可以根据需要连续 链式API调用.  
有关对所有速记和低级房费有效的特定值的详细信息，请参阅 [webpack文档层次结构](https://webpack.js.org/configuration/) 中的相应名词。

```js
Config : ChainedMap
```

#### 配置速记方法

```js
config
  .amd(amd)
  .bail(bail)
  .cache(cache)
  .devtool(devtool)
  .context(context)
  .externals(externals)
  .loader(loader)
  .mode(mode)
  .parallelism(parallelism)
  .profile(profile)
  .recordsPath(recordsPath)
  .recordsInputPath(recordsInputPath)
  .recordsOutputPath(recordsOutputPath)
  .stats(stats)
  .target(target)
  .watch(watch)
  .watchOptions(watchOptions)
```

#### 配置 entryPoints

```js
// 回到 config.entryPoints : ChainedMap
config.entry(name) : ChainedSet

config
  .entry(name)
    .add(value)
    .add(value)

config
  .entry(name)
    .clear()

// 用低级别 config.entryPoints:

config.entryPoints
  .get(name)
    .add(value)
    .add(value)

config.entryPoints
  .get(name)
    .clear()
```

#### 配置 output: 速记方法

```js
config.output : ChainedMap

config.output
  .auxiliaryComment(auxiliaryComment)
  .chunkFilename(chunkFilename)
  .chunkLoadTimeout(chunkLoadTimeout)
  .crossOriginLoading(crossOriginLoading)
  .devtoolFallbackModuleFilenameTemplate(devtoolFallbackModuleFilenameTemplate)
  .devtoolLineToLine(devtoolLineToLine)
  .devtoolModuleFilenameTemplate(devtoolModuleFilenameTemplate)
  .filename(filename)
  .hashFunction(hashFunction)
  .hashDigest(hashDigest)
  .hashDigestLength(hashDigestLength)
  .hashSalt(hashSalt)
  .hotUpdateChunkFilename(hotUpdateChunkFilename)
  .hotUpdateFunction(hotUpdateFunction)
  .hotUpdateMainFilename(hotUpdateMainFilename)
  .jsonpFunction(jsonpFunction)
  .library(library)
  .libraryExport(libraryExport)
  .libraryTarget(libraryTarget)
  .path(path)
  .pathinfo(pathinfo)
  .publicPath(publicPath)
  .sourceMapFilename(sourceMapFilename)
  .sourcePrefix(sourcePrefix)
  .strictModuleExceptionHandling(strictModuleExceptionHandling)
  .umdNamedDefine(umdNamedDefine)
```

#### 配置 resolve（解析）: 速记方法

```js
config.resolve : ChainedMap

config.resolve
  .cachePredicate(cachePredicate)
  .cacheWithContext(cacheWithContext)
  .enforceExtension(enforceExtension)
  .enforceModuleExtension(enforceModuleExtension)
  .unsafeCache(unsafeCache)
  .symlinks(symlinks)
```

#### 配置 resolve 别名

```js
config.resolve.alias : ChainedMap

config.resolve.alias
  .set(key, value)
  .set(key, value)
  .delete(key)
  .clear()
```

#### 配置 resolve modules

```js
config.resolve.modules : ChainedSet

config.resolve.modules
  .add(value)
  .prepend(value)
  .clear()
```

#### 配置 resolve aliasFields

```js
config.resolve.aliasFields : ChainedSet

config.resolve.aliasFields
  .add(value)
  .prepend(value)
  .clear()
```

#### 配置 resolve descriptionFields

```js
config.resolve.descriptionFields : ChainedSet

config.resolve.descriptionFields
  .add(value)
  .prepend(value)
  .clear()
```

#### 配置 resolve extensions

```js
config.resolve.extensions : ChainedSet

config.resolve.extensions
  .add(value)
  .prepend(value)
  .clear()
```

#### 配置 resolve mainFields

```js
config.resolve.mainFields : ChainedSet

config.resolve.mainFields
  .add(value)
  .prepend(value)
  .clear()
```

#### 配置 resolve mainFiles

```js
config.resolve.mainFiles : ChainedSet

config.resolve.mainFiles
  .add(value)
  .prepend(value)
  .clear()
```

#### 配置 resolveLoader

当前API `config.resolveLoader` 相同于 配置 `config.resolve` 用下面的配置：

##### 配置 resolveLoader moduleExtensions

```js
config.resolveLoader.moduleExtensions : ChainedSet

config.resolveLoader.moduleExtensions
  .add(value)
  .prepend(value)
  .clear()
```

##### 配置 resolveLoader packageMains

```js
config.resolveLoader.packageMains : ChainedSet

config.resolveLoader.packageMains
  .add(value)
  .prepend(value)
  .clear()
```

#### 配置 performance（性能）: 速记方法

```js
config.performance : ChainedMap

config.performance
  .hints(hints)
  .maxEntrypointSize(maxEntrypointSize)
  .maxAssetSize(maxAssetSize)
  .assetFilter(assetFilter)
```

#### 配置 optimizations（优化）: 速记方法

```js
config.optimization : ChainedMap

config.optimization
  .concatenateModules(concatenateModules)
  .flagIncludedChunks(flagIncludedChunks)
  .mergeDuplicateChunks(mergeDuplicateChunks)
  .minimize(minimize)
  .namedChunks(namedChunks)
  .namedModules(namedModules)
  .nodeEnv(nodeEnv)
  .noEmitOnErrors(noEmitOnErrors)
  .occurrenceOrder(occurrenceOrder)
  .portableRecords(portableRecords)
  .providedExports(providedExports)
  .removeAvailableModules(removeAvailableModules)
  .removeEmptyChunks(removeEmptyChunks)
  .runtimeChunk(runtimeChunk)
  .sideEffects(sideEffects)
  .splitChunks(splitChunks)
  .usedExports(usedExports)
```

#### 配置 optimization minimizers（最小优化器）

```js
// 回到 config.optimization.minimizers
config.optimization
  .minimizer(name) : ChainedMap
```

#### 配置 optimization minimizers: 添加

_注意: 不要用 `new` 去创建最小优化器插件，因为已经为你做好了。_

```js
config.optimization
  .minimizer(name)
  .use(WebpackPlugin, args)

// 例如

config.optimization
  .minimizer('css')
  .use(OptimizeCSSAssetsPlugin, [{ cssProcessorOptions: { safe: true } }])

// Minimizer 插件也可以由它们的路径指定，从而允许在不使用插件或webpack配置的情况下跳过昂贵的 require s。
config.optimization
  .minimizer('css')
  .use(require.resolve('optimize-css-assets-webpack-plugin'), [{ cssProcessorOptions: { safe: true } }])

```

#### 配置 optimization minimizers: 修改参数

```js
config.optimization
  .minimizer(name)
  .tap(args => newArgs)

// 例如
config
  .minimizer('css')
  .tap(args => [...args, { cssProcessorOptions: { safe: false } }])
```

#### 配置 optimization minimizers: 修改实例

```js
config.optimization
  .minimizer(name)
  .init((Plugin, args) => new Plugin(...args));
```

#### 配置 optimization minimizers: 移除

```js
config.optimization.minimizers.delete(name)
```

#### 配置插件

```js
// 回到 config.plugins
config.plugin(name) : ChainedMap
```

#### 配置插件: 添加

_注意: 不要用 `new` 去创建插件，因为已经为你做好了。_

```js
config
  .plugin(name)
  .use(WebpackPlugin, args)

// 例如
config
  .plugin('hot')
  .use(webpack.HotModuleReplacementPlugin);

// 插件也可以由它们的路径指定，从而允许在不使用插件或webpack配置的情况下跳过昂贵的 require s。
config
  .plugin('env')
  .use(require.resolve('webpack/lib/EnvironmentPlugin'), [{ 'VAR': false }]);
```

#### 配置插件: 修改参数

```js
config
  .plugin(name)
  .tap(args => newArgs)

// 例如
config
  .plugin('env')
  .tap(args => [...args, 'SECRET_KEY']);
```

#### 配置插件: 修改实例

```js
config
  .plugin(name)
  .init((Plugin, args) => new Plugin(...args));
```

#### 配置插件: 移除

```js
config.plugins.delete(name)
```

#### 配置插件: 在之前调用

指定当前插件上下文应该在另一个指定插件之前执行，你不能在同一个插件上同时使用 `.before()` 和 `.after()`。  

```js
config
  .plugin(name)
    .before(otherName)

// 例如
config
  .plugin('html-template')
    .use(HtmlWebpackTemplate)
    .end()
  .plugin('script-ext')
    .use(ScriptExtWebpackPlugin)
    .before('html-template');
```

#### Config plugins: 在之后调用

指定当前插件上下文应该在另一个指定插件之后执行，你不能在同一个插件上同时使用 `.before()` 和 `.after()`。  

```js
config
  .plugin(name)
    .after(otherName)

// 例如
config
  .plugin('html-template')
    .after('script-ext')
    .use(HtmlWebpackTemplate)
    .end()
  .plugin('script-ext')
    .use(ScriptExtWebpackPlugin);
```

#### 配置 resolve 插件

```js
// 回到 config.resolve.plugins
config.resolve.plugin(name) : ChainedMap
```

#### 配置 resolve 插件: 添加

_注意: 不要用 `new` 去创建插件，因为已经为你做好了。_

```js
config.resolve
  .plugin(name)
  .use(WebpackPlugin, args)
```

#### 配置 resolve 插件: 修改参数

```js
config.resolve
  .plugin(name)
  .tap(args => newArgs)
```

#### 配置 resolve 插件: 修改实例

```js
config.resolve
  .plugin(name)
  .init((Plugin, args) => new Plugin(...args))
```

#### 配置 resolve 插件: 移除

```js
config.resolve.plugins.delete(name)
```

#### 配置 resolve 插件: 在之前调用

指定当前插件上下文应该在另一个指定插件之前执行，你不能在同一个插件上同时使用 `.before()` 和 `.after()`。  

```js
config.resolve
  .plugin(name)
    .before(otherName)

// 例如

config.resolve
  .plugin('beta')
    .use(BetaWebpackPlugin)
    .end()
  .plugin('alpha')
    .use(AlphaWebpackPlugin)
    .before('beta');
```

#### 配置 resolve 插件: 在之后调用

指定当前插件上下文应该在另一个指定插件之后执行，你不能在同一个插件上同时使用 `.before()` 和 `.after()`。  

```js
config.resolve
  .plugin(name)
    .after(otherName)

// 例如
config.resolve
  .plugin('beta')
    .after('alpha')
    .use(BetaWebpackTemplate)
    .end()
  .plugin('alpha')
    .use(AlphaWebpackPlugin);
```

#### 配置 node

```js
config.node : ChainedMap

config.node
  .set('__dirname', 'mock')
  .set('__filename', 'mock');
```

#### 配置 devServer

```js
config.devServer : ChainedMap
```

#### 配置 devServer allowedHosts

```js
config.devServer.allowedHosts : ChainedSet

config.devServer.allowedHosts
  .add(value)
  .prepend(value)
  .clear()
```

#### 配置 devServer: 速记方法

```js
config.devServer
  .bonjour(bonjour)
  .clientLogLevel(clientLogLevel)
  .color(color)
  .compress(compress)
  .contentBase(contentBase)
  .disableHostCheck(disableHostCheck)
  .filename(filename)
  .headers(headers)
  .historyApiFallback(historyApiFallback)
  .host(host)
  .hot(hot)
  .hotOnly(hotOnly)
  .https(https)
  .inline(inline)
  .info(info)
  .lazy(lazy)
  .noInfo(noInfo)
  .open(open)
  .openPage(openPage)
  .overlay(overlay)
  .pfx(pfx)
  .pfxPassphrase(pfxPassphrase)
  .port(port)
  .progress(progress)
  .proxy(proxy)
  .public(public)
  .publicPath(publicPath)
  .quiet(quiet)
  .setup(setup)
  .socket(socket)
  .staticOptions(staticOptions)
  .stats(stats)
  .stdin(stdin)
  .useLocalIp(useLocalIp)
  .watchContentBase(watchContentBase)
  .watchOptions(watchOptions)
```

#### 配置 module

```js
config.module : ChainedMap
```

#### 配置 module: 速记方法

```js
config.module : ChainedMap

config.module
  .noParse(noParse)
```

#### 配置 module rules: 速记方法

```js
config.module.rules : ChainedMap

config.module
  .rule(name)
    .test(test)
    .pre()
    .post()
    .enforce(preOrPost)
```

#### 配置 module rules uses (loaders): 创建

```js
config.module.rules{}.uses : ChainedMap

config.module
  .rule(name)
    .use(name)
      .loader(loader)
      .options(options)

// Example

config.module
  .rule('compile')
    .use('babel')
      .loader('babel-loader')
      .options({ presets: ['@babel/preset-env'] });
```

#### 配置 module rules uses (loaders): 修改选项

```js
config.module
  .rule(name)
    .use(name)
      .tap(options => newOptions)

// 例如

config.module
  .rule('compile')
    .use('babel')
      .tap(options => merge(options, {
        plugins: ['@babel/plugin-proposal-class-properties']
      }));
```

#### 配置 module rules oneOfs (条件 rules)

```js
config.module.rules{}.oneOfs : ChainedMap<Rule>

config.module
  .rule(name)
    .oneOf(name)

// 例如

config.module
  .rule('css')
    .oneOf('inline')
      .resourceQuery(/inline/)
      .use('url')
        .loader('url-loader')
        .end()
      .end()
    .oneOf('external')
      .resourceQuery(/external/)
      .use('file')
        .loader('file-loader')
```

---

### 合并配置

webpack-chain 支持将对象合并到配置实例，改实例类似于 webpack-chain 模式布局的布局。 请注意，这不是 webpack 配置对象，但您可以再将webpack配置对象提供给webpack-chain 以匹配器布局之前对其进行转换。

```js
config.merge({ devtool: 'source-map' });

config.get('devtool') // "source-map"
```

```js
config.merge({
  [key]: value,

  amd,
  bail,
  cache,
  context,
  devtool,
  externals,
  loader,
  mode,
  parallelism,
  profile,
  recordsPath,
  recordsInputPath,
  recordsOutputPath,
  stats,
  target,
  watch,
  watchOptions,

  entry: {
    [name]: [...values]
  },

  plugin: {
    [name]: {
      plugin: WebpackPlugin,
      args: [...args],
      before,
      after
    }
  },

  devServer: {
    [key]: value,

    clientLogLevel,
    compress,
    contentBase,
    filename,
    headers,
    historyApiFallback,
    host,
    hot,
    hotOnly,
    https,
    inline,
    lazy,
    noInfo,
    overlay,
    port,
    proxy,
    quiet,
    setup,
    stats,
    watchContentBase
  },

  node: {
    [key]: value
  },

  optimizations: {
    concatenateModules,
    flagIncludedChunks,
    mergeDuplicateChunks,
    minimize,
    minimizer,
    namedChunks,
    namedModules,
    nodeEnv,
    noEmitOnErrors,
    occurrenceOrder,
    portableRecords,
    providedExports,
    removeAvailableModules,
    removeEmptyChunks,
    runtimeChunk,
    sideEffects,
    splitChunks,
    usedExports,
  },

  performance: {
    [key]: value,

    hints,
    maxEntrypointSize,
    maxAssetSize,
    assetFilter
  },

  resolve: {
    [key]: value,

    alias: {
      [key]: value
    },
    aliasFields: [...values],
    descriptionFields: [...values],
    extensions: [...values],
    mainFields: [...values],
    mainFiles: [...values],
    modules: [...values],

    plugin: {
      [name]: {
        plugin: WebpackPlugin,
        args: [...args],
        before,
        after
      }
    }
  },

  resolveLoader: {
    [key]: value,

    alias: {
      [key]: value
    },
    aliasFields: [...values],
    descriptionFields: [...values],
    extensions: [...values],
    mainFields: [...values],
    mainFiles: [...values],
    modules: [...values],
    moduleExtensions: [...values],
    packageMains: [...values],

    plugin: {
      [name]: {
        plugin: WebpackPlugin,
        args: [...args],
        before,
        after
      }
    }
  },

  module: {
    [key]: value,

    rule: {
      [name]: {
        [key]: value,

        enforce,
        issuer,
        parser,
        resource,
        resourceQuery,
        test,

        include: [...paths],
        exclude: [...paths],

        oneOf: {
          [name]: Rule
        },

        use: {
          [name]: {
            loader: LoaderString,
            options: LoaderOptions,
            before,
            after
          }
        }
      }
    }
  }
})
```

### 条件配置

当使用的情况下工作ChainedMap和ChainedSet，则可以使用执行条件的配置when。您必须指定一个表达式 when()，以评估其真实性或虚假性。如果表达式是真实的，则将使用当前链接实例的实例调用第一个函数参数。您可以选择提供在条件为假时调用的第二个函数，该函数也是当前链接的实例。

```js
// 示例：仅在生产期间添加minify插件
config
  .when(process.env.NODE_ENV === 'production', config => {
    config
      .plugin('minify')
      .use(BabiliWebpackPlugin);
  });
```

```js
// 例：只有在生产过程中添加缩小插件，否则设置devtool到源映射
config
  .when(process.env.NODE_ENV === 'production',
    config => config.plugin('minify').use(BabiliWebpackPlugin),
    config => config.devtool('source-map')
  );
```

### 检查生成的配置

您可以使用检查生成的webpack配置config.toString()。这将生成配置的字符串化版本，其中包含命名规则，用法和插件的注释提示：

``` js
config
  .module
    .rule('compile')
      .test(/\.js$/)
      .use('babel')
        .loader('babel-loader');

config.toString();


{
  module: {
    rules: [
      /* config.module.rule('compile') */
      {
        test: /\.js$/,
        use: [
          /* config.module.rule('compile').use('babel') */
          {
            loader: 'babel-loader'
          }
        ]
      }
    ]
  }
}

```

默认情况下，如果生成的字符串包含需要的函数和插件，则不能直接用作真正的webpack配置。为了生成可用的配置，您可以通过__expression在其上设置特殊属性来自定义函数和插件的字符串化方式：

``` js
class MyPlugin {}
MyPlugin.__expression = `require('my-plugin')`;

function myFunction () {}
myFunction.__expression = `require('my-function')`;

config
  .plugin('example')
    .use(MyPlugin, [{ fn: myFunction }]);

config.toString();

/*
{
  plugins: [
    new (require('my-plugin'))({
      fn: require('my-function')
    })
  ]
}
*/
```

通过其路径指定的插件将require()自动生成其语句：

``` js
config
  .plugin('env')
    .use(require.resolve('webpack/lib/ProvidePlugin'), [{ jQuery: 'jquery' }])

config.toString();


{
  plugins: [
    new (require('/foo/bar/src/node_modules/webpack/lib/EnvironmentPlugin.js'))(
      {
        jQuery: 'jquery'
      }
    )
  ]
}
```

您还可以调用toString静态方法Config，以便在字符串化之前修改配置对象。

```js
Config.toString({
  ...config.toConfig(),
  module: {
    defaultRules: [
      {
        use: [
          {
            loader: 'banner-loader',
            options: { prefix: 'banner-prefix.txt' },
          },
        ],
      },
    ],
  },
})


{
  plugins: [
    /* config.plugin('foo') */
    new TestPlugin()
  ],
  module: {
    defaultRules: [
      {
        use: [
          {
            loader: 'banner-loader',
            options: {
              prefix: 'banner-prefix.txt'
            }
          }
        ]
      }
    ]
  }
}
```

[npm-image]: https://img.shields.io/npm/v/webpack-chain.svg
[npm-downloads]: https://img.shields.io/npm/dt/webpack-chain.svg
[npm-url]: https://www.npmjs.com/package/webpack-chain
[travis-image]: https://api.travis-ci.org/neutrinojs/webpack-chain.svg?branch=master
[travis-url]: https://travis-ci.org/neutrinojs/webpack-chain
