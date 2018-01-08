const path = require('path');
const url = require('url');
const autoprefixer = require('autoprefixer');
const postCssFlexbugsFixes = require('postcss-flexbugs-fixes')
const webpack = require('webpack');
const FlowStatusWebpackPlugin = require('flow-status-webpack-plugin');

const distDir = "static";

module.exports = {
  bail: true,
  entry: {
    app: './src/FunctionalDataGrid.js'
  },
  output: {
    publicPath: '/app',
    path: path.join(__dirname, distDir, 'app'),
    filename: '[name].[chunkhash:8].js',
    chunkFilename: '[name].[chunkhash:8].chunk.js'
  },
  module: {
    preLoaders: [
      {
        test: /\.jsx?$/,
        loaders: ['eslint'],
        exclude: /node_modules/
      }
    ],
    loaders: [
      {
		    test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['babel-preset-es2015', 'babel-preset-react'].map(require.resolve),
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
      { test: /\.css$/,                     loader: 'style!css!postcss' },
      { test: /\.scss$/,                    loader: 'style!css!postcss!sass' },
      { test: /\.ttf(\?(\w|\.|=)*)?$/,      loader: "url-loader?limit=10000&mimetype=application/octet-stream&name=./[hash].[ext]" },
      { test: /\.eot(\?(\w|\.|=)*)?$/,      loader: "file" },
      { test: /\.otf(\?(\w|\.|=)*)?$/,      loader: "file" },
      { test: /\.svg(\?(\w|\.|=)*)?$/,      loader: "url-loader?limit=10000&mimetype=image/svg+xml&name=./[hash].[ext]" },
      { test: /\.woff(2)?(\?(\w|\.|=)*)?$/, loader: "url-loader?limit=10000&minetype=application/font-woff&name=./[hash].[ext]" },
      { test: /\.json$/,                    loader: 'json' }
    ]
  },
  resolveLoader: { fallback: path.join(__dirname, "node_modules") },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new FlowStatusWebpackPlugin({
        failOnError: true
    })
  ],
  eslint: {
    failOnWarning: false,
    failOnError: true
  },
  postcss: function() {
    return [
      postCssFlexbugsFixes,
      autoprefixer({
        browsers: [
          '>1%',
          'last 4 versions',
          'Firefox ESR',
          'not ie < 9'
        ]
      })
    ];
  }
};
