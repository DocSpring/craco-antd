const path = require("path");
const CracoAntDesignPlugin = require("./craco-antd");
const {
  mergeWebpackConfig,
} = require("@craco/craco/dist/lib/features/webpack/merge-webpack-config");
const {
  applyCracoConfigPlugins,
  applyWebpackConfigPlugins,
} = require("@craco/craco/dist/lib/features/plugins");

const clone = require("clone");

const { craPaths, loadWebpackDevConfig } = require("@craco/craco/dist/lib/cra");

const context = { env: "development", paths: craPaths };

const mockReadLess = jest.fn();
CracoAntDesignPlugin.readAntdCustomizeLess = mockReadLess;
const mockReadJSON = jest.fn();
CracoAntDesignPlugin.readAntdCustomizeJSON = mockReadJSON;

let webpackConfig;
let originalWebpackConfig;
beforeEach(() => {
  mockReadLess.mockImplementation(() => false);
  mockReadJSON.mockImplementation(() => false);

  if (!originalWebpackConfig) {
    process.env.NODE_ENV = "development";
    originalWebpackConfig = loadWebpackDevConfig({
      reactScriptsVersion: "react-scripts",
    });
    process.env.NODE_ENV = "test";
  }
  webpackConfig = clone(originalWebpackConfig);
});

const applyCracoConfigAndOverrideWebpack = (cracoConfig) => {
  cracoConfig = applyCracoConfigPlugins(cracoConfig, context);
  mergeWebpackConfig(cracoConfig, webpackConfig, context);
};

test("the webpack config is modified correctly with all options and Less vars", () => {
  mockReadLess.mockImplementation(() =>
    [
      "@less-loader-options-priority: #000;",
      "@customize-theme-priority: #000;",
      "@antd-customize-json-priority: #fff;",
    ].join("\n")
  );

  applyCracoConfigAndOverrideWebpack({
    plugins: [
      {
        plugin: CracoAntDesignPlugin,
        options: {
          lessLoaderOptions: {
            lessOptions: {
              modifyVars: {
                "@less-loader-options-priority": "#fff",
              },
            },
          },
          customizeTheme: {
            "@less-loader-options-priority": "#000",
            "@customize-theme-priority": "#fff",
          },
          cssLoaderOptions: {
            modules: true,
            localIdentName: "[local]_[hash:base64:5]",
          },
          postcssLoaderOptions: {
            sourceMaps: true,
          },
          styleLoaderOptions: {
            sourceMaps: true,
          },
          miniCssExtractPluginOptions: {
            testOption: "test-value",
          },
          modifyLessRule: (rule, context) => {
            if (context.env === "production") {
              rule.use[0].options.testOption = "test-value-production";
            } else {
              rule.use[0].options.testOption = "test-value-development";
            }
            return rule;
          },
          babelPluginImportOptions: {
            libraryDirectory: "es",
          },
        },
      },
    ],
  });

  expect(mockReadLess.mock.calls.length).toBe(1);
  expect(mockReadLess.mock.calls[0][0]).toBe(`.${path.sep}antd.customize.less`);
  expect(mockReadJSON.mock.calls.length).toBe(0);

  const oneOfRules = webpackConfig.module.rules.find((r) => r.oneOf);
  expect(oneOfRules).not.toBeUndefined();

  const jsRule = oneOfRules.oneOf.find(
    (r) => r.test && r.test.toString() === "/\\.(js|mjs|jsx|ts|tsx)$/"
  );
  expect(jsRule).not.toBeUndefined();
  expect(jsRule.options.plugins[1]).toEqual([
    "import",
    { libraryName: "antd", libraryDirectory: "es", style: true },
  ]);

  const lessRule = oneOfRules.oneOf.find(
    (r) => r.test && r.test.toString() === "/\\.less$/"
  );
  expect(lessRule).not.toBeUndefined();
  expect(lessRule.use[0].loader).toContain(`${path.sep}style-loader`);
  expect(lessRule.use[0].options).toEqual({
    sourceMaps: true,
    testOption: "test-value-development",
  });
  expect(lessRule.use[1].loader).toContain(`${path.sep}css-loader`);
  expect(lessRule.use[1].options).toEqual({
    importLoaders: 3,
    modules: true,
    localIdentName: "[local]_[hash:base64:5]",
    sourceMap: true,
  });

  expect(lessRule.use[2].loader).toContain(`${path.sep}postcss-loader`);
  expect(lessRule.use[2].options.postcssOptions.ident).toEqual("postcss");
  expect(lessRule.use[2].options.postcssOptions.sourceMaps).toEqual(true);
  expect(lessRule.use[2].options.postcssOptions.plugins).not.toBeUndefined();

  expect(lessRule.use[3].loader).toContain(`${path.sep}resolve-url-loader`);
  // This is no longer the case
  // expect(lessRule.use[3].options).toEqual({
  //   sourceMap: false,
  // });

  expect(lessRule.use[4].loader).toContain(`${path.sep}less-loader`);
  expect(lessRule.use[4].options).toEqual({
    lessOptions: {
      javascriptEnabled: true,
      modifyVars: {
        "@antd-customize-json-priority": "#fff",
        "@customize-theme-priority": "#fff",
        "@less-loader-options-priority": "#fff",
      },
    },
    sourceMap: true,
  });
});

