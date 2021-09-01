/* eslint-disable */
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
  productionSourceMap: false,
  // css: {
  //   loaderOptions: {
  //     scss: {
  //       prependData: `@import "~@/assets/styles/global.scss";`,
  //     },
  //   },
  // },
  chainWebpack: config => {
    config.plugin("compressionPlugin").use(
      new CompressionPlugin({
        test: /\.js$|\.css/i,
        // threshold: 10240,
        // deleteOriginalAssets: true
      })
    );
  },
};
