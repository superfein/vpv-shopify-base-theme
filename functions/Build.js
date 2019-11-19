import './components/compile';
import chalk from 'chalk';

const { log } = console;
const webpack = require('webpack');
const config = require('../webpack.prod');

const compiler = webpack(config);

compiler.run((err, res) => {
  if (err) {
    return err;
  }
  log(chalk.bgHex('#00b894').white('[Build successful]'));
  return res;
});
