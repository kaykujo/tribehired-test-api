const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Path = require('path');

const User = require(Path.join(__dirname, '..', 'models/user'));

const superSecret = process.env.SECRET;

const saltRounds = 5;

module.exports = {
	async register(req, res) {
		if (!req.body.name || !req.body.email || !req.body.password) {
			res.status(400).json({
				message: 'Bad request'
			});
		} else {
			let user = await User.findOne({
				email: req.body.email
			}).exec();

			if (user) {
				res.status(400).json({
					message: 'Email already exists'
				});
			} else {
				let hash = await bcrypt.hash(req.body.password, saltRounds);

				let newUser = new User({
					name: req.body.name,
					email: req.body.email,
					password: hash,
					lastLogin: null,
					dateCreated: Date.now(),
					dateUpdated: Date.now()
				});

				await newUser.save();

				res.json({
					message: 'Registration success'
				});
			}
		}
	},

	async login(req, res) {
		if (!req.body.email || !req.body.password) {
			res.status(404).json({
				message: 'Invalid credentials'
			});
		} else {
			let user = await User.findOne({
				email: req.body.email
			}).exec();

			if (!user) {
				res.status(404).json({
					message: 'Invalid credentials'
				});
			} else {
				let passwordMatch = await bcrypt.compare(req.body.password, user.password);

				if (passwordMatch) {
					var token = jwt.sign(user.toJSON(), superSecret, {
						expiresIn: 1210000000
					});

					user.lastLogin = Date.now();
					user.save();

					res.json({
						token: token,
						user: {
							_id: user._id,
							name: user.name,
							email: user.email
						}
					});
				} else {
					res.status(400).json({
						message: 'Invalid credentials'
					});
				}
			}
		}
	}
}