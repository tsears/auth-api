function loginSuccess(user, res, log, next, err) {
    if (err) { return next(err); }
    log('auth', 'info', `User ${user.username} authenticated`);
    return res.json(200, { authenticated: true });
}

function passportLogin(req, res, next, log, err, user, info) {
    if (err || !user) {
        if (err) {
            log('auth', 'warn', 'error during authentication', err);
        } else {
            log('auth', 'info', `Authentication failed for user ${req.params.username}`);
        }

        res.json(401, { authenticated: false });
        return next(err);
    }

    req.logIn(user, loginSuccess.bind(null, user, res, log, next));
}

function handleLogin(passport, log, req, res, next) {
    passport.authenticate('local-login',
        passportLogin.bind(null, req, res, next, log)
    )(req, res, next);
}

function configure(router, passport, log) {
    log('router', 'info', 'initialized authentication routes');

    router.post('/login', handleLogin.bind(null, passport, log));

    return router;
}

module.exports = {
    configure,
    handleLogin,
    passportLogin,
    loginSuccess,
}
