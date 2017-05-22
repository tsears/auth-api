

module.exports = function(User, options, log) {

  User.findOne({ username: options.user})
    .exec()
    .then(ensureAdmin)
    .catch((err) => {
      log('init', 'error', 'Error querying for admin:\n' + err);
    });

    function ensureAdmin(user) {
      if (user) {
        log('init', 'info', 'Admin user found.');
        return;
      } else {
        const newUser = new User();
        newUser.username = options.user;
        newUser.password = newUser.generateHash(options.pass);

        newUser.save()
          .exec()
          .then(() => {
            log('init', 'info', `Created admin user: ${options.user}`);
          })
          .catch((err) => {
            log('init', 'error', 'Error creating admin account\n' + err);
          })
      }
    }
}
