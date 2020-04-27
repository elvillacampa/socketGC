$(document).ready(function(argument) {
	const socket = io.connect('http://sock.ets2:3000');
	var messages=[];
	socket.emit('join_chat',function(){});

	socket.on('new_joiner', function(data){
		// notification for new users
		alert(data.id +" joined the chat!")
	});
	
	socket.on('catch_up', function(data){
	// get messages on connect
	if(messages.length==0)
	{
		for (var i = 0; i < data.messages.length; i++) {
			append_new_message(data.messages[i]);
		}
		messages = data.messages;
	}
	});
	socket.on('active_users', function(data){
		// update active users
		active_users(data)
	});

	socket.on('new_message', function(data){
		messages.push(data);
		append_new_message(data);
	});

	// EVENTS
	$("#send").click(function(){
		new_message = $("#msgbox")[0];
		if(new_message.value){
			socket.emit("new_message", new_message.value, function(){});
			new_message = "";
			return;
		}
		alert("Please enter a message");

	});


	// DOM manipulators
	function active_users(users){
		// display all users except self
		$(".user_list").empty();
		$(".user_list").append("<li class='list-group-item'>"+socket.id+" <span class='text-success'> (Me) </span></li>");
		$(".user_list").append("<li class='list-group-item'>"+"</li>");

		for (var i = 0; i < users.length ; i++) {
			if(users[i]!=socket.id)
				$(".user_list").append("<li class='list-group-item'>"+users[i]+"</li>");

		}

	}
	function append_new_message(data) {
  		$(".box").append(
  			"<div class='container col'><p id='' class='message'>"+data.text+"</p><span class='time-right sender'>"+data.time+"</span><span class='time-left sender'>"+data.sender+"</span></div>");
	}

});
