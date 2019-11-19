
import { removeSync, copy } from 'fs-extra';
import path from 'path';
import glob from 'glob';
import chalk from 'chalk';

const { log } = console;

/**
  @desc Define input and output paths
*/
const PATHS = {
  src: path.resolve(__dirname, '../../src'),
  output: path.resolve(__dirname, '../../dist'),
};

/**
  @desc Clear current dist directory
*/
log(chalk.bgHex('#563ce7').white('[Clear directory]'));
removeSync(path.resolve(__dirname, '../../dist'));

/**
  @desc Asynchronously pipe all required folders explicitly
*/
log(chalk.bgHex('#563ce7').white('[Rebuilding distribution..]'));
const DIR = ['config', 'layout', 'locales', 'sections', 'snippets', 'templates'];
const copyFiles = async (dir) => {
  try {
    await copy(`${PATHS.src}/${dir}`, `${PATHS.output}/${dir}`);
  } catch (err) {
    console.error(err);
  }
};
DIR.forEach((dir) => copyFiles(dir));

/**
  @desc Flatten all assets files
*/
const assets = (callback) => {
  glob(`${PATHS.src}/assets/**/*`, { ignore: [`${PATHS.src}/assets/{scripts,styles}`, `${PATHS.src}/assets/{scripts,styles}/**/*`] },
    callback);
};

assets((err, res) => {
  const assetFiles = res;
  assetFiles.forEach((dir) => {
    const output = dir.split('/').reverse()[0];
    const hasExtension = output.indexOf('.') >= 0;
    if (hasExtension) {
      copy(`${dir}`, `${PATHS.output}/assets/${output}`);
    }
  });
});
