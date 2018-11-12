module.exports = {
  overrideWebpackConfig: ({ webpackConfig, pluginOptions }) => {
    const CracoLessPlugin = require("craco-less");
    pluginOptions = pluginOptions || {};
    const lessLoaderOptions = pluginOptions.lessLoaderOptions || {};
    // Just a nicer name for modifyVars
    lessLoaderOptions.modifyVars = pluginOptions.customizeTheme;
    // javascriptEnabled: true is suggested in the Ant Design docs:
    // https://ant.design/docs/react/customize-theme#Customize-in-webpack
    lessLoaderOptions.javascriptEnabled = true;

    const newWebpackConfig = CracoLessPlugin.overrideWebpackConfig({
      webpackConfig,
      lessLoaderOptions
    });

    const { getLoader, loaderByName } = require("@craco/craco");
    const { match: babelLoaderMatch } = getLoader(
      webpackConfig,
      loaderByName("babel-loader")
    );
    babelLoaderMatch.loader.options.plugins.unshift([
      "import",
      { libraryName: "antd", libraryDirectory: "es", style: "css" }
    ]);

    return newWebpackConfig;
  }
};
