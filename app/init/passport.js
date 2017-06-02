const userDataAccess    = require('../../app/dataAccess/user');

function _serializeUser(user, done) {
    done(null, user._id);
}

function _userFound(done, err, user) {
    done(err, user);
}


function _deserializeUser(userFound, id, done) {
    return userDataAccess.findUserById(id)
        .then(userFound.bind(null, done))
        .catch((err) => { console.error('error', err.message); });
}

function _authenticate(req, username, password, done, user) {
    if (!user) {
      return done(null, false, req.flash('loginMessage', 'Login Failed.'));
    }

    if (!user.validPassword(password))
      return done(null, false, req.flash('loginMessage', 'Login Failed.'));

    return done(null, user);
}

function _localStrategy(req, username, password, done) {
    userDataAccess.findUserByName.then(authenticate.bind(null, req, username, password, done))
     .catch((err) => {
       return done(err);
     });
}

function configure(passport, LocalStrategy) {
    const strategyConfig = {
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true,
    }

    const localStrategy = new LocalStrategy(strategyConfig, _localStrategy);

    passport.serializeUser(_serializeUser);
    passport.deserializeUser(_deserializeUser.bind(null, _userFound));
    passport.use('local-login', localStrategy);

    return localStrategy;
}

module.exports = {
    _serializeUser,
    _deserializeUser,
    _userFound,
    _authenticate,
    configure,
}
