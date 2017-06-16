import Router from 'express'
import authRoutes from './auth'

module.exports = function (passport) {
  const router = new Router()
  router.use('/auth', authRoutes.configure(passport))

  return router
}
