module.exports = {
  entry: __dirname + "/app/app.js",
  output: {
    path: __dirname + "/dist",
    filename: "bundle.js",
  },
  module: {
    loaders: [
      { test: /\.jsx$/, exclude: /node_modules/, loader: "react-hot-loader!babel-loader" },
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
      { test: /\.scss$/, exclude: /node_modules/, loader: "style!css!sass" },
    ],
  },
  resolve: {
    root: __dirname,
    extensions: [
      "",
      ".js",
      ".jsx",
    ],
  },
};
