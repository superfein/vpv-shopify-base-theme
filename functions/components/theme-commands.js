import chalk from 'chalk';
import { ensureDir } from 'fs-extra';

const path = require('path');

const { log } = console;
const webpack = require('webpack');
const themeKit = require('@shopify/themekit');
const production = require('../../webpack.prod');
const development = require('../../webpack.dev');

const prodCompiler = webpack(production);
const devCompiler = webpack(development);

const PATHS = {
  output: path.resolve(__dirname, '../../dist'),
};

export const compile = async () => {
  await new Promise((resolve, reject) => {
    prodCompiler.run((err) => {
      if (err) {
        reject(err);
      }
      resolve('done');
    });
  });
  return log(chalk.bgHex('#00b894').white('[Build successful]'));
};

export const watchCompile = () => {
  devCompiler.watch({
    aggregateTimeout: 1000,
  }, (err, stats) => {
    if (err) {
      return err;
    }
    console.log(stats.toString({
      chunks: false,
      cached: false,
      children: false,
      modules: false,
      colors: true,
    }));
    log(chalk.bgHex('#563ce7').white('[Finished building bundles. Uploading...]'));
    return stats;
  });
};

// If no dist folder is found create one
export const makeDir = () => {
  ensureDir(PATHS.output);
};

export const watch = () => {
  themeKit
    .command('watch', {
      env: 'theme',
      dir: PATHS.output,
    })
    .catch((err) => {
      console.error('Error', err);
    });
};

export const open = () => {
  themeKit
    .command('open', {
      env: 'theme',
    })
    .catch((err) => {
      console.error('Error', err);
    });
};

export const download = () => {
  themeKit
    .command('download', {
      env: 'production',
      dir: `${PATHS.src}`,
    })
    .catch((err) => {
      console.error('Error', err);
    });
};

export const deploy = () => {
  log(chalk.bgHex('#563ce7').white('[Starting deployment process...]'));
  log(chalk.bgHex('#fdcb6e').black('[WARNING: STOPPING THE DEPLOYMENT PROCESS CAN RESULT IN FILE LOSS]'));
  themeKit
    .command('deploy', {
      env: 'theme',
      dir: `${PATHS.output}`,
    })
    .then(() => {
      log(chalk.bgHex('#00b894').white('[Deployment successful]'));
      open();
    })
    .catch((err) => {
      console.error('Error', err);
    });
};
