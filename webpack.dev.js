const path = require("path");
const common = require("./webpack.common.js");
const { merge } = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = merge(common, {
    mode: "development",
    output: {
      filename: "[name].bundle.js",
      path: path.resolve(__dirname, "dist")
    },
    devServer: {
        static: {
          directory: path.resolve(__dirname, 'dist'),
        },
        port: 9000,
        open: true,
        hot: true,
        compress: true,
        historyApiFallback: true,
    },
    module: {
        rules: [
          {
            test: /\.html$/i,
            loader: "html-loader",
          },
          {
            test: /\.css$/i,
            use: ['style-loader', 'css-loader'],
          }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: "src/index.html"
            }
        )   

      ]
})