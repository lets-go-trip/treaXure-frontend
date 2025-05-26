// vue.config.js
const webpack = require("webpack");

module.exports = {
  // Disable ESLint for development
  lintOnSave: false,
  // Optional: Configure webpack Dev Server
  devServer: {
    proxy: {
      "/api": {
        target:
          "http://ec2-54-180-217-227.ap-northeast-2.compute.amazonaws.com:8081/",
        changeOrigin: true,
        secure: false,
        logLevel: "debug",
        bypass: function (req, res, proxyOptions) {
          // OPTIONS 요청(preflight)을 직접 처리
          if (req.method === "OPTIONS") {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader(
              "Access-Control-Allow-Methods",
              "GET, POST, PUT, DELETE, PATCH, OPTIONS"
            );
            res.setHeader(
              "Access-Control-Allow-Headers",
              "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-CSRF-Token"
            );
            res.setHeader("Access-Control-Allow-Credentials", "true");
            res.setHeader("Access-Control-Max-Age", "86400");
            res.statusCode = 200;
            res.end();
            return true; // bypass proxy for this request
          }
        },
        onProxyReq: function (proxyReq, req, res) {
          console.log("Proxying request:", req.method, req.url);
          // 백엔드로 보내는 요청에 CORS 헤더 추가 요청
          proxyReq.setHeader("Origin", "https://trexure.netlify.app/");
        },
        onProxyRes: function (proxyRes, req, res) {
          // 백엔드 응답에 CORS 헤더 추가
          proxyRes.headers["Access-Control-Allow-Origin"] = "*";
          proxyRes.headers["Access-Control-Allow-Credentials"] = "true";
          proxyRes.headers["Access-Control-Allow-Methods"] =
            "GET, POST, PUT, DELETE, PATCH, OPTIONS";
          proxyRes.headers["Access-Control-Allow-Headers"] =
            "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-CSRF-Token";
        },
        onError: function (err, req, res) {
          console.log("Proxy error:", err);
        },
      },
      "/oauth": {
        target:
          "http://ec2-54-180-217-227.ap-northeast-2.compute.amazonaws.com:8081/",
        changeOrigin: true,
        secure: false,
        logLevel: "debug",
        onProxyRes: function (proxyRes, req, res) {
          proxyRes.headers["Access-Control-Allow-Origin"] = "*";
          proxyRes.headers["Access-Control-Allow-Credentials"] = "true";
        },
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
