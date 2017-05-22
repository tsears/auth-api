const auth = require('./auth');
const Router = require('restify-router').Router;

module.exports = function(passport, log) {
  const router = new Router();

  router.add('/auth', auth(passport, log));

  return router;
}
