
import './Build';
import chalk from 'chalk';

const { log } = console;

const path = require('path');
const themeKit = require('@shopify/themekit');

const PATHS = {
  output: path.resolve(__dirname, '../dist'),
};

log(chalk.bgHex('#563ce7').white('[Starting deployment process...]'));
log(chalk.bgHex('#fdcb6e').black('[WARNING: STOPPING THE DEPLOYMENT PROCESS CAN RESULT IN FILE LOSS]'));

themeKit
  .command('deploy', {
    env: 'theme',
    dir: `${PATHS.output}`,
  })
  .then(() => {
    log(chalk.bgHex('#00b894').white('[Deployment successful]'));
  })
  .catch((err) => {
    console.error('Error', err);
  });
