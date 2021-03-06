module.exports = {
  target: 'electron-renderer',
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
    extensions: ['.tsx', '.js', '.ts']
  }
}
