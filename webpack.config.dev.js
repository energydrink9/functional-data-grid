var path = require('path');
var url = require('url');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var yargs = require('yargs');
var FlowStatusWebpackPlugin = require('flow-status-webpack-plugin');

const distDir = "static";

module.exports = {
  entry: {
    app: './src/FunctionalDataGrid.js'
  },
  output: {
    publicPath: '/app',
    path: path.join(__dirname, distDir, 'app'),
    filename: 'bundle.js',
    pathinfo: true // Add /* filename */ comments to generated require()s in the output.
  },
  devtool: 'eval',
  devServer: {
    hot: true,
    port: 8090,
    host: '0.0.0.0',
    historyApiFallback: {
      index: '/app/index.html'
    },
    disableHostCheck: true
  },
  module: {
    preLoaders: [
      {
        test: /\.jsx?$/,
        loader: 'eslint',
        exclude: [
          /node_modules/
        ]
      }
    ],
    loaders: [
      {
		    test: /\.jsx?$/,
        loader: 'babel',
        exclude: [
          /node_modules/
        ],
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
  cache: true,
  plugins: [
    new webpack.NoErrorsPlugin(),
    new FlowStatusWebpackPlugin({
        failOnError: true
    }),
    new webpack.HotModuleReplacementPlugin()
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
          'not ie < 11'
        ]
      })
    ];
  }
};
