const Path = require('path');

const User = require(Path.join(__dirname, '..', 'models/user'));

module.exports = {
	async users(req, res) {
		let user = await User.find().exec();

		res.json(user);
	},

	async search(req, res) {
		let searchString = req.query.s;

		if (!searchString) {
			res.json([])
		} else {
			let user = await User.find({
				"name": {
					$regex: new RegExp(searchString, "i")
				}
			}).exec();

			res.json(user);
		}
	}
}