var socket = require('socket.io'),
	express = require('express'),
	http = require('http'),
	port = 3000,
	users = {},
	messages=[];


var app = express();
var http_server = http.createServer(app).listen(port, function function_name(argument) {
	// This code will be executed if the server is created successfully
	console.log("Server Created at port "+ port);	
});

function realtime_emitter(http_server){

	var io = socket.listen(http_server);
	// will be executed on connect
	io.on('connection', function(socket){
		// new joiner
		socket.on('join_chat', function(){
			// stores new socket user if doesn't exist
			if(socket.id in users){
				console.log("Naa na");
			}else{
				users[socket.id] = socket;
			}
			// inform other users that there is a new joiner
			socket.broadcast.emit("new_joiner", {id:socket.id})
			// emit messages to new user / self
			socket.emit("catch_up", {messages:messages})
			// emit updated active userslist to all
			io.emit('active_users', Object.keys(users)); 
		});

		socket.on('new_message', function(message){
			var date  = new Date();
			var hours = date.getHours() > 12 ? (date.getHours() - 12) : date.getHours();
			var am_pm = date.getHours()>12 ? " PM":" AM";
			var minutes = date.getMinutes()<10 ? "0"+date.getMinutes() : date.getMinutes();
			var time = hours+":"+minutes+am_pm;
			msg = {};
			msg.sender = socket.id;
			msg.text = message;
			msg.time = time;
			messages.push(msg);
			io.emit('new_message', msg);
			console.log(messages);
		});

		socket.on('disconnect', function(){
			if(!socket.id) /// not necessary but just to be safe
				return;
			delete users[socket.id];
			// emit updated active userslist to all
			io.emit('active_users', Object.keys(users)); 
		});
	});
}

realtime_emitter(http_server);