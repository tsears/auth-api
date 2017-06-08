function _serializeUser(user, done) {
    done(null, user._id);
}

function _userFound(done, err, user) {
    done(err, user);
}

function _deserializeUser(UserAccess, userFound, id, done) {
    return UserAccess.findById(id)
        .then(userFound.bind(null, done))
        .catch((err) => { console.error('error', err.message); });
}

function _authenticate(req, username, password, done, user) {
    if (!user) {
      return done(null, false, req.flash('loginMessage', 'Login Failed.'));
    }

    if (!user.validPassword(password)) {
      return done(null, false, req.flash('loginMessage', 'Login Failed.'));
    }

    return done(null, user);
}

function _localStrategy(UserAccess) {

    return function(req, username, password, done) {
        UserAccess.findByName(username)
            .then(_authenticate.bind(null, req, username, password, done))
            .catch((err) => {
                return done(err);
            });
    }
}

function configure(passport, UserAccess, LocalStrategy) {
    const strategyConfig = {
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true,
    }

    const localStrategy = new LocalStrategy(strategyConfig, _localStrategy(UserAccess));

    passport.serializeUser(_serializeUser);
    passport.deserializeUser(_deserializeUser.bind(null, UserAccess, _userFound));
    passport.use('local-login', localStrategy);

    return localStrategy;
}

module.exports = {
    _serializeUser,
    _deserializeUser,
    _userFound,
    _authenticate,
    _localStrategy,
    configure,
}
