
import chalk from 'chalk';

const { log } = console;

const path = require('path');
const themeKit = require('@shopify/themekit');
const webpack = require('webpack');
const config = require('../webpack.dev');

const compiler = webpack(config);

const PATHS = {
  output: path.resolve(__dirname, '../dist'),
};

compiler.watch({
  aggregateTimeout: 1000,
}, (err, stats) => {
  if (err) {
    return err;
  }
  console.log(stats.toString({
    chunks: false,
    colors: true,
  }));
  log(chalk.bgHex('#563ce7').white('[Finished building bundles. Uploading...]'));
  return stats;
});

themeKit
  .command('open', {
    env: 'production',
  })
  .catch((err) => {
    console.error('Error', err);
  });

themeKit
  .command('watch', {
    env: 'production',
    dir: PATHS.output,
  })
  .catch((err) => {
    console.error('Error', err);
  });
