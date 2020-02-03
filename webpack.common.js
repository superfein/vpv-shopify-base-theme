const path = require('path');
const glob = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const chalk = require('chalk');

const { log } = console;

/**
  @desc Define input and output paths
*/
const PATHS = {
  src: path.resolve(__dirname, './src'),
  output: path.resolve(__dirname, './dist'),
};

log(chalk.bgHex('#563ce7').white('[Building bundles...]'));

module.exports = {
  entry: glob.sync(`${PATHS.src}/assets/scripts/pages/*.js`)
    .reduce((x, y) => Object.assign(x, {
      [y.split('/').reverse()[0].split('.')[0]]: y,
    }), {}),
  output: {
    filename: '[name].bundle.js.liquid',
    path: `${PATHS.output}/assets`,
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        theme: {
          name: 'theme', // file name
          chunks: 'all', // automatically bundles all shared code into theme with optimization
          minChunks: 2, // minimum number of chunks that must share a module before splitting.
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          filename: '[name].bundle.js',
          chunks: 'all',
        },
      },
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].scss.liquid',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                useBuiltIns: 'usage',
                corejs: 3,
              }],
            ],
          },
        },
      },
      {
        test: /\.(scss|sass|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'string-replace-loader',
            options: {
              multiple: [
                { search: "'{{", replace: '{{' },
                { search: "}}'", replace: '}}' },
              ],
            },
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          'postcss-loader',
          'sass-loader',
        ],
      },
    ],
  },
};
