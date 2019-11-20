import { copy } from 'fs-extra';

import path from 'path';
import glob from 'glob';
import chalk from 'chalk';

const chokidar = require('chokidar');

const { log } = console;

/**
  @desc Define input and output paths
*/
const PATHS = {
  src: path.resolve(__dirname, '../../src'),
  output: path.resolve(__dirname, '../../dist'),
};

let ignorePaths;

const assets = async () => {
  await new Promise((resolve, reject) => {
    glob(`${PATHS.src}/assets/{scripts,styles}`,
      (err, res) => {
        if (err) {
          reject(err);
        }
        const assetFiles = [...res];
        ignorePaths = assetFiles;
        resolve('done');
        return res;
      });
  });
};

const watcher = async () => {
  await new Promise((resolve, reject) => {
    const watch = chokidar.watch(`${PATHS.src}`, {
      persistent: true,
      usePolling: true,
      ignored: ignorePaths,
      interval: 1000,
      ignoreInitial: true,
    });
    watch
      .on('add', (filePath) => {
        const output = filePath.split('/src/')[1];
        copy(`${filePath}`, `${PATHS.output}/${output}`);
        log(chalk.bgHex('#00b894').white(`[${output} added]`));
      })
      .on('change', (filePath) => {
        const output = filePath.split('/src/')[1];
        copy(`${filePath}`, `${PATHS.output}/${output}`);
        log(chalk.bgHex('#563ce7').white(`[${output} modified]`));
      })
      .on('unlink', (filePath) => {
        const output = filePath.split('/src/')[1];
        log(chalk.bgHex('#fdcb6e').black(`[${output} deleted]`));
      });
    resolve('done');
  });
};

(async () => {
  await assets();
  await watcher();
})();
