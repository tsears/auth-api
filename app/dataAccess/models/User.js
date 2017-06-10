import Mongoose from 'mongoose';
console.log(Mongoose);
import bcrypt from 'bcrypt-nodejs';
const Schema 	= Mongoose.Schema;

Mongoose.Promise = global.Promise;

const userSchema = new Schema({
	username: String,
	password: String,
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

export default Mongoose.model('User', userSchema);
