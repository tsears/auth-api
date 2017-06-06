module.exports = function(Router, authRoutes, passport, log) {
  const router = new Router();
  router.add('/auth', authRoutes.configure(Router, passport, log));

  return router;
}
