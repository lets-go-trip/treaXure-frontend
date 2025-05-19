// vue.config.js
const webpack = require("webpack");

module.exports = {
  // Disable ESLint for development
  lintOnSave: false,
  // Optional: Configure webpack Dev Server
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:8081",
        changeOrigin: true,
      },
      "/oauth": {
        target: "http://localhost:8081",
        changeOrigin: true,
      },
    },
  },

  // Define Vue feature flags
  configureWebpack: {
    plugins: [
      // Plugin to define global constants
      new webpack.DefinePlugin({
        __VUE_OPTIONS_API__: JSON.stringify(true),
        __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),
      }),
    ],
  },
};
