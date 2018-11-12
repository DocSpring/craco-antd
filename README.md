# Craco Less Plugin

This is a plugin that adds Less support to [create-react-app](https://facebook.github.io/create-react-app/) via [craco](https://github.com/sharegate/craco).

### Installation

First, follow the [`craco` Installation Instructions](https://github.com/sharegate/craco/blob/master/packages/craco/README.md##installation) to install the `craco` package, create a `craco.config.js` file, and modify the scripts in your `package.json`.

Then install `craco-less`:

```bash
$ yarn add -D craco-less

# Or

$ npm i --save-dev craco-less
```

### Usage

Here is a complete `craco.config.js` configuration file that adds Less compilation to `create-react-app`:

```js
const CracoLessPlugin = require("craco-less");

module.exports = {
  plugins: [{ plugin: CracoLessPlugin }]
};
```

To configure the `less-loader` options:

```js
const CracoLessPlugin = require("craco-less");

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        modifyVars: {
          "@primary-color": "#1DA57A",
          "@link-color": "#1DA57A",
          "@border-radius-base": "2px"
        },
        javascriptEnabled: true
      }
    }
  ]
};
```

This example uses the `modifyVars` option to customize the [Ant Design](https://ant.design/) theme. Read the [Ant Design documentation](https://ant.design/docs/react/customize-theme#How-to-do-it) for more information.

[View the less-loader Documentation](https://github.com/webpack-contrib/less-loader).
