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

const originalWebpackConfig = loadWebpackDevConfig();
let webpackConfig;
beforeEach(() => {
  // loadWebpackDevConfig() caches the config internally, so we need to
  // deep clone the object before each test.
  webpackConfig = clone(originalWebpackConfig);
});

const applyCracoConfigAndOverrideWebpack = cracoConfig => {
  cracoConfig = applyCracoConfigPlugins(cracoConfig, context);
  overrideWebpack(cracoConfig, webpackConfig, () => {}, context);
};

test("the webpack config is modified correctly", () => {
  CracoAntDesignPlugin.readAntdCustomizeJSON = jest.fn();
  CracoAntDesignPlugin.readAntdCustomizeJSON.mockReturnValue(
    JSON.stringify({
      "@less-loader-options-priority": "#000",
      "@customize-theme-priority": "#000",
      "@antd-customize-json-priority": "#fff"
    })
  );

  applyCracoConfigAndOverrideWebpack({
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
  });

  const oneOfRules = webpackConfig.module.rules.find(r => r.oneOf);
  expect(oneOfRules).not.toBeUndefined();

  const jsRule = oneOfRules.oneOf.find(
    r => r.test && r.test.toString() === "/\\.(js|mjs|jsx|ts|tsx)$/"
  );
  expect(jsRule).not.toBeUndefined();
  expect(jsRule.options.plugins[0]).toEqual([
    "import",
    { libraryName: "antd", libraryDirectory: "es", style: "css" }
  ]);

  const lessRule = oneOfRules.oneOf.find(
    r => r.test && r.test.toString() === "/\\.less$/"
  );
  expect(lessRule).not.toBeUndefined();
  expect(lessRule.use[2].loader).toContain("/less-loader");
  expect(lessRule.use[2].options).toEqual({
    javascriptEnabled: true,
    modifyVars: {
      "@less-loader-options-priority": "#fff",
      "@customize-theme-priority": "#fff",
      "@antd-customize-json-priority": "#fff"
    }
  });
});
