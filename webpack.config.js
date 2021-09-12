require('dotenv').config();
const path = require('path');
const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

const mode = process.env.NODE_ENV || 'production';

const webpackRules = [
  {
    test: /\.(sa|sc|c)ss$/,
    exclude: [/old/],
    use: [
      MiniCssExtractPlugin.loader,
      {
        loader: 'css-loader',
        options: {
          importLoaders: true,
          sourceMap: true,
        },
      },
      {
        loader: 'postcss-loader',
      },
      {
        loader: 'sass-loader',
        options: {
          sourceMap: true,
        },
      },
    ],
  },
  {
    test: /\.(js|jsx)$/,
    exclude: [/node_modules/, /lambda/, /service-worker.js/],
    use: [{
      loader: 'babel-loader',
    }],
  },
  {
    test: /\.(png|jpg|gif|svg)$/i,
    type: 'asset',
    // use: [
    //   {
    //     loader: 'url-loader',
    //     options: {
    //       esModule: false,
    //       name: './images/[name][ext]',
    //       publicPath: '/',
    //     },
    //   },
    // ],
  },
];

const webpackPlugins = [
  new webpack.DefinePlugin({
    'process.env.BUGSNAG_CLIENT_API_KEY': JSON.stringify(process.env.BUGSNAG_CLIENT_API_KEY),
    'process.env.OPENWEATHERMAP_API_KEY': JSON.stringify(process.env.OPENWEATHERMAP_API_KEY),
  }),
  new MiniCssExtractPlugin({
    filename: './css/styles.css',
  }),
  new CopyWebpackPlugin({
    patterns: [
      {
        from: './public/images/**/*',
        to: './images/[name][ext]',
        force: true,
      },
    ],
  }),
  new CopyWebpackPlugin({
    patterns: [
      {
        from: `./public/skydark.webmanifest`,
        to: './[name][ext]',
        force: true,
      },
    ],
  }),
  new HtmlWebpackPlugin({
    template: './public/index.html',
    filename: './index.html',
    inject: false,
  }),
  new WorkboxPlugin.GenerateSW({
    cleanupOutdatedCaches: true,
    clientsClaim: true,
    skipWaiting: true,
  }),
  new CompressionPlugin({
    exclude: [/.map$/, /.txt$/],
  }),
];

module.exports = {
  entry: ['./src/index.js'],
  devtool: 'source-map',
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
  output: {
    filename: './js/[name].js',
    chunkFilename: './js/[id].[chunkhash].js',
    path: path.resolve(__dirname, 'build'),
  },
  mode,
  module: {
    rules: webpackRules,
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
      }),
      new CssMinimizerPlugin(),
    ],
  },
  plugins: webpackPlugins,
};
