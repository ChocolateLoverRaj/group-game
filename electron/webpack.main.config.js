const path = require('path')

module.exports = {
  entry: path.join(__dirname, './main.ts'),
  target: 'electron-main',
  module: {
    rules: [{
      test: /\.(png|svg|jpg|jpeg|gif)$/i,
      type: 'asset/resource'
    }, { test: /\.ts$/, loader: 'ts-loader' }]
  },
  resolve: {
    extensions: ['.ts', '.js']
  }
}
