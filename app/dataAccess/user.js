module.exports = function(User) {

    const findById = (id) => {
        return User.findById(id).exec();
    }

    const findByName = (username) => {
        return User.findOne({ 'username' :  username }).exec();
    }

    const create = (user, pass) => {
        const newUser = new User();
        newUser.username = user;
        newUser.password = newUser.generateHash(pass);

        //console.log(newUser);

        return newUser.save().exec();
    }

    return {
        findById,
        findByName,
        create,
    }
}
