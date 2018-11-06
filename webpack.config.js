var common = require('./webpack.config.common')
var webpack = require('webpack')

var config = Object.assign({}, common)

config.mode = 'production'
config.devtool = 'cheap-module-source-map'

config.plugins = config.plugins.push([
  new webpack.optimize.AggressiveMergingPlugin()
])
config.optimization = {
  splitChunks: {
    chunks: 'all'
  }
}

module.exports = config