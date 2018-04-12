var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/testDB');

// Models
var User = require('./models/User');

var newUser = User({
	name: 'Ramy Quill',
	lastname: 'starlord55',
	password: 'password',
	mail: 'mail4@com'
});

// save the user
newUser.save(function(err) {
	if (err) throw err;

	console.log('User created!');
});
