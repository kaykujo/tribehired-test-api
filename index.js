const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const Path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv').config({
	path: Path.join(__dirname, '.env')
});

const app = express();

app.use(cors({
	origin: '*'
}));

const authController = require(Path.join(__dirname, 'controllers/authController'));
const userController = require(Path.join(__dirname, 'controllers/userController'));

app.set('superSecret', process.env.SECRET);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.get('/', (req, res) => {
	res.send('Welcome to TribeHired Test API.');
});

const apiRoutes = express.Router();

app.use('/api', apiRoutes);

apiRoutes.post('/auth/register', authController.register);
apiRoutes.post('/auth/login', authController.login);

apiRoutes.use((req, res, next) => {
	let token = req.headers['authorization'];
	let superSecret = app.get('superSecret');

	if (token) {
		jwt.verify(token, superSecret, (err, decoded) => {
			if (err) {
				return res.status(401).json({
					message: 'Unauthorized',
					error: err
				});
			} else {
				req.decoded = decoded;
				next();
			}
		});
	} else {
		return res.status(401).json({
			message: 'Unauthorized'
		});
	}
});

apiRoutes.get('/users/search', userController.search);
apiRoutes.get('/users', userController.users);

// =======================
// start the server ======
// =======================
mongoose.connect(process.env.MONGODB_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
}).then(() => {
	console.log('Connect to DB success');

	app.listen(process.env.PORT);

	console.log('Server started at port ' + process.env.PORT);
}).catch((err) => {
	console.error('Error connecting to DB : ' + err);
	throw err;
});