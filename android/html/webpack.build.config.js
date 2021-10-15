const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: path.join(__dirname, './index.tsx'),
  output: {
    path: path.join(__dirname, '../app/app/src/main/assets')
  },
  target: 'web',
  module: {
    rules: [{
      test: /\.(t|j)sx?$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-typescript',
            '@babel/preset-react'
          ],
          plugins: [
            'react-require'
          ]
        }
      }
    }, {
      test: /\.(png|svg|jpg|jpeg|gif)$/i,
      type: 'asset/resource'
    }]
  },
  resolve: {
    extensions: ['.tsx', '.js']
  },
  plugins: [new HtmlWebpackPlugin({
    template: path.join(__dirname, './index.html')
  })]
}
