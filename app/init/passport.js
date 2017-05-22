const LocalStrategy   = require('passport-local').Strategy;

module.exports = function(passport, User) {
  passport.serializeUser(function(user, done) {
		done(null, user._id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});

  passport.use('local-login', new LocalStrategy({
       usernameField : 'username',
       passwordField : 'password',
       passReqToCallback : true,
   },
   function(req, username, password, done) {
       User.findOne({ 'username' :  username }).exec()
        .then(authenticate.bind(null, req, username, password, done))
        .catch((err) => {
          return done(err);
        });

   }));

   function authenticate(req, username, password, done, user) {
     if (!user) {
         return done(null, false, req.flash('loginMessage', 'Login Failed.'));
     }

     if (!user.validPassword(password))
         return done(null, false, req.flash('loginMessage', 'Login Failed.'));

     return done(null, user);
   }
}
