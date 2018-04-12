var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var jwt    	= require('jsonwebtoken');

var secretKey = "secret-key";

var userInfo = [
{
    username: 'Veli',
    password: 'pass123',
    name: 'Veli',
    surname: 'AKIN',
    company: 'Veli company' ,
    Token:      ''
},
{
    username: 'Ramazan',
    password: '12345',
    name: 'Ramazan',
    surname: 'SAKIN',
    company: 'Ramazan Company' ,
    Token :   ''	 
},
{
    username: 'Ali',
    password: '1',
    name: 'Ali',
    surname: 'GEZER',
    company: 'Ali company' ,
    Token :   ''
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
                company:  "Sample Company"
              }, secretKey, {
                  expiresIn: '12h'  // expires in ...
              });

              userInfo[i].Token = token;
              console.log(token);

              // return the information including token as JSON
              return res.status(200).json({
                message: 'JWT was created successfully!',
                token: userInfo[i].Token, user: userInfo[i].name+" "+userInfo[i].surname , company: userInfo[i].company
              });   
          }else{
            return jwt.verify(userInfo[i].Token , secretKey, function(err, decoded) {
                if (err) {
                    console.log('JWT has already expired!');
                    return res.status(401).json({   message: 'JWT has already expired!',
                                                    token: '',
                                                    user: '',
                                                    company: '' });
                } else {
                    // if everything is good, save to request for use in other routes
                    console.log('JWT has not expired yet!');
                    return res.status(200).json({   message: 'JWT has not expired yet!',
                                                    token: userInfo[i].Token,
                                                    user: userInfo[i].name+" "+userInfo[i].surname ,
                                                    company: userInfo[i].company });
                }
            });
          }    
    	}
  	}

    return res.sendStatus(422);
  }, 200);

})

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

