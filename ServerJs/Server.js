var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var jwt    	= require('jsonwebtoken');

var secretKey = "Secret-to-parse-jwt-token-shoppingassistant";

var userInfo = [
{
    id: 1,
    username: 'Ram@shop',
    password: '12345',
    name: 'Ramazan',
    surname: 'SAKIN',
    Token :   '',
    lists :   [ { "listname":"myList1" , "date": "17/12/2016"  ,
                                           "products": [
                                           { "productid":"123123123" },
                                           { "productid":"123123574" },
                                           { "productid":"123123153" } ] },

                { "listname":"myList2" , "date": "06/04/2017"  ,
                                           "products": [
                                           { "productid":"123123345" },
                                           { "productid":"123123626" } ] },
                { "listname":"myList3" , "date": "30/01/2017"  ,
                                           "products": [
                                           { "productid":"123123722" },
                                           { "productid":"123123724" },
                                           { "productid":"123123757" },
                                           { "productid":"123123321" },
                                           { "productid":"123121111" },
                                           { "productid":"123122222" },
                                           { "productid":"123123333" },
                                           { "productid":"123124444" } ] } ]
},
{
    id: 2,
    username: 'Ram@zan',
    password: '123',
    name: 'Ramazan2',
    surname: 'SAKIN2',
    Token :   '',
    lists :   [ { "listname":"myOtherAccountList1", "date": "03/02/2016"  ,
                                          "products": [
                                           { "productid":"123123211" },
                                           { "productid":"123123323" },
                                           { "productid":"123123123" }

                                           ] },
                { "listname":"myOtherAccountList2" , "date": "12/07/2016"  ,
                                           "products": [
                                           { "productid":"123123124" },
                                           { "productid":"123123444" },
                                           { "productid":"123123111" },
                                           { "productid":"123123222" },
                                           { "productid":"123123333" },
                                           { "productid":"123123444" },
                                           { "productid":"123123555" },
                                           { "productid":"123123666" }

                                           ] },
                { "listname":"myOtherAccountList3" ,  "date": "23/01/2017"  ,
                                           "products": [
                                           { "productid":"123123111" },
                                           { "productid":"123123222" },
                                           { "productid":"123123333" }

                                           ] } ]
}
];


function checkAuth(req, res) {

  if (Object.keys(req.headers).indexOf('authorization') == -1)
    return res.sendStatus(401);

  var token = req.headers.authorization;
  if (token.indexOf('Bearer') != 0)
    return res.sendStatus(401);

  token = token.substring(7);

    for (var i = 0; i < userInfo.length; ++i) {
        if ( userInfo[i].Token == token) {
    	    console.log(userInfo[i].username);
            // verifies secret and checks whether the token is expired or not
            return jwt.verify(userInfo[i].Token , secretKey, function(err, decoded) {
                if (err) {
                    console.log('Token has Expired!');
                    return res.status(401).json({ success: false, message: 'Token has Expired!' });
                } else {
                    console.log('Authentication was verified succesfully.');
                    // if everything is good, save to request for use in other routes
                    return res.status(200).json({ success: true, message: 'Authentication was verified succesfully.' });
                }
            });
        }
    }
    return res.status(401).json({ success: false, message: 'Token couldnt be found!' });
}

app.get('/api/token', checkAuth);


app.post('/api/mobilelogin', function (req, res) {

  setTimeout(function() {

    if (!req.body)
      return res.sendStatus(422);

    if (!req.body.u )
      return res.sendStatus(422);

    var username = req.body.u;

    if (!req.body.p )
      return res.sendStatus(422);

    var password = req.body.p;

    for (var i = 0; i < userInfo.length; i++){
        if (username == userInfo[i].username &&
            password == userInfo[i].password)
        {
        	// if user is found and password is right
	        // create a jwt token
          if( userInfo[i].Token == '' ){
              var token = jwt.sign({
                username: userInfo[i].username,
                company:  "Ustek-RFID Solutions"
              }, secretKey, {
                  expiresIn: '12h'  // expires in ...
              });

              userInfo[i].Token = token;
              console.log(token);

              // return the information including token as JSON
              return res.status(200).json({
                message: 'JWT was created successfully!',
                token: userInfo[i].Token, user: userInfo[i].name+" "+userInfo[i].surname , company: userInfo[i].company, id: userInfo[i].id
              });
          }else{
            return jwt.verify(userInfo[i].Token , secretKey, function(err, decoded) {
                if (err) {
                    console.log('JWT has already expired!');
                    return res.status(401).json({   message: 'JWT has already expired!',
                                                    token: '',
                                                    user: '',
                                                    company: '',
                                                    id: -1 });
                } else {
                    // if everything is good, save to request for use in other routes
                    console.log('JWT has not expired yet!');
                    return res.status(200).json({   message: 'JWT has not expired yet!',
                                                    token: userInfo[i].Token,
                                                    user: userInfo[i].name+" "+userInfo[i].surname ,
                                                    company: userInfo[i].company,
                                                    id: userInfo[i].id });
                }
            });
          }
    	}
  	}

    return res.sendStatus(422);
  }, 200);

})


