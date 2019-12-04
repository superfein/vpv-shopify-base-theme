
import { copy } from 'fs-extra';
import fs from 'fs';
import path from 'path';
import glob from 'glob';
import chalk from 'chalk';
import chokidar from 'chokidar';

const { log } = console;

/**
  @desc Define input and output paths
*/
const PATHS = {
  src: path.resolve(__dirname, '../../src'),
  output: path.resolve(__dirname, '../../dist'),
};

const copyFile = (output, filePath) => {
  if (/assets\/images|assets\/fonts/.test(output)) {
    copy(`${filePath}`, `${PATHS.output}/assets/${output.split('/')[2]}`);
  } else {
    copy(`${filePath}`, `${PATHS.output}/${output}`);
  }
};

const unlinkFile = (output) => {
  try {
    if (/assets\/images|assets\/fonts/.test(output)) {
      fs.unlinkSync(`${PATHS.output}/assets/${output.split('/')[2]}`);
    } else {
      fs.unlinkSync(`${PATHS.output}/${output}`);
    }
    log(chalk.bgHex('#fdcb6e').black(`[${output} deleted]`));
  } catch (err) {
    log(chalk.bgHex('#fdcb6e').black(`[error occurred trying to delete ${output}]`));
  }
};

let ignorePaths;
const ignoreAssets = async () => {
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
        copyFile(output, filePath);
        log(chalk.bgHex('#00b894').white(`[${output} added]`));
      })
      .on('change', (filePath) => {
        const output = filePath.split('/src/')[1];
        copyFile(output, filePath);
        log(chalk.bgHex('#563ce7').white(`[${output} modified]`));
      })
      .on('unlink', (filePath) => {
        const output = filePath.split('/src/')[1];
        unlinkFile(output);
      });
    resolve('done');
  });
};

(async () => {
  await ignoreAssets();
  await watcher();
})();
