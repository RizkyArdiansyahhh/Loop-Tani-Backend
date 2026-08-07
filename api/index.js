const main = require('../dist/main.js');

module.exports = function (req, res) {
  const handler = main.default || main;
  return handler(req, res);
};