app.get( '/api/getLists/:userid', function(req, res) {
    console.log("## Get Shopping Lists");
    var userId = req.params.userid;
    console.log(userId);

    for( var i=0; i<userInfo.length; ++i ){
        if( userInfo[i].id == userId ){
            return res.json(userInfo[i].lists);
        }
    }
    return res.sendStatus(404);
})


app.get( '/api/getMarkets', function(req, res) {
    console.log("## Get Markets ");
    return res.json(markets);
})


// Sample Customers
var markets = [
  {
    "id": 1,
    "name": "BIM",
    "subname": "Arapcesme",
    "lat": "212.12",
    "lng": "125.12"
  },
  {
    "id": 2,
    "name": "A101",
    "subname": "Akse Sapagi",
    "lat": "210.12",
    "lng": "143.12"
  },
  {
    "id": 3,
    "name": "EKOMAR",
    "subname": "Arapcesme",
    "lat": "226.12",
    "lng": "130.12"
  },
  {
    "id": 4,
    "name": "BIM",
    "subname": "Akse Sapagi",
    "lat": "211.12",
    "lng": "112.12"
  },
  {
    "id": 5,
    "name": "BEREKET",
    "subname": "Arapcesme",
    "lat": "263.12",
    "lng": "126.12"
  }
];

// Sample Products / DEBUGGING
var products = [
    {"id":"123123111","name":"Type A","brand":"A", "amount":15 },
    {"id":"123123222","name":"Type B","brand":"B", "amount":14},
    {"id":"123123333","name":"Type A","brand":"B", "amount":13},
    {"id":"123123444","name":"Type F","brand":"S", "amount":11},
    {"id":"123123555","name":"Type A","brand":"C", "amount":12},
    {"id":"123123666","name":"Type A","brand":"D", "amount":12},
    {"id":"123123777","name":"Type S","brand":"E", "amount":16},
    {"id":"123123888","name":"Type V","brand":"F", "amount":13},
    {"id":"123123999","name":"Type A","brand":"A", "amount":12},
    {"id":"123123123","name":"Type A","brand":"B", "amount":12},
    {"id":"123123124","name":"Type H","brand":"C", "amount":11},
    {"id":"123123345","name":"Type A","brand":"S", "amount":12},
    {"id":"123123345","name":"Type A","brand":"S", "amount":12},
    {"id":"123123345","name":"Type T","brand":"S", "amount":12},
    {"id":"123123345","name":"Type T","brand":"S", "amount":12},
    {"id":"123123345","name":"Type S","brand":"S", "amount":12},
    {"id":"123123345","name":"Type R","brand":"S", "amount":12}
];


app.listen(3030);






//////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
// SAMPLE REQUESTS
// in order to check whether the authorization token(JWT token)is expired or not
app.get( '/check', function(req, res) {
    console.log("checkOUT FUNCTION");

    // verifies secret and checks exp
    // spesific user to control
    return jwt.verify(userInfo[1].Token , secretKey, function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        console.log("Ok No Problema! Auth OK...");
        return res.sendStatus(200);
      }
    });
})


app.get('/api/link/epc/:epc/barcode/:barcode', function (req, res) {
    console.log("Fab Calling");

    // dump results for DEBUGGING
    return res.json({ barcode : "FFFFFFF", customer : "Customer", productType: "anyType"  });
})

app.get( '/api/product/epc/:epcCode', function(req, res) {
    console.log("EPC Tag reading");
    for( var i=0; i<packages.length; ++i ){
        for( var j=0; j<packages[i].products.length; ++j ){
            if( packages[i].products[j].tagid == req.params.epcCode ){
                for( var k=0; k<customers.length; ++k ){
                    if( packages[i].customerid == customers[k].id ){
                        return res.send( { customer : customers[k].name , productType : packages[i].products[j].producttype, barcode : packages[i].barcode } );
                    }
                }
            }
        }
    }

    return res.sendStatus(404);
})

app.post('/apiv1/packages', function (req, res) {
    "use strict";
    if (!req.body.id.length)
        res.status(404).send('Sorry, we cannot find that!');

    let result = [];
    req.body.id.forEach(function(c_id) {
        console.log(c_id);
        for (let i = 0; i < packages.length; i++) {
            if (packages[i].customerid == c_id) {
                for (let j = 0; j < packages[i].products.length; j++) {
                    result.push(packages[i].products[j]);
                }
            }
        }

    });
    res.json(result);
})

app.get('/apiv1/allpackages', function (req, res) {
    res.json(packages);
})

app.get('/apiv1/customer', function (req, res) {
    res.json(customers);
})