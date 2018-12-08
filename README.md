[![Build Status](https://travis-ci.org/FormAPI/craco-antd.svg?branch=master)](https://travis-ci.org/FormAPI/craco-antd)
[![Coverage Status](https://coveralls.io/repos/github/FormAPI/craco-antd/badge.svg?branch=master)](https://coveralls.io/github/FormAPI/craco-antd?branch=master)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

# Craco Ant Design Plugin

This is a [craco](https://github.com/sharegate/craco) plugin that makes it easy to use the [Ant Design](https://ant.design/) UI library with [create-react-app](https://facebook.github.io/create-react-app/) version >= 2.

> Use [react-app-rewired](https://github.com/timarney/react-app-rewired) for `create-react-app` version 1.

`craco-antd` includes:

- Less (provided by [craco-less](https://github.com/FormAPI/craco-less))
- `babel-plugin-import` to only import the required CSS, instead of everything
- A nicer way to customize the theme. Save your modified variables in `antd.customize.json`

## Supported Versions

`craco-antd` is tested with:

- `react-scripts`: `^2.1.1`
- `@craco/craco`: `^2.4.0`

## Installation

First, follow the beginning of the [Ant Design `create-react-app` Documentation](https://ant.design/docs/react/use-with-create-react-app) to set up your app with Ant Design.
(Stop before the "Advanced Guides" section, because this plugin handles all of that for you.)

Then, follow the [`craco` Installation Instructions](https://github.com/sharegate/craco/blob/master/packages/craco/README.md##installation) to install the `craco` package, create a `craco.config.js` file, and modify the scripts in your `package.json`.

Then install `craco-antd`:

```bash
$ yarn add craco-antd

# OR

$ npm i -S craco-antd
```

## Basic Usage

Here is a complete `craco.config.js` configuration file that sets up Less compilation and `babel-plugin-import` for `create-react-app`:

```js
const CracoAntDesignPlugin = require("craco-antd");

module.exports = {
  plugins: [{ plugin: CracoAntDesignPlugin }]
};
```

## Production-Ready Config

Here is a `craco.config.js` file that sets up [`webpackbar`](https://github.com/nuxt/webpackbar) and [`webpack-bundle-analyzer`](https://github.com/webpack-contrib/webpack-bundle-analyzer) for development builds.
It also sets up [Preact](https://preactjs.com/) with the [`craco-preact`](https://github.com/FormAPI/craco-preact) plugin. (It's faster, smaller, and works fine with Ant Design.)

I put my custom theme variables in a `src/style/AntDesign` folder, as well as some custom components and other Less files.

```javascript
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const WebpackBar = require("webpackbar");
const CracoAntDesignPlugin = require("craco-antd");
const path = require("path");

module.exports = {
  webpack: {
    plugins: [
      new WebpackBar({ profile: true }),
      ...(process.env.NODE_ENV === "development"
        ? [new BundleAnalyzerPlugin({ openAnalyzer: false })]
        : [])
    ]
  },
  plugins: [
    { plugin: require("craco-preact") },
    {
      plugin: CracoAntDesignPlugin,
      options: {
        customizeThemeLessPath: path.join(
          __dirname,
          "src/style/AntDesign/customTheme.less"
        )
      }
    }
  ]
};
```

## Customize Ant Design Theme

You can modify the default Ant Design theme by changing some Less variables.

`craco-antd` will look for variables in a Less file at `./antd.customize.less`. (You can customize this file path with the `customizeThemeLessPath` option.)

```less
// ./antd.customize.less
@primary-color: #1da57a;
@link-color: #1da57a;
```

> [Here's a list of all the variables that can be modified.](https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less)

You can also customize these variables directly in your `craco.config.js` with the `customizeTheme` option:

```js
const CracoAntDesignPlugin = require("craco-antd");

module.exports = {
  plugins: [
    {
      plugin: CracoAntDesignPlugin,
      options: {
        customizeTheme: {
          "@primary-color": "#1DA57A",
          "@link-color": "#1DA57A"
        }
      }
    }
  ]
};
```

> `customizeTheme` is just an alias for the `modifyVars` option in `less-loader`.

If you use multiple options to customize the theme variables, they are merged together in the following order:

- The file at `options.customizeThemeLessPath` (default: `./antd.customize.less`)
- `options.customizeTheme`
- `options.lessLoaderOptions.modifyVars`

> For more information, see Ant Design's ["Customize Theme" documentation](https://ant.design/docs/react/customize-theme).

## Options

You can pass an `options` object to configure the loaders and plugins. You can also pass a `modifyLessRule` callback to have full control over the Less webpack rule.
See the [`craco-less`](https://github.com/FormAPI/craco-less#configuration) documentation for more information about these options:

- `options.styleLoaderOptions`
- `options.cssLoaderOptions`
- `options.postcssLoaderOptions`
- `options.lessLoaderOptions`
- `options.miniCssExtractPluginOptions`
- `options.modifyLessRule`

Example:

```js
module.exports = {
  plugins: [
    {
      plugin: CracoAntDesignPlugin,
      options: {
        lessLoaderOptions: {
          modifyVars: { "@primary-color": "#1DA57A" },
          strictMath: true,
          noIeCompat: true
        },
        cssLoaderOptions: {
          modules: true,
          localIdentName: "[local]_[hash:base64:5]"
        }
      }
    }
  ]
};
```

## Large Bundle Size from Ant Design Icons

You can use the [webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer) plugin to see a breakdown of all the JS and CSS in your webpack build. Here's how to add this plugin to your `craco.config.js` configuration file:

```js
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = {
  webpack: {
    plugins: [new BundleAnalyzerPlugin()]
  },
  plugins: [{ plugin: require("craco-antd") }]
};
```

If you have imported any icons from Ant Design, you will see a very large (> 500KB) entry for `@ant-design/icons/lib`:

<img src="https://github.com/FormAPI/craco-antd/raw/master/img/large-ant-design-icons-lib.png" alt="Ant Design Large Icons" width="500">

This is a problem with Ant Design `v3.9.0+`, and it will be fixed in the next version. See [this GitHub issue](https://github.com/ant-design/ant-design/issues/12011) for more information. [This comment](https://github.com/ant-design/ant-design/issues/12011#issuecomment-433775872) talks about the fix, and here is [the PR](https://github.com/ant-design/ant-design/pull/12888).

In the meantime, you can [set up an import alias](https://github.com/ant-design/ant-design/issues/12011#issuecomment-423470708) and only include the required icons.

## Further Configuration

If you need to configure anything else for the webpack build, take a look at the
[Configuration Overview section in the `craco` README](https://github.com/sharegate/craco/blob/master/packages/craco/README.md#configuration-overview). You can use `CracoAntDesignPlugin` while making other changes to `babel` and `webpack`, etc.

## Contributing

Install dependencies:

```bash
$ yarn install

# OR

$ npm install
```

Run tests:

```
$ yarn test
```

Before submitting a pull request, please check the following:

- All tests are passing
  - Run `yarn test`
- 100% test coverage
  - Coverage will be printed after running tests.
  - Open the coverage results in your browser: `$ open coverage/lcov-report/index.html`
- All code is formatted with [Prettier](https://prettier.io/)
  - Run `prettier --write **/*.js`
  - If you use VS Code, I recommend enabling the `formatOnSave` option.

## License

[MIT](./LICENSE)
