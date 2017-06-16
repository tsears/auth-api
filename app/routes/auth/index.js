import log from '../../log'
import Router from 'express'

function loginSuccess (user, res, next, err) {
  if (err) { return next(err) }
  log('auth', 'info', `User ${user.username} authenticated`)
  return res.status(200).json({ authenticated: true })
}

function passportLogin (req, res, next, err, user, info) {
  if (err || !user) {
    if (err) {
      log('auth', 'warn', 'error during authentication', err)
    } else {
      log('auth', 'info', `Authentication failed for user ${req.params.username}`)
    }

    res.status(401).json({ authenticated: false })
    return next(err)
  }

  req.logIn(user, loginSuccess.bind(null, user, res, next))
}

function handleLogin (passport, req, res, next) {
  passport.authenticate('local-login',
        passportLogin.bind(null, req, res, next)
    )(req, res, next)
}

function configure (passport) {
  log('router', 'info', 'initialized authentication routes')
  const router = new Router()
  router.post('/login', handleLogin.bind(null, passport))

  return router
}

module.exports = {
  configure,
  handleLogin,
  passportLogin,
  loginSuccess,
}
