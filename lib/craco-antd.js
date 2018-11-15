// We need to mock this in tests,
// Mocking fs functions breaks a lot of things in jest
/* istanbul ignore next */
const readAntdCustomizeJSON = () => {
  const fs = require("fs");
  if (!fs.existsSync("./antd.customize.json")) return false;
  return fs.readFileSync("./antd.customize.json", "utf8");
};

const overrideWebpackConfig = ({ webpackConfig, pluginOptions }) => {
  pluginOptions = pluginOptions || {};
  const CracoLessPlugin = require("craco-less");
  const modifyVars = {};

  // Look for antd.customize.json in the project root
  const antdCustomVarsJSON = module.exports.readAntdCustomizeJSON();
  if (antdCustomVarsJSON) {
    let antdCustomVars;
    try {
      antdCustomVars = JSON.parse(antdCustomVarsJSON);
    } catch (e) {
      throw new Error("Could not parse JSON in antd.customize.json!\n\n" + e);
    }
    Object.assign(modifyVars, antdCustomVars);
  }

  if (pluginOptions.customizeTheme) {
    Object.assign(modifyVars, pluginOptions.customizeTheme);
  }

  const lessLoaderOptions = pluginOptions.lessLoaderOptions || {};
  if (lessLoaderOptions.modifyVars) {
    Object.assign(modifyVars, lessLoaderOptions.modifyVars);
  }

  lessLoaderOptions.modifyVars = modifyVars;
  // javascriptEnabled: true is suggested in the Ant Design docs:
  // https://ant.design/docs/react/customize-theme#Customize-in-webpack
  lessLoaderOptions.javascriptEnabled = true;

  return CracoLessPlugin.overrideWebpackConfig({
    webpackConfig,
    pluginOptions: {
      styleLoaderOptions: pluginOptions.styleLoaderOptions || {},
      cssLoaderOptions: pluginOptions.cssLoaderOptions || {},
      lessLoaderOptions
    }
  });
};

module.exports = {
  readAntdCustomizeJSON,
  overrideWebpackConfig,
  overrideCracoConfig: ({ cracoConfig }) => {
    if (!cracoConfig.babel) cracoConfig.babel = {};
    if (!cracoConfig.babel.plugins) cracoConfig.babel.plugins = [];
    cracoConfig.babel.plugins.push([
      "import",
      { libraryName: "antd", libraryDirectory: "es", style: "css" }
    ]);
    return cracoConfig;
  }
};
