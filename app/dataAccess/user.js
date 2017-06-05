const User = require('./models/User');

function findUserById(id) {
    return User.findById(id).exec();
}

function findUserByName(username) {
    return User.findOne({ 'username' :  username }).exec();
}

module.exports = {
    findUserById,
    findUserByName,
}
