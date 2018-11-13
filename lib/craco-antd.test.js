const CracoAntDesignPlugin = require("./craco-antd");
const { overrideWebpack } = require("@craco/craco/lib/features/webpack");
const {
  applyCracoConfigPlugins
} = require("@craco/craco/lib/features/plugins");

const clone = require("clone");

const {
  craPaths,
  loadWebpackDevConfig,
  overrideWebpackDevConfig
} = require("@craco/craco/lib/cra");

const context = { env: "development", paths: craPaths };

let webpackConfig;
beforeEach(() => {
  // loadWebpackDevConfig seems to cache the config, so we need to
  // deep clone the object before each test.
  webpackConfig = clone(loadWebpackDevConfig());
});

test("the webpack config is modified correctly", () => {
  CracoAntDesignPlugin.readAntdCustomizeJSON = jest.fn();
  CracoAntDesignPlugin.readAntdCustomizeJSON.mockReturnValue(
    JSON.stringify({
      "@less-loader-options-priority": "#000",
      "@customize-theme-priority": "#000",
      "@antd-customize-json-priority": "#fff"
    })
  );

  let cracoConfig = {
    plugins: [
      {
        plugin: CracoAntDesignPlugin,
        options: {
          lessLoaderOptions: {
            modifyVars: {
              "@less-loader-options-priority": "#fff"
            }
          },
          customizeTheme: {
            "@less-loader-options-priority": "#000",
            "@customize-theme-priority": "#fff"
          }
        }
      }
    ]
  };
  cracoConfig = applyCracoConfigPlugins(cracoConfig, context);
  overrideWebpack(cracoConfig, webpackConfig, () => {}, context);

  const oneOfRules = webpackConfig.module.rules[2].oneOf;
  jsRule = oneOfRules[1];
  expect(jsRule.options.plugins[0]).toEqual([
    "import",
    { libraryName: "antd", libraryDirectory: "es", style: "css" }
  ]);

  lessRule = oneOfRules[8];
  expect(lessRule.test.toString()).toEqual("/\\.less$/");
  expect(lessRule.use[2].loader).toContain("less-loader");
  expect(lessRule.use[2].options).toEqual({
    javascriptEnabled: true,
    modifyVars: {
      "@less-loader-options-priority": "#fff",
      "@customize-theme-priority": "#fff",
      "@antd-customize-json-priority": "#fff"
    }
  });
});
