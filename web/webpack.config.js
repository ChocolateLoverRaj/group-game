const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const { DefinePlugin } = require('webpack')

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: path.join(__dirname, './index.tsx'),
  output: {
    path: path.join(__dirname, './dist')
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
    }, {
      test: /\.lazy\.css$/i,
      use: [{
        loader: 'style-loader',
        options: {
          injectType: 'lazyStyleTag'
        }
      }, 'css-loader']
    }]
  },
  resolve: {
    extensions: ['.tsx', '.js', '.ts'],
    fallback: {
      assert: require.resolve('assert-browserify')
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, './index.html')
    }),
    new MiniCssExtractPlugin(),
    new FaviconsWebpackPlugin(path.join(__dirname, '../common/dot.png')),
    new DefinePlugin({
      'process.env.NODE_DEBUG': JSON.stringify(process.env.NODE_DEBUG)
    })
  ]
}
