module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
    resolve: {
      fallback: {
        "child_process": false // Tell Webpack to ignore child_process
      }
    }
  },
};
