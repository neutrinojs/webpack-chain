2018-09-13
==========

  * 4.11.0

2018-09-11
==========

  * Support specifying plugins by path ([#102](https://github.com/neutrinojs/webpack-chain/issues/102))
    This allows the expensive require()s to be skipped in cases where the
    plugin or webpack configuration won't end up being used. For example,
    using this feature in Neutrino reduces the overhead of dynamically
    generating `.eslintrc.js` from 1800ms to 250ms.
    As an added bonus, plugins specified by path will also have their
    `require()` statement generated automatically when using `toString()`,
    saving the need for callers to manually do so using `__expression`.

2018-09-10
==========

  * Lock file maintenance ([#100](https://github.com/neutrinojs/webpack-chain/issues/100))

2018-09-05
==========

  * Lock file maintenance ([#96](https://github.com/neutrinojs/webpack-chain/issues/96))
  * 4.10.0
  * Use the Resolve API to define ResolveLoader according to webpack ([#99](https://github.com/neutrinojs/webpack-chain/issues/99))
    * Use the Resolve API to define ResolveLoader according to webpack
    * Fix linting error
    * Test shorthands and plugins with ResolveLoader

2018-08-26
==========

  * Lock file maintenance

2018-08-22
==========

  * Migrate to new org ([#92](https://github.com/neutrinojs/webpack-chain/issues/92))
    * Migrate to new org
    * Update changelog, use newer babel packages in README

2018-08-21
==========

  * test: 'clean' in 'ChainedMap' ([#93](https://github.com/neutrinojs/webpack-chain/issues/93))

2018-08-19
==========

  * Lock file maintenance

2018-08-14
==========

  * 4.9.0

2018-08-13
==========

  * Update to ESLint 5 ([#89](https://github.com/neutrinojs/webpack-chain/issues/89))
    airbnb-config is now finally compatible with ESLint 5, along with the
    other configs/plugins. The Node 6 version used on Travis has been
    adjusted to satisfy ESLint 5's node engines `^6.14.0` requirement
    (and changed to just reference the latest version; there are pros
    and cons of sticking to old vs latest, but I think latest makes more
    sense).
    Closes [#69](https://github.com/neutrinojs/webpack-chain/issues/69).
    Closes [#77](https://github.com/neutrinojs/webpack-chain/issues/77).
    Closes [#87](https://github.com/neutrinojs/webpack-chain/issues/87).
    Closes [#88](https://github.com/neutrinojs/webpack-chain/issues/88).

2018-08-12
==========

  * Lock file maintenance ([#85](https://github.com/neutrinojs/webpack-chain/issues/85))
  * Implement ChainedMap.getOrCompute ([#63](https://github.com/neutrinojs/webpack-chain/issues/63))

2018-08-11
==========

  * Support Object literal plugin usage ([#86](https://github.com/neutrinojs/webpack-chain/issues/86))

2018-07-29
==========

  * Lock file maintenance

2018-07-22
==========

  * Lock file maintenance

2018-07-15
==========

  * Lock file maintenance

2018-07-08
==========

  * Lock file maintenance

2018-07-01
==========

  * Lock file maintenance

2018-06-24
==========

  * Lock file maintenance

2018-06-21
==========

  * Run yarn lint --fix
    To resolve:
    ```
    src/Config.js
    86:18  error  Unnecessary 'else' after 'return'  no-else-return
    src/Use.js
    3:15  error  `deepmerge` import should occur before import of `./ChainedMap`  import/order
    ```
  * Update dependency eslint-config-airbnb-base to v13

2018-06-18
==========

  * Lock file maintenance

2018-06-10
==========

  * Lock file maintenance

2018-06-04
==========

  * Lock file maintenance ([#61](https://github.com/neutrinojs/webpack-chain/issues/61))
    * Lock file maintenance
    * Run `yarn lint --fix` to resolve new Prettier error

2018-05-27
==========

  * Lock file maintenance ([#60](https://github.com/neutrinojs/webpack-chain/issues/60))
    `yarn lint --fix` was required to resolve errors under Prettier 1.13.0.

2018-05-20
==========

  * Lock file maintenance

2018-05-15
==========

  * Fix linting :/
  * Fix README bug, test in Node.js v6
  * 4.8.0
  * Add test for Config.toString, add README note
  * Expose toString as a static method on Config ([#57](https://github.com/neutrinojs/webpack-chain/issues/57))

2018-05-14
==========

  * 4.7.0
  * Lint with eslint, prettier, airbnb ([#52](https://github.com/neutrinojs/webpack-chain/issues/52))
    * Lint with eslint, prettier, airbnb
    * Node.js versions for linting and testing in CI
    * Add eslint-plugin-import dep of airbnb
    * Linting fixes after rebase
  * Support Config.toString() with name hints ([#53](https://github.com/neutrinojs/webpack-chain/issues/53))
    Adds support for inspecting the generated webpack config using
    `config.toString()`, which will generate a stringified version of
    the config with comment hints for named rules, uses and plugins.

2018-05-12
==========

  * Lock file maintenance
  * Configure Renovate ([#54](https://github.com/neutrinojs/webpack-chain/issues/54))

2018-04-15
==========

  * 4.6.0
  * Support Webpack 4.x ([#51](https://github.com/neutrinojs/webpack-chain/issues/51))
    * Upgrade to webpack 4.x
    * Add module test
    * Switch back from validateSchema() -> validate()
    * Update README.md
    * Add tests for Optimization & Performance
    * Update README.md with optimization documentation
    * Alphabetize and cleanup single/double quotes
    * Update .travis.yml to bump node version
  * Update devDependencies ([#50](https://github.com/neutrinojs/webpack-chain/issues/50))
    Bumps the version of ava (since for versions under v1, changes in the
    middle digit is a breaking change, so are not covered by tilde ranges)
    and refreshes the lockfile using `rm yarn.lock && yarn`.

2017-11-21
==========

  * 4.5.0
  * Merge pull request [#43](https://github.com/neutrinojs/webpack-chain/issues/43) from eliperelman/chain-method
    Introduce method for performing a batch of operations against a context

2017-11-20
==========

  * Introduce method for performing a batch of operations against a context

2017-10-09
==========

  * 4.4.2
  * Update changelog
  * Hotfix - guard against non-defined entries when ordering chainedmap

2017-10-05
==========

  * Updating changelog
  * 4.4.1
  * Missing schema before/after
  * 4.4.0
  * Bumping deps
  * Merge pull request [#42](https://github.com/neutrinojs/webpack-chain/issues/42) from eliperelman/use-before-after
    Feature: allow specifying to use before or after other use
  * Feature: allow specifying .before or .after to order plugins and uses

2017-10-04
==========

  * Allow omitting keys from source merge object
  * Rename when arguments to be clearer

2017-10-01
==========

  * Merge pull request [#41](https://github.com/neutrinojs/webpack-chain/issues/41) from edmorley/neutrino-docs-sync
    Docs: Upstream fixes made to Neutrino's webpack-chain docs
  * Docs: Upstream fixes made to Neutrino's webpack-chain docs
    Neutrino now has a slightly modified copy of the webpack-chain docs
    in its own repository:
    https://github.com/mozilla-neutrino/neutrino-dev/blob/master/docs/webpack-chain.md
    As part of that import, a few docs cleanups occurred that are also
    applicable to the docs in the webpack-chain repo. Upstreaming these
    reduces the size of the diff so should also make it easier to keep
    the two in sync in the future.

2017-09-26
==========

  * Merge pull request [#40](https://github.com/neutrinojs/webpack-chain/issues/40) from edmorley/plugins-docs
    Improve documentation for plugin configuration

2017-09-24
==========

  * Improve documentation for plugin configuration
    Adds examples for deleting plugins (to make it clearer that the
    `.delete()` must be applied to the backing set and not using the
    shorthand form), and corrects some typos.

2017-09-12
==========

  * Update changelog
  * 4.3.0
  * Merge pull request [#38](https://github.com/neutrinojs/webpack-chain/issues/38) from eliperelman/update-shorthands-devserver-config-output
    Update API for base config, dev server, and output
  * Update API for base config, dev server, and output
  * 4.2.0
  * Updating README with shorthands
  * Merge pull request [#37](https://github.com/neutrinojs/webpack-chain/issues/37) from eliperelman/resolve-module-shorthands
    Add new shorthands from resolve and output
  * Add new shorthands from resolve and output

2017-09-11
==========

  * changelog
  * 4.1.0
  * Merge pull request [#36](https://github.com/neutrinojs/webpack-chain/issues/36) from eliperelman/rule-oneof
    Updating rule definition shortcuts, adding oneOf
  * Updating rule definition shortcuts, adding oneOf

2017-08-02
==========

  * Release v4.0.0
  * Merge pull request [#32](https://github.com/neutrinojs/webpack-chain/issues/32) from eliperelman/noparse-shorthand
    Switch noParse to getter/setter to allow webpack v3 function argument
  * Switch noParse to getter/setter to allow webpack v3 function argument
  * Merge pull request [#31](https://github.com/neutrinojs/webpack-chain/issues/31) from psachs21/patch-1
    Serialize performance into config output

2017-07-20
==========

  * Serialize performance into config output
    Need to output performance to config object.

2017-05-17
==========

  * Releasing v3.3.0
  * Merge pull request [#27](https://github.com/neutrinojs/webpack-chain/issues/27) from psachs21/noParse
    Adding noParse on module
  * Adding noParse on module

2017-04-11
==========

  * Merge pull request [#23](https://github.com/neutrinojs/webpack-chain/issues/23) from eliperelman/devserver-additions
    Adding updated shorthand methods for devServer
  * Adding updated shorthand methods for devServer

2017-03-28
==========

  * v3.1.0
  * Merge pull request [#22](https://github.com/neutrinojs/webpack-chain/issues/22) from eliperelman/when
    Allow conditional configuration via when
  * Allow conditional configuration via when

2017-03-08
==========

  * Update README with links to previous docs versions

2017-03-07
==========

  * Merge pull request [#16](https://github.com/neutrinojs/webpack-chain/issues/16) from eliperelman/v3
    Make rule.include, rule.exclude, loaders and plugins more extensible
  * Make rule.include, rule.exclude, loaders and plugins more extensible
  * v2.0.1
  * Merge pull request [#17](https://github.com/neutrinojs/webpack-chain/issues/17) from aretecode/patch-1
    undefined plugin
  * undefined plugin
    - unsure if this is the functionality intended, or if you mean to do different merging, but plugin variable is undefined.

2017-03-05
==========

  * MPL license, moving to mozilla-neutrino
  * Merge pull request [#14](https://github.com/neutrinojs/webpack-chain/issues/14) from eliperelman/testing
    Adding testing, which informed v2 API, updated docs to reflect
  * Adding testing, which informed v2 API, updated docs to reflect

2017-03-03
==========

  * Merge pull request [#13](https://github.com/neutrinojs/webpack-chain/issues/13) from eliperelman/plugin-api
    Make Plugin API consistent with Loader API
  * Make Plugin API consistent with Loader API
  * Removing empty entities from cluttering configuration object
  * Docs: getConfig -> toConfig

2017-03-02
==========

  * Adding ChainedMap and ChainedSet documentation

2017-03-01
==========

  * Bumping to v1.4.2
  * Merge pull request [#7](https://github.com/neutrinojs/webpack-chain/issues/7) from tauren/patch-1
    Fix bug where `exclude` doesn't return `this`
  * Fix bug where `exclude` doesn't return `this`

2017-02-25
==========

  * v1.4.1
  * Merge pull request [#3](https://github.com/neutrinojs/webpack-chain/issues/3) from eliperelman/merge-rule-loaders
    Allowing config merge to append to existing rule loaders
  * Allowing config merge to append to existing rule loaders
