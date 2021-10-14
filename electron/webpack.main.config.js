const path = require('path')

module.exports = {
  entry: path.join(__dirname, './main.js'),
  target: 'electron-main',
  module: {
    rules: [{
      test: /\.(png|svg|jpg|jpeg|gif)$/i,
      type: 'asset/resource'
    }]
  },
  resolve: {
    extensions: ['.tsx', '.js']
  }
}
