var path = require('path')
var url = require('url')
var webpack = require('webpack')

const distDir = "dist";

module.exports = {
  entry: {
    app: './src/index.js'
  },
  context: __dirname,
  output: {
    library: 'FunctionalDataGrid',
    libraryTarget: 'umd',
    path: path.join(__dirname, distDir),
    filename: 'FunctionalDataGrid.js'
  },
  devtool: 'cheap-module-source-map',
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.jsx?$/,
        loader: 'eslint-loader',
        exclude: [
          /node_modules/
        ]
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: [
          /node_modules/
        ],
        query: {
          presets: ['babel-preset-env', 'babel-preset-react'].map(require.resolve),
          plugins: [
            'babel-plugin-transform-runtime',
            'babel-plugin-transform-regenerator',
            'babel-plugin-transform-async-to-generator',
            'babel-plugin-transform-class-properties',
            'babel-plugin-transform-flow-comments',
            'babel-plugin-syntax-flow',
            'babel-plugin-transform-object-rest-spread'
          ].map(require.resolve)
        }
      },
      { test: /\.html$/,                    loader: 'file!extract!html' },
      { test: /\.png$/,                     loader: "url-loader?mimetype=image/png&limit=100000" },
      { test: /\.jpg$/,                     loader: "file" },
      { test: /\.gif$/,                     loader: "file" },
      { test: /\.css$/,                     loader: 'style-loader!css-loader!postcss-loader' },
      { test: /\.ttf(\?(\w|\.|=)*)?$/,      loader: "url-loader?limit=10000&mimetype=application/octet-stream&name=./[hash].[ext]" },
      { test: /\.eot(\?(\w|\.|=)*)?$/,      loader: "file" },
      { test: /\.otf(\?(\w|\.|=)*)?$/,      loader: "file" },
      { test: /\.svg(\?(\w|\.|=)*)?$/,      loader: "url-loader?limit=10000&mimetype=image/svg+xml&name=./[hash].[ext]" },
      { test: /\.woff(2)?(\?(\w|\.|=)*)?$/, loader: "url-loader?limit=10000&minetype=application/font-woff&name=./[hash].[ext]" },
      { test: /\.json$/,                    loader: 'json' }
    ]
  },
  resolve: { modules: [ "node_modules" ] },
  cache: true,
  plugins: [
    new webpack.NoEmitOnErrorsPlugin()
  ]
}
