
import chalk from 'chalk';

const { log } = console;

const path = require('path');
const themeKit = require('@shopify/themekit');

const PATHS = {
  src: path.resolve(__dirname, '../src'),
};

log(chalk.bgHex('#563ce7').white('[Download Started]'));

themeKit
  .command('download', {
    env: 'production',
    dir: `${PATHS.src}`,
  })
  .catch((err) => {
    console.error('Error', err);
  });
