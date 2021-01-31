var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('User', new Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	lastLogin: {
		type: Number,
		default: Date.now()
	},
	dateCreated: {
		type: Number,
		default: Date.now()
	},
	dateUpdated: {
		type: Number,
		default: Date.now()
	}
}));