const Router = require('restify-router').Router;

module.exports = function(passport, log) {
  const router = new Router();
  log('router', 'info', 'initialized authentication routes');

  router.post('/login', login);

  function login(req, res, next) {

    passport.authenticate('local-login', (err, user, info) => {
     if (err || !user) {
       if (err) {
         log('auth', 'warn', 'error during authentication:\n' + err);
       } else {
         log('auth', 'info', `Authentication failed for user ${req.params.username}`);
       }

       res.json(401, { authenticated: false });
       return next(err);
     }

     req.logIn(user, function(err) {
       if (err) { return next(err); }
       log('auth', 'info', `User ${user.username} authenticated`);
       return res.json(200, { authenticated: true });
     });
   })(req, res, next);
  }

  return router;
}
