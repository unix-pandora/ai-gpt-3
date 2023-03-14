// const webpack = require("webpack");
const path = require("path");
const webpackMerge = require("webpack-merge");
const baseConfig = require("./webpack.base");
const variable = require("./webpackUtils/variable");

const { DIST_PATH, SRC_PATH, PUBLIC_PATH, ROOT_PATH } = variable;

const config = {
  mode: "development",
  cache: { type: "memory" },
  devtool: "eval-cheap-module-source-map",
  stats: "errors-only",
  watchOptions: {
    aggregateTimeout: 500,
    poll: 1000,
    ignored: /node_modules/,
  },
  devServer: {
    compress: true, //是否启用gzip压缩
    host: "localhost",
    port: 8083,
    hot: true,
    // static: path.resolve(__dirname, DIST_PATH),
    static: {
      directory: path.join(__dirname, PUBLIC_PATH),
    },
  },
  resolve: {
    fallback: {
      http: require.resolve("stream-http"),
      path: require.resolve("path-browserify"),
      url: require.resolve("url/"),
      util: require.resolve("util/"),
      stream: require.resolve("stream-browserify/"),
      os: require.resolve("os-browserify/browser"),
      https: require.resolve("https-browserify"),
      buffer: require.resolve("buffer/"),
      tty: require.resolve("tty-browserify"),
      fs: false,
    },
  },
};
const mergedConfig = webpackMerge.merge(baseConfig, config);

mergedConfig.plugins = mergedConfig.plugins.filter(Boolean);

module.exports = mergedConfig;
