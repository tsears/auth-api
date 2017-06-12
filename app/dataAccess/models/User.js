import Mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';
const Schema 	= Mongoose.Schema;

Mongoose.Promise = global.Promise;
let userSchema;

export default function getUserSchema() {
	if (!userSchema) {
		userSchema = new Schema({
			username: String,
			password: String,
		});

		userSchema.methods.generateHash = function(password) {
		    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
		};

		userSchema.methods.validPassword = function(password) {
		    return bcrypt.compareSync(password, this.password);
		};
	}

	return Mongoose.model('User', userSchema);
}
