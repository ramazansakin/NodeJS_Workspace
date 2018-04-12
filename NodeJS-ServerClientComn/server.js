var serverPort = 9099;
var net = require('net'); 

var server = net.createServer(function(client) { 
	//client bilgileri yazılır.
	console.log('client connected'); 

	// Client'dan gelicek data beklenir. 
	client.on('data', function(data) { 
		console.log('received data: ' + data.toString()); 
		//Server'dan Client socket'e data gönderilir. 
		client.write('Bu mesaj Serverdan gonderilmistir.'); 
	}); 

	// Client'ın socket'i kapattığı olay yakalanır.. 
	client.on('end', function() { 
		console.log('client disconnected'); 
	}); 

}); 


server.on('error',function(err){
	console.log(err);
	server.close(); 
}); 


server.listen(serverPort, function() { 
	console.log('server started on port ' + serverPort); 
});