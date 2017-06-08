module.exports = function(Router, authRoutes, passport, log) {
  const router = new Router();
  router.use('/auth', authRoutes.configure(Router, passport, log));

  return router;
}
