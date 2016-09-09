const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserSchema = new Schema({
	username: String,
	barsEvent: [String]	
});

let User = mongoose.model('User', UserSchema);

module.exports = User;
