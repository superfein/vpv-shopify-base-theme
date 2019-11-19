
import chalk from 'chalk';
import { ensureDir } from 'fs-extra';

const { log } = console;

const path = require('path');
const themeKit = require('@shopify/themekit');
const webpack = require('webpack');
const config = require('../webpack.dev');

const compiler = webpack(config);

const PATHS = {
  output: path.resolve(__dirname, '../dist'),
};

// If no dist folder is found create one
ensureDir(PATHS.output);

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
    env: 'theme',
  })
  .catch((err) => {
    console.error('Error', err);
  });

themeKit
  .command('watch', {
    env: 'theme',
    dir: PATHS.output,
  })
  .catch((err) => {
    console.error('Error', err);
  });
