const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: {
    main: "./src/pages/index.js", // ✅ updated entry path
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
    publicPath: "", // ✅ leave empty string
  },

  mode: "development",
  devtool: "inline-source-map",
  stats: "errors-only",
  devServer: {
    static: path.resolve(__dirname, "./dist"),
    compress: true,
    port: 8080,
    open: true,
    liveReload: true,
    hot: false,
  },
  target: ["web", "es5"],

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/, // ✅ fix: remove quotes
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: { importLoaders: 1 }, // ✅ needed for PostCSS
          },
          "postcss-loader", // ✅ minification + autoprefixing
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|woff2?|eot|ttf|otf)$/,
        type: "asset/resource",
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html", // ✅ correct HTML template
      favicon: "./src/images/favicon.ico", // ✅ favicon path
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),
  ],
};
