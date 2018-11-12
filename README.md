# Craco Less Plugin

### Installation

Yarn:

```bash
$ yarn add -D craco-less
```

NPM:

```bash
$ npm i –save-dev craco-less
```

### Usage

In your `craco.config.js`:

```js
const CracoLessPlugin = require("craco-less");

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin
    }
  ]
};
```

To configure some `less-loader` options:

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

[View the less-loader Documentation](https://github.com/webpack-contrib/less-loader)
