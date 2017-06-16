module.exports = function (env) {
  let s
  if (!s) {
    s = {
      port: env.APP_PORT,
      mongoIP: env.MONGODB_IP,
      mongoPort: env.MONGODB_PORT,
      mongoDatabase: env.MONGODB_DATABASE,
      sessionSecret: env.SESSION_SECRET,
      adminUser: env.ADMIN_USER,
      adminPass: env.ADMIN_PASS,
      appName: env.APP_NAME,
    }
  }

  return s
}
