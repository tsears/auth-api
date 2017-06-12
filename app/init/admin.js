import User from '../dataAccess/User';
import log from '../log';

export function _ensureAdmin(username, password, adminUser) {
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

export default function(options) {

    User.findByName(options.user)
        .then(_ensureAdmin.bind(null, options.user, options.pass))
        .catch((err) => {
            log('init', 'error', 'Error querying for admin', err);
        });
}
