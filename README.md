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

### Supported Versions

`craco-antd` is tested with:

- `react-scripts`: `^2.1.1`
- `@craco/craco`: `^2.2.3`

### Installation

First, follow the beginning of the [Ant Design `create-react-app` Documentation](https://ant.design/docs/react/use-with-create-react-app) to set up your app with Ant Design.
(Stop before the "Advanced Guides" section, because this plugin handles all of that for you.)

Then, follow the [`craco` Installation Instructions](https://github.com/sharegate/craco/blob/master/packages/craco/README.md##installation) to install the `craco` package, create a `craco.config.js` file, and modify the scripts in your `package.json`.

Then install `craco-antd`:

```bash
$ yarn add craco-antd

# Or

$ npm i -S craco-antd
```

### Usage

Here is a complete `craco.config.js` configuration file that sets up Less compilation and `babel-plugin-import` for `create-react-app`:

```js
const CracoAntDesignPlugin = require("craco-antd");

module.exports = {
  plugins: [{ plugin: CracoAntDesignPlugin }]
};
```

Ant Design also allows you to customize the theme by modifying the Less variables.

> View Ant Design's ["Customize Theme" documentation](https://ant.design/docs/react/customize-theme)

`craco-antd` will look for a `antd.customize.json` file in the root directory of your project. If this file is found, the contents will be merged into the `modifyVars` option for `less-loader`. For example:

```json
{
  "@primary-color": "#1DA57A",
  "@link-color": "#1DA57A",
  "@border-radius-base": "2px"
}
```

You can also customize these variables in `craco.config.js` with the `customizeTheme` option:

```js
const CracoAntDesignPlugin = require("craco-antd");

module.exports = {
  plugins: [
    {
      plugin: CracoAntDesignPlugin,
      options: {
        customizeTheme: {
          "@primary-color": "#1DA57A",
          "@link-color": "#1DA57A",
          "@border-radius-base": "2px"
        }
      }
    }
  ]
};
```

> (`customizeTheme` is just an alias for the `modifyVars` option in `less-loader`.)

Finally, you can pass a `lessLoaderOptions` object if you want full control over the `less-loader` options:

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
        }
      }
    }
  ]
};
```

> [View the less-loader Documentation](https://webpack.js.org/loaders/less-loader/).

If you use more than one of these options to customize the theme, they are merged together in the following order:

- `antd.customize.json`
- `options.customizeTheme`
- `options.lessLoaderOptions.modifyVars`

---

That's it! Now you can customize the Ant Design theme, and you can also compile Less files in your own app.

If you need to configure anything else for the webpack build, take a look at the
[Configuration Overview section in the `craco` README](https://github.com/sharegate/craco/blob/master/packages/craco/README.md#configuration-overview). You can use `CracoAntDesignPlugin` while making other changes to `babel` and `webpack`, etc.
