module.exports = function(router, authRoutes, passport, log) {

  router.add('/auth', authRoutes.configure(router, passport, log));

  return router;
}
