import UserModel from './models/User';

export const findById = (id) => {
    return UserModel.findById(id).exec();
}

export const findByName = (username) => {
    return UserModel.findOne({ 'username' :  username }).exec();
}

export const create = (user, pass) => {
    const newUser = new UserModel();
    newUser.username = user;
    newUser.password = newUser.generateHash(pass);

    return newUser.save().exec();
}
