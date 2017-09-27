var Chat = function(socket) {
	this.socket = socket
}

/**
 * 发送聊天信息
 */
Chat.prototype.sendMessage = function(room, text) {
	var message = {
		room: room,
		text: text
	}
	this.socket.emit('message', message)
}

/**
 * 变更房间的函数
 */
Chat.prototype.changeRoom = function(room) {
	this.socket.emit('join', {
		newRoom: room
	})
}

/**
 * 处理聊天命令
 */
Chat.prototype.processCommand = function(command) {
	var words = command.split(' ')
	var command = words[0].substring(1, words[0].length).toLowerCase()

	var message = false

	switch (command) {
		case 'join':
			words.shift()
			var room = words.join(' ')
			this.changeRoom(room)
			break
		case 'nick':
			words.shift()
			var name = words.join(' ')
			this.socket.emit('nameAttempt', name)
			break

		default:
			message = 'Unrecognized command.'
			break
	}
	return message
}

/**
 * 客户端程序初始化逻辑
 */
var socket = io.connect()

$(document).ready(function() {
	var charApp = new Chat(socket)
	
	socket.on('nameResult', function(result) {
		var message

		if(result.success) {
			message = 'You are now known as ' + result.name + '.'
		}else {
			message = result.message
		}

		$('#messages').append(divSystemContenElement(message))
	})
})

socket.on('joinResult', function(result) {
	$('#room').text(result.room)
	$('#messages').append(divSystemContenElement('Room changed. '))
})

socket.on('message', function(message) {
	var newElement = $('<div></div>').text(message.text)
	$('#messages').append(newElement)
}) 

socket.on('rooms', function(rooms) {
	$('#room-list').empty()

	for(var room in rooms) {
		room = room.substring(1, room.length)
		if(room != '') {
			$('#room-list').append(divEscapedContentElement(room))
		}
	}

	$('#room-list div').click(function(){
		chatApp.processCommand('/join ' + $(this).text())
		$('#send-message').focus()
	})

	setInterval(function () {
		socket.emit('rooms')
	}, 1000)

	$('#send-message').focus()

	$('#send-form').substring(function(){
		processUserInput(chatApp, socket)
		return false;
	})
})

