const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const WebpackBar = require("webpackbar");
const CracoAntDesignPlugin = require("../lib/craco-antd");
const path = require("path");

// Don't open the browser during development
process.env.BROWSER = "none";

module.exports = {
  webpack: {
    plugins: [
      new WebpackBar({ profile: true }),
      ...(process.env.NODE_ENV === "development"
        ? [new BundleAnalyzerPlugin({ openAnalyzer: false })]
        : []),
    ],
  },
  plugins: [
    {
      plugin: CracoAntDesignPlugin,
      options: {
        customizeTheme: {
          "@primary-color": "#8813bf",
          "@layout-header-background": "#13bf77",
        },
        // customizeThemeLessPath: path.join(
        //   __dirname,
        //   "src/style/customTheme.less"
        // )
      },
    },
  ],
};
