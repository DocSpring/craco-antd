# Craco Ant Design Plugin

This is a [craco](https://github.com/sharegate/craco) plugin that makes it easy to use the [Ant Design](https://ant.design/) UI library with [create-react-app](https://facebook.github.io/create-react-app/) version >= 2. This includes:

- Less (provided by [craco-less](https://github.com/ndbroadbent/craco-less))
- `babel-plugin-import` to only import the required CSS, instead of everything

### Installation

First, follow the beginning of the [Ant Design `create-react-app` Documentation](https://ant.design/docs/react/use-with-create-react-app) to set up your app with Ant Design.
(Stop before the "Advanced Guides" section, because this plugin handles all of that for you.)

Then, follow the [`craco` Installation Instructions](https://github.com/sharegate/craco/blob/master/packages/craco/README.md##installation) to install the `craco` package, create a `craco.config.js` file, and modify the scripts in your `package.json`.

Then install `craco-antd`:

```bash
$ yarn add -D craco-antd

# Or

$ npm i --save-dev craco-antd
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

Customize the theme with the `customizeTheme` option:

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

> (`customizeTheme` is just a nicer name for the `modifyVars` option in `less-loader`.)

> If you need to pass any additional options to `less-loader`, you can pass these in a `lessLoaderOptions` object.

That's it! Now you can customize the Ant Design theme, and you can also compile Less files in your own app.

If you need to configure anything else for the webpack build, take a look at the
[Configuration Overview section in the `craco` README](https://github.com/sharegate/craco/blob/master/packages/craco/README.md#configuration-overview). You can use `CracoAntDesignPlugin` while making other changes to `babel` and `webpack`, etc.
