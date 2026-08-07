const path = require('path');

module.exports = function (options, webpack) {
  return {
    ...options,
    entry: './src/main.ts',
    output: {
      path: path.join(__dirname, 'api'),
      filename: 'index.js',
      libraryTarget: 'commonjs',
    },
  };
};
