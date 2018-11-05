var common = require('./webpack.config.common')
var webpack = require('webpack')

var config = Object.assign({}, common)

config.mode = 'production'
config.devtool = 'cheap-module-source-map'
config.optimization = {
  splitChunks: {
    cacheGroups: {
      commons: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        chunks: 'all'
      }
    }
  }
}
config.plugins = config.plugins.push([
  new webpack.optimize.AggressiveMergingPlugin()
])

module.exports = config