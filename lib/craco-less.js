const gitHubIssueUrl = (repo, query) =>
  `https://github.com/${repo}/issues${query ? `?q=is%3Aissue+${query}` : ""}`;

const throwInvalidConfigError = ({ message, gitHubIssueQuery: query }) => {
  throw new Error(
    `${message}\n\n` +
      "Did you update react-scripts or craco recently? \n" +
      "Please try updating craco-less to the latest version: \n\n" +
      `$ yarn upgrade craco-less\n\n` +
      "If that doesn't work, we might need to update craco-less to fix the issue." +
      "Please check to see if there's alraedy an issue in the craco-less repo:\n\n" +
      `* ${gitHubIssueUrl("ndbroadbent/craco-less", query)}\n\n` +
      "If not, please open an issue and I'll take a look.\n\n" +
      "You might also want to look for related issues in the " +
      "craco or create-react-app repos: \n\n" +
      `* ${gitHubIssueUrl("sharegate/craco", query)}\n` +
      `* ${gitHubIssueUrl("facebook/create-react-app", query)}\n`
  );
};

module.exports = {
  overrideWebpackConfig: ({ webpackConfig, pluginOptions }) => {
    const lessExtension = /\.less$/;

    const { getLoader, loaderByName } = require("@craco/craco");
    const { isFound, match: fileLoaderMatch } = getLoader(
      webpackConfig,
      loaderByName("file-loasder")
    );
    if (!isFound) {
      throwInvalidConfigError({
        message: "Can't find file-loader in the webpack config!",
        gitHubIssueQuery: "webpack+file-loader"
      });
    }
    fileLoaderMatch.loader.exclude.push(lessExtension);

    const lessRule = {
      test: lessExtension,
      use: [
        {
          loader: require.resolve("style-loader")
        },
        {
          loader: require.resolve("css-loader")
        },
        {
          loader: require.resolve("less-loader"),
          options: pluginOptions || {}
        }
      ]
    };

    const oneOfRule = webpackConfig.module.rules.find(
      rule => typeof rule.oneOf !== "undefined"
    );
    if (!oneOfRule) {
      throwInvalidConfigError({
        message:
          "Can't find a 'oneOf' rule under module.rules in the webpack config!",
        gitHubIssueQuery: "webpack+rules+oneOf"
      });
    }
    oneOfRule.oneOf.push(lessRule);

    return webpackConfig;
  }
};
