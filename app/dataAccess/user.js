const User = require('../user/user');

function findUserById(id) {
    console.log('fak');
    return User.findById(id).exec();
}

function findUserByName(username) {
    return User.findOne({ 'username' :  username }).exec();
}

module.exports = {
    findUserById,
    findUserByName,
}
