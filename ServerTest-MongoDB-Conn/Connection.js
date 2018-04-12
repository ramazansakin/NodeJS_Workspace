var mongoClient = require('mongodb').MongoClient;

var url = 'mongodb://localhost:27017/testDB';

mongoClient.connect(url, function(err, db) {
    if (err) {
        console.log('Sorry unable to connect to MongoDB Error:', err);
    } else {
        console.log("Connected successfully to server", url);
        var collection = db.collection('persons');

        console.log("1 - Print persons collection:- ");
        collection.find({}).toArray(function(err, person) {
            console.log(JSON.stringify(person, null, 2));
        });

        // alternative way
        var cursor = db.collection('persons').find();
        console.log("2 - Print persons collection:- ");    
        cursor.each(function(err, doc) {
           console.log(doc);
       });

        db.close();
    }
});


// Defining a Model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({

    username : { type: String, required : true, unique : true },
    password : String,
    admin: Boolean,
    age  : Number
 
});

var User = mongoose.model('User', userSchema);

module.exports = User;

-------------------------

Hashing passwords

// on every save, add the date
userSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();

  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at)
    this.created_at = currentDate;

  next();
});

--------------------------

-- Get all users 
// get all the users
User.find({}, function(err, users) {
  if (err) throw err;

  // object of all the users
  console.log(users);
});

--------------------------------

-- get only one ( Where clause )
// get the user starlord55
User.find({ username: 'starlord55' }, function(err, user) {
  if (err) throw err;

  // object of the user
  console.log(user);
});

---------------------------

-- findById 
// get the user starlord55
User.find({ username: 'starlord55' }, function(err, user) {
  if (err) throw err;

  // object of the user
  console.log(user);
});

---------------------------

** Where clause
// get any admin that was created in the past month

// get the date 1 month ago
var monthAgo = new Date();
monthAgo.setMonth(monthAgo.getMonth() - 1);

User.find({ admin: true }).where('created_at').gt(monthAgo).exec(function(err, users) {
  if (err) throw err;

  // show the admins in the past month
  console.log(users);
});

----------------------------

++ update
// get a user with ID of 1
User.findById(1, function(err, user) {
  if (err) throw err;

  // change the users location
  user.location = 'uk';

  // save the user
  user.save(function(err) {
    if (err) throw err;

    console.log('User successfully updated!');
  });

});

------------------------

++ Delete
// get the user starlord55
User.find({ username: 'starlord55' }, function(err, user) {
  if (err) throw err;

  // delete him
  user.remove(function(err) {
    if (err) throw err;

    console.log('User successfully deleted!');
  });
});

----------------------------

++ Find By ID and Remove
// find the user with id 4
User.findByIdAndRemove(4, function(err) {
  if (err) throw err;

  // we have deleted the user
  console.log('User deleted!');
});

------------------------------

-- POST and GET method Example usage
// This function is responsible for returning all entries for the Message model
function getMessages(req, res, next) {
  // Resitify currently has a bug which doesn't allow you to set default headers
  // This headers comply with CORS and allow us to server our response to any origin
  res.header("Access-Control-Allow-Origin", "*"); 
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  // .find() without any arguments, will return all results
  // the `-1` in .sort() means descending order
  Message.find().sort('date', -1).execFind(function (arr,data) {
    res.send(data);
  });
}



function postMessage(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  // Create a new message model, fill it up and save it to Mongodb
  var message = new Message();
  message.message = req.params.message;
  message.date = new Date();
  message.save(function () {
    res.send(req.body);
  });
}

// Set up our routes and start the server
server.get('/messages', getMessages);
server.post('/messages', postMessage);

------------------------------------------