test("the webpack config is modified correctly when loading vars from JSON file", () => {
  mockReadJSON.mockImplementation(() =>
    JSON.stringify({
      "@less-loader-options-priority": "#000",
      "@customize-theme-priority": "#000",
      "@antd-customize-json-priority": "#fff",
    })
  );

  applyCracoConfigAndOverrideWebpack({
    plugins: [
      {
        plugin: CracoAntDesignPlugin,
        options: {
          lessLoaderOptions: {
            lessOptions: {
              modifyVars: {
                "@less-loader-options-priority": "#fff",
              },
            },
          },
          customizeTheme: {
            "@less-loader-options-priority": "#000",
            "@customize-theme-priority": "#fff",
          },
          cssLoaderOptions: {
            modules: true,
            localIdentName: "[local]_[hash:base64:5]",
          },
          styleLoaderOptions: {
            sourceMaps: true,
          },
        },
      },
    ],
  });

  expect(mockReadLess.mock.calls.length).toBe(1);
  expect(mockReadLess.mock.calls[0][0]).toBe(`.${path.sep}antd.customize.less`);
  expect(mockReadJSON.mock.calls.length).toBe(1);
  expect(mockReadJSON.mock.calls[0][0]).toBe(`.${path.sep}antd.customize.json`);

  const oneOfRules = webpackConfig.module.rules.find((r) => r.oneOf);
  expect(oneOfRules).not.toBeUndefined();

  const jsRule = oneOfRules.oneOf.find(
    (r) => r.test && r.test.toString() === "/\\.(js|mjs|jsx|ts|tsx)$/"
  );
  expect(jsRule).not.toBeUndefined();
  expect(jsRule.options.plugins[1]).toEqual([
    "import",
    { libraryName: "antd", libraryDirectory: "lib", style: true },
  ]);

  const lessRule = oneOfRules.oneOf.find(
    (r) => r.test && r.test.toString() === "/\\.less$/"
  );
  expect(lessRule).not.toBeUndefined();
  expect(lessRule.use[0].loader).toContain(`${path.sep}style-loader`);
  expect(lessRule.use[0].options).toEqual({
    sourceMaps: true,
  });
  expect(lessRule.use[1].loader).toContain(`${path.sep}css-loader`);
  expect(lessRule.use[1].options).toEqual({
    importLoaders: 3,
    modules: true,
    localIdentName: "[local]_[hash:base64:5]",
    sourceMap: true,
  });

  expect(lessRule.use[2].loader).toContain(`${path.sep}postcss-loader`);
  expect(lessRule.use[2].options.postcssOptions.ident).toEqual("postcss");
  expect(lessRule.use[2].options.postcssOptions.plugins).not.toBeUndefined();

  expect(lessRule.use[3].loader).toContain(`${path.sep}resolve-url-loader`);
  // Not the case anymore
  // expect(lessRule.use[3].options).toEqual({
  //   sourceMap: false,
  // });

  expect(lessRule.use[4].loader).toContain(`${path.sep}less-loader`);
  expect(lessRule.use[4].options).toEqual({
    lessOptions: {
      javascriptEnabled: true,
      modifyVars: {
        "@antd-customize-json-priority": "#fff",
        "@customize-theme-priority": "#fff",
        "@less-loader-options-priority": "#fff",
      },
    },
    sourceMap: true,
  });
});

