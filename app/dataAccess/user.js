module.exports = function(UserModel) {
    const findById = (id) => {
        return UserModel.findById(id).exec();
    }

    const findByName = (username) => {
        return UserModel.findOne({ 'username' :  username }).exec();
    }

    const create = (user, pass) => {
        const newUser = new UserModel();
        newUser.username = user;
        newUser.password = newUser.generateHash(pass);

        return newUser.save().exec();
    }

    return {
        findById,
        findByName,
        create,
    }
}
