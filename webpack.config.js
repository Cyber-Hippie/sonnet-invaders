const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      inject: 'body'
    }),
    new CopyPlugin({
      patterns: [
        { 
          from: "src/assets", 
          to: "assets",
          noErrorOnMissing: true
        }
      ],
    }),
  ],
  devtool: 'source-map',
}; 