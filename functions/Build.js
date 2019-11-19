import './components/compile';

const webpack = require('webpack');
const config = require('../webpack.prod');

const compiler = webpack(config);

compiler.run((err, res) => {
  if (err) {
    return err;
  }
  return res;
});
