function _ensureAdmin(User, log, username, password, adminUser) {
  if (adminUser) {
    log('init', 'info', 'Admin user found.');
    return;
  } else {
    User.create(username, password)
        .then(() => {
            log('init', 'info', `Created admin user: ${username}`);
        })
        .catch((err) => {
            log('init', 'error', 'Error creating admin account', err);
        });
  }
}


module.exports = function(User, options, log) {

    User.findByName(options.user)
        .then(_ensureAdmin.bind(null, User, log, options.user, options.pass))
        .catch((err) => {
            log('init', 'error', 'Error querying for admin', err);
        });
}
