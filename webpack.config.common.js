var path = require('path')

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
    filename: 'FunctionalDataGrid-[name].js'
  },
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
        ]
      },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
    ]
  },
  resolve: { modules: [ "node_modules" ] },
  cache: true,
  plugins: [

  ]
}
