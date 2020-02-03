const autoprefixer = require('autoprefixer');
const postcssPresetEnv = require('postcss-preset-env');

module.exports = {
  plugins: [
    autoprefixer(),
    postcssPresetEnv({ stage: 3, browsers: 'last 10 versions' }),
  ],
};
