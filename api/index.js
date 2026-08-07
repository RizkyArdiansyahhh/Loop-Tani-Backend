const path = require('path');

// Require the compiled NestJS Webpack bundle dist/main.js
const mainPath = path.resolve(__dirname, '../dist/main.js');
const main = require(mainPath);

module.exports = function (req, res) {
  const handler = main.default || main;
  return handler(req, res);
};
