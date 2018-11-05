var common = require('./webpack.config.common')
var webpack = require('webpack')

var config = Object.assign({}, common)

config.mode = 'development'
config.devtool = 'cheap-module-source-map'

module.exports = config