test("custom Less variables path", () => {
  mockReadLess.mockImplementation(() =>
    ["@less-loader-options-priority: #000;"].join("\n")
  );
  applyCracoConfigAndOverrideWebpack({
    plugins: [
      {
        plugin: CracoAntDesignPlugin,
        options: {
          customizeThemeLessPath: "./src/styles/antd.custom.less",
        },
      },
    ],
  });

  expect(mockReadLess.mock.calls.length).toBe(1);
  expect(mockReadLess.mock.calls[0][0]).toBe("./src/styles/antd.custom.less");
  expect(mockReadJSON.mock.calls.length).toBe(0);
});

test("custom JSON variables path", () => {
  mockReadJSON.mockImplementation(() =>
    JSON.stringify({
      "@less-loader-options-priority": "#000",
    })
  );
  applyCracoConfigAndOverrideWebpack({
    plugins: [
      {
        plugin: CracoAntDesignPlugin,
        options: {
          customVarsJSONPath: "./src/styles/antd.custom.json",
        },
      },
    ],
  });

  expect(mockReadJSON.mock.calls.length).toBe(1);
  expect(mockReadJSON.mock.calls[0][0]).toBe("./src/styles/antd.custom.json");
});

const runExpectationsForMinimalConfiguration = () => {
  const oneOfRules = webpackConfig.module.rules.find((r) => r.oneOf);
  expect(oneOfRules).not.toBeUndefined();
  const jsRule = oneOfRules.oneOf.find(
    (r) => r.test && r.test.toString() === "/\\.(js|mjs|jsx|ts|tsx)$/"
  );
  expect(jsRule).not.toBeUndefined();
  expect(jsRule.options.plugins[1]).toEqual([
    "import",
    { libraryName: "antd", libraryDirectory: "lib", style: true },
  ]);

  const lessRule = oneOfRules.oneOf.find(
    (r) => r.test && r.test.toString() === "/\\.less$/"
  );
  expect(lessRule).not.toBeUndefined();

  expect(lessRule.use[2].loader).toContain(`${path.sep}postcss-loader`);
  expect(lessRule.use[2].options.postcssOptions.ident).toEqual("postcss");
  expect(lessRule.use[2].options.postcssOptions.plugins).not.toBeUndefined();

  expect(lessRule.use[3].loader).toContain(`${path.sep}resolve-url-loader`);
  // This is no longer the case
  // expect(lessRule.use[3].options).toEqual({
  //   sourceMap: false,
  // });

  expect(lessRule.use[4].loader).toContain(`${path.sep}less-loader`);
  expect(lessRule.use[4].options).toEqual({
    lessOptions: {
      javascriptEnabled: true,
      modifyVars: {},
    },
    sourceMap: true,
  });
};

test("using the plugin without any options, and no antd.customize.json", () => {
  applyCracoConfigAndOverrideWebpack({
    plugins: [{ plugin: CracoAntDesignPlugin }],
  });
  runExpectationsForMinimalConfiguration();
});

test("using the plugin without any options, and existing babel.plugins in craco config", () => {
  applyCracoConfigAndOverrideWebpack({
    babel: { plugins: [] },
    plugins: [{ plugin: CracoAntDesignPlugin }],
  });
  runExpectationsForMinimalConfiguration();
});

test("invalid JSON in antd.customize.json", () => {
  mockReadJSON.mockImplementation(() => "{ this json is bad json }");

  const runTest = () => {
    applyCracoConfigAndOverrideWebpack({
      plugins: [{ plugin: CracoAntDesignPlugin }],
    });
  };

  expect(runTest).toThrowError(
    "Could not parse JSON in antd.customize.json!\n\n" +
      "SyntaxError: Unexpected token t in JSON at position 2"
  );
});
