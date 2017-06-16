import UserModel from './models/User'

let _userModel

function getUserModel () {
  if (!_userModel) {
    _userModel = UserModel()
  }

  return _userModel
}

export const findById = (id) => {
  return getUserModel().findById(id).exec()
}

export const findByName = (username) => {
  return getUserModel().findOne({ 'username': username }).exec()
}

export const create = (user, pass) => {
  const newUser = new UserModel()
  newUser.username = user
  newUser.password = newUser.generateHash(pass)

  return newUser.save()
}

export default {
  findById,
  findByName,
  create,
}
