const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");


module.exports = {
  entry: {
    script: './src/script.js',
  },
  module: {
    rules: [
     {
       test: /\.(png|svg|jpg|jpeg|gif)$/i,
       dependency: { not: ['url'] },       
       type: 'asset/resource',
       generator: {
        filename: 'images/[hash][ext][query]'
        }            
     },
     {
      test: /\.ttf/,
      type: 'asset/resource',
      generator: {
        filename: 'fonts/[name][ext][query]'
      }
    }
    ]
  }
};