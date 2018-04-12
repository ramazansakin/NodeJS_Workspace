function getDateTime() {
 
    var date = new Date();
 
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
 
    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;
 
    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;
 
    var year = date.getFullYear();
 
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
 
    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;
 
    return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec; 
}

var serverPort = 9099;
var server = 'localhost';  
var net = require('net'); 

var client = net.connect({server:server,port:serverPort},function(){ 
    console.log('client connected'); // send data 
    console.log('clientdan servera data gonderilir : '+getDateTime()); 
    client.write('client socketden selamlar... : '+getDateTime()); 
}); 
 

client.on('data', function(data) { 
    console.log('received data: ' + data.toString());
    //client.end(); // stop the client
}); 
 
client.on('error',function(err){ 
    console.log(err); 
}); 
 
client.on('end', function() { 
    console.log('client disconnected'); 
});

