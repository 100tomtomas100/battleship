const path = require("path");
const common = require("./webpack.common.js");
const { merge } = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");


module.exports = merge(common, {
    mode: "production",
    output: {
      filename: "./js/[name].[hash].bundle.js",
      path: path.resolve(__dirname, "dist"),
      clean: true,
      library: 'myApp'
    },    
    plugins: [
        new MiniCssExtractPlugin({
            // filename: 'css/[hash]'
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader, 
                    "css-loader"
                ]
            }
        ]
    },
    optimization: {
        minimizer: [
            new CssMinimizerPlugin(),
            new TerserPlugin(),
            new HtmlWebpackPlugin({
                template: "src/index.html",
                filename: "./index.html",
                minify: {
                removeAttributeQuotes: true,
                collapseWhitespace: true,
                removeComments: true
                }
            })
        ]
    }
    
})