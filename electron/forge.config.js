module.exports = {
  packagerConfig: {
    icon: './icon'
  },
  makers: [{
    name: '@electron-forge/maker-zip'
  }],
  plugins: [['@electron-forge/plugin-webpack', {
    mainConfig: './webpack.main.config.js',
    renderer: {
      config: './webpack.renderer.config.js',
      entryPoints: [{
        name: 'main_window',
        html: './index.html',
        js: './index.tsx'
      }]
    }
  }]]
}
