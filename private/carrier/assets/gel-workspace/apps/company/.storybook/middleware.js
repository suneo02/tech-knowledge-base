const setupProxy = require('../src/setupProxy');

module.exports = function expressMiddleware(app) {
  setupProxy(app);
};