app.get( '/api/product/barcode/:barcodeCode', function(req, res) {
    console.log("Barcode Reading");
    for( var i=0; i<packages.length; ++i ){
        if( packages[i].barcode == req.params.barcodeCode ){
            for( var k=0; k<customers.length; ++k ){
                if( packages[i].customerid == customers[k].id ){
                    return res.send( { barcode: packages[i].barcode , customer : customers[k].name , productType : packages[i].products[0].producttype , amount : packages[i].products.length } );        
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


// Sample Customers
var customers = [
  {
    "id": 1,
    "name": "ŞAHSUVAROĞLU DİVAN (ESKİ)",
    "data": "DN",
    "lat": "212.12",
    "lng": "125.12"
  },
  {
    "id": 14,
    "name": "EMBİL",
    "data": "EM",
    "lat": "213.12",
    "lng": "126.12"
  },
  {
    "id": 3,
    "name": "BERKO İLAÇ",
    "data": "BE",
    "lat": "214.12",
    "lng": "127.12"
  },
  {
    "id": 5,
    "name": "BİRGİ-MEFAR2",
    "data": "MFD",
    "lat": "218.12",
    "lng": "128.12"
  },
  {
    "id": 6,
    "name": "DENEME",
    "data": "DENEME",
    "lat": "219.12",
    "lng": "130.12"
  },
  {
    "id": 7,
    "name": "PFİZER LTD.",
    "data": "P",
    "lat": "223.12",
    "lng": "132.12"
  },
  {
    "id": 8,
    "name": "SABİHA GÖKÇEN",
    "data": "SG",
    "lat": "200.12",
    "lng": "121.12"
  },
  {
    "id": 233,
    "name": "FRASER PLACE",
    "data": "FRASER",
    "lat": "14",
    "lng": "20"
  },
  {
    "id": 162,
    "name": "RADISSON BLU AYDINLI",
    "data": "RBAYDIN",
    "lat": "40.876741",
    "lng": "29.316316"
  },
  {
    "id": 2,
    "name": "STOK",
    "data": "STOK",
    "lat": "40.876322",
    "lng": "29.382252"
  },
  {
    "id": 235,
    "name": "MEDICALPARK GEBZE",
    "data": "MGEB",
    "lat": "12",
    "lng": "14"
  },
  {
    "id": 236,
    "name": "MEDICALPARK KOCAELİ",
    "data": "MKOC",
    "lat": "45",
    "lng": "54"
  },
  {
    "id": 227,
    "name": "DORMIA",
    "data": "DORMIA",
    "lat": "56",
    "lng": "78"
  },
  {
    "id": 237,
    "name": "SHERATON BURSA",
    "data": "SHERATON BURSA",
    "lat": "89",
    "lng": "45"
  },
  {
    "id": 192,
    "name": "PRINCESS ASIA",
    "data": "PRINCESS ASIA",
    "lat": "14",
    "lng": "51"
  },
  {
    "id": 234,
    "name": "NEW HOTEL",
    "data": "NEWHOTEL",
    "lat": "51",
    "lng": "13"
  }
];

// Sample Conteiners
var packages = [
  { barcode: 123451, customerid:2, products:[
        {"tagid":"903416060411505303013F71","producttype":"Bath Sheet Double","packageno":"1"},
        {"tagid":"903416032809011018011BC8","producttype":"Bath Sheet Double","packageno":"1"},
        {"tagid":"903416032417135000014474","producttype":"Bath Sheet Double","packageno":"1"},
        {"tagid":"90341605030906082101D998","producttype":"Bath Sheet Double","packageno":"1"},
        {"tagid":"903416050311532724016E84","producttype":"Bath Sheet Double","packageno":"1"},
        {"tagid":"90341606041446031401AD84","producttype":"Bath Sheet Double","packageno":"1"},
        {"tagid":"903416050708395702011350","producttype":"Bath Sheet Double","packageno":"1"},
        {"tagid":"9034160325172459250125F0","producttype":"Bath Sheet Double","packageno":"1"},
        {"tagid":"90341605021456490101D9DC","producttype":"Bath Sheet Double","packageno":"1"},
        {"tagid":"90341605051357471101E630","producttype":"Bath Sheet Double","packageno":"1"},
        {"tagid":"9034160505111237240168F8","producttype":"Bath Sheet Double","packageno":"2"},
        {"tagid":"903416060609411501013A34","producttype":"Bath Sheet Double","packageno":"2"},
        {"tagid":"903416050312053901013A6C","producttype":"Bath Sheet Double","packageno":"2"},
        {"tagid":"903416050409085619017FF4","producttype":"Bath Sheet Double","packageno":"2"},
        {"tagid":"903416050517473909016668","producttype":"Bath Sheet Double","packageno":"2"},
        {"tagid":"90341606111633080301F368","producttype":"Bath Sheet Double","packageno":"2"},
        {"tagid":"9034160325121150010155F4","producttype":"Bath Sheet Double","packageno":"3"},
        {"tagid":"90341606040950360601A624","producttype":"Bath Sheet Double","packageno":"3"},
        {"tagid":"90341603240830292901E0BC","producttype":"Bath Sheet Double","packageno":"3"} ]},
    { barcode: 317060018, customerid:7, products:[
        {"tagid":"E2005008060801840900BE1F","producttype":"Pillow Case 1","packageno":"1"},
        {"tagid":"903416050509562600010D7C","producttype":"Pillow Case 1","packageno":"1"},
        {"tagid":"903416060415022213010B14","producttype":"Pillow Case 1","packageno":"1"},
        {"tagid":"903416032417313613016778","producttype":"Pillow Case 1","packageno":"1"},
        {"tagid":"903416032511453701012544","producttype":"Pillow Case 1","packageno":"1"},
        {"tagid":"90341605311745380101DAD8","producttype":"Pillow Case 1","packageno":"1"},
        {"tagid":"90341605071104531501B5D0","producttype":"Pillow Case 1","packageno":"2"},
        {"tagid":"90341605051159480101C24C","producttype":"Pillow Case 1","packageno":"2"},
        {"tagid":"90341605051406380301981C","producttype":"Pillow Case 1","packageno":"3"},
        {"tagid":"90341606071055020901A768","producttype":"Pillow Case 1","packageno":"3"},
        {"tagid":"90341605030858260101FECC","producttype":"Pillow Case 1","packageno":"3"} ]},
    { barcode: 123453, customerid:1, products:[
        {"tagid":"903416032514570612019F4C","producttype":"Hand Towel","packageno":"1"},
        {"tagid":"903416060615165511013118","producttype":"Hand Towel","packageno":"1"},
        {"tagid":"903416060411505303013F24","producttype":"Hand Towel","packageno":"1"},
        {"tagid":"90341606091112501501B5F4","producttype":"Hand Towel","packageno":"1"},
        {"tagid":"903416032814130902012A14","producttype":"Hand Towel","packageno":"1"},
        {"tagid":"903416052809255101013A28","producttype":"Hand Towel","packageno":"1"},
        {"tagid":"90341605061034540201F358","producttype":"Bath Towel","packageno":"2"},
        {"tagid":"9034160503084843010127E8","producttype":"Bath Towel","packageno":"2"},
        {"tagid":"90341603250903521701DFD8","producttype":"Bath Towel","packageno":"2"},
        {"tagid":"9034160502153143170161B4","producttype":"Bath Towel","packageno":"3"},
        {"tagid":"903416032511390710019FE8","producttype":"Bath Towel","packageno":"3"} ]},
    { barcode: 123454, customerid:7, products:[
        {"tagid":"903416032817445217014C68","producttype":"Table Cloth 1","packageno":"4"},
        {"tagid":"90341605060914482001C324","producttype":"Table Cloth 1","packageno":"4"},
        {"tagid":"903416060211075217019C78","producttype":"Table Cloth 1","packageno":"4"} ]},

  { barcode: 123456, customerid:2, products:[
        {"tagid":"11903416050510262103013760","producttype":"pantolon","packageno":"1"},
        {"tagid":"11903416032809011018011BC8","producttype":"pantolon","packageno":"1"},
        {"tagid":"11903416032417135000014474","producttype":"pantolon","packageno":"1"},
        {"tagid":"1190341605030906082101D998","producttype":"pantolon","packageno":"1"},
        {"tagid":"11903416050311532724016E84","producttype":"pantolon","packageno":"1"},
        {"tagid":"1190341606041446031401AD84","producttype":"pantolon","packageno":"1"},
        {"tagid":"119034160325135652030184D8","producttype":"pantolon","packageno":"2"},
        {"tagid":"11903416050709411505016230","producttype":"pantolon","packageno":"2"},
        {"tagid":"11903416050314073815018D60","producttype":"pantolon","packageno":"2"},
        {"tagid":"119034160325094102040165D8","producttype":"pantolon","packageno":"2"},
        {"tagid":"11903416050309343301015CBC","producttype":"pantolon","packageno":"2"},
        {"tagid":"11903416060709182103016BF4","producttype":"pantolon","packageno":"2"},
        {"tagid":"1190341603251425470501CA2C","producttype":"pantolon","packageno":"2"},
        {"tagid":"11903416060410552805015CA8","producttype":"pantolon","packageno":"2"},
        {"tagid":"119034160325121150010155F4","producttype":"pantolon","packageno":"3"},
        {"tagid":"1190341606040950360601A624","producttype":"pantolon","packageno":"3"},
        {"tagid":"1190341603240830292901E0BC","producttype":"pantolon","packageno":"3"}] },

    { barcode: 123457, customerid:1, products:[
        {"tagid":"11903416050510415709010DE4","producttype":"gömlek","packageno":"1"},
        {"tagid":"11903416050509562600010D7C","producttype":"gömlek","packageno":"1"},
        {"tagid":"11903416060415022213010B14","producttype":"gömlek","packageno":"1"},
        {"tagid":"11903416032417313613016778","producttype":"gömlek","packageno":"1"},
        {"tagid":"11903416032511453701012544","producttype":"gömlek","packageno":"1"},
        {"tagid":"1190341605311745380101DAD8","producttype":"gömlek","packageno":"1"},
        {"tagid":"1190341603241700030101A838","producttype":"gömlek","packageno":"1"},
        {"tagid":"1190341603261551560701BF00","producttype":"gömlek","packageno":"1"},
        {"tagid":"1190341605051159480101C24C","producttype":"gömlek","packageno":"2"},
        {"tagid":"1190341605051406380301981C","producttype":"gömlek","packageno":"3"},
        {"tagid":"1190341606071055020901A768","producttype":"gömlek","packageno":"3"},
        {"tagid":"1190341605030858260101FECC","producttype":"gömlek","packageno":"3"}] },
    { barcode: 123458, customerid:6, products:[
        {"tagid":"11903416032514570612019F4C","producttype":"ceket","packageno":"1"},
        {"tagid":"11903416060615165511013118","producttype":"ceket","packageno":"1"},
        {"tagid":"11903416060411505303013F24","producttype":"ceket","packageno":"1"},
        {"tagid":"1190341606091112501501B5F4","producttype":"ceket","packageno":"1"},
        {"tagid":"11903416032814130902012A14","producttype":"ceket","packageno":"1"},
        {"tagid":"11903416052809255101013A28","producttype":"ceket","packageno":"1"},
        {"tagid":"119034160609113919130199F8","producttype":"ceket","packageno":"2"},
        {"tagid":"11903416050514172105018DF8","producttype":"ceket","packageno":"3"},
        {"tagid":"119034160606093418020155A8","producttype":"ceket","packageno":"3"},
        {"tagid":"1190341603261618280101EE6C","producttype":"ceket","packageno":"3"},
        {"tagid":"11903416032417450003016078","producttype":"ceket","packageno":"3"},
        {"tagid":"1190341605051112380101E0F0","producttype":"ceket","packageno":"3"},
        {"tagid":"1190341606070852230501B72C","producttype":"ceket","packageno":"3"},
        {"tagid":"1190341606091150010101E22C","producttype":"ceket","packageno":"3"}] },
    { barcode: 123459, customerid:2, products:[
    {"tagid":"11903416050216273605010EC0","producttype":"mont","packageno":"1"},
    {"tagid":"1190341605281355370601B8F4","producttype":"mont","packageno":"1"},
    {"tagid":"1190341603241040461701DEB4","producttype":"mont","packageno":"1"},
    {"tagid":"1190341605280910580301F634","producttype":"mont","packageno":"1"},
    {"tagid":"119034160502153143170161B4","producttype":"mont","packageno":"3"},
    {"tagid":"11903416032511390710019FE8","producttype":"mont","packageno":"3"} ] },
    { barcode: 123450, customerid:9, products:[
    {"tagid":"11903416032817445217014C68","producttype":"çorap","packageno":"4"},
    {"tagid":"1190341605060914482001C324","producttype":"çorap","packageno":"4"},
    {"tagid":"11903416060211075217019C78","producttype":"çorap","packageno":"4"}] }

    ];

///////////////////////////////
// TrainingS Routing -----------------
app.get( '/api/product/epc/:epcCode/tra', function(req, res) {
    console.log("EPC Tag reading");

    return res.send(req.params );
})

app.get( '/api/product/barcode/:barcodeCode/:tra2', function(req, res) {
    console.log("Barcode Reading");


    return res.send(req.params.barcodeCode );
})

app.get('/users/:userId/books/:bookId', function (req, res) {
  res.send(req.params)
})

var cb0 = function (req, res, next) {
  console.log('CB0')
  next()
}

var cb1 = function (req, res, next) {
  console.log('CB1')
  next()
}

var cb2 = function (req, res) {
    console.log("CB2");
    res.send('Hello from C!')
}

app.get('/example/c', [cb0, cb1, cb2])



app.listen(3035);