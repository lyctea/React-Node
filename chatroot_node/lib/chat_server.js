var socketio = require('socket.io')
var io
var guestNumber = 1
var nickNames = {}
var namesUsed = []
var currentRoom = {}

/**
 * 启动socket服务，输出日志
 */
exports.listen = function(server) {
	//启动sockio服务器，允许其搭载在已有的HTTP服务器上
	io = socketio.listen(server)

	io.serveClient('log level', 1)
	//定义每个用户连接的处理逻辑
	io.sockets.on('connectiong', function(socket) {
		//赋予访客名
		guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed)
		//把用户连接上来是放入聊天室Lobby中
		joinRoom(socket, 'Lobby')
		//处理用户消息，更名，以及聊天室的创建和变更
		handleMessageBroadcasting(socket, nickNames)

		handleNameChangeAttempts(socket, nickNames, namesUsed)

		handleRoomJoining(socket)
		//用户发出请求时，向其提供已经被占用的聊天室列表
		socket.on('rooms', function() {
			socket.emit('rooms', io.sockets.manager.rooms)
		})
		//定义断开连接后的清除逻辑
		handleClientDisconnection(socket, nickNames, namesUsed)
	})
}

/**
 * 分配用户昵称
 */
function assignGuestName(socket, guestNumber, nickNames, namesUsed) {
	var name = 'Guest' + guestNumber
	nickNames[socket.id] = name

	socket.emit('nameResult', {
		success: true,
		name: name
	})

	namesUsed.push(name)
	return guestNumber + 1
}

/**
 * 进入聊天室相关逻辑
 */
function joinRoom(socket, room) {
	socket.join(room)
	currentRoom[socket.id] = room
	socket.emit('joinResult', { room: room })

	socket.broadcast.to(room).emit('message', {
		text: nickNames[socket.id] + ' has joined ' + room + '.'
	})

	var userInRoom = io.sockets.clients(room)

	if (userInRoom.length > 1) {
		var userInRoomSummary = 'Users currently in ' + room + ': '
		for (var index in userInRoom) {
			var userSocketID = userInRoom[index].id
			if (userSocketID != socket.id) {
				if (index > 0) {
					userInRoomSummary += ','
				}
				userInRoomSummary += nickNames[userSocketID]
			}
		}
		userInRoomSummary += '.'
		socket.emit('message', { text: userInRoomSummary })
	}
}

/**
 * 更名请求逻辑
 */
function handleNameChangeAttempts(socket, nickNames, namesUsed) {
	socket.on('nameAttempt', function(name) {
		if (name.indexOf('Guest' == 0)) {
			socket.emit('nameResult', {
				success: false,
				message: 'Names cannot begin with "Guest" .'
			})
		} else {
			if (namesUsed.indexOf(name) == -1) {
				var previourName = nickNames[socket.id]
				var previourNameIndex = namesUsed.indexOf(previourName)
				namesUsed.push(name)
				nickNames[socket.id] = name
				delete namesUsed[previourNameIndex]

				socket.broadcast.to(currentRoom[socket.id]).emit('message', {
					success: true,
					name: name
				})

				socket.broadcast.to(currentRoom[socket.id]).emit('message', {
					text: previourName + ' is now know as ' + name + '.'
				})
			} else {
				socket.emit('nameResult', {
					success: false,
					message: 'That name is already in use.'
				})
			}
		}
	})
}


/**
 * 发送聊天信息
 */
function handleMessageBroadcasting(socket) {
	socket.on('message', function (message) {
		socket.broadcast.to(message.room).emit('message', {
			text: nickNames[socket.id] + ': ' + message.text
		})
	})
}

/**
 * 创建房间
 */
function handleRoomJoining(socket) {
	socket.on('join', function(room){
		socket.leave(currentRoom[socket.id])
		joinRoom(socket, room.newRoom)
	})
}

/**
 * 用户断开连接
 */
function handleClientDisconnection(socket) {
	socket.on('disconnect', function(){
		var nameIndex = namesUsed.indexOf(nickNames[socket.id])
		delete namesUsed[nameIndex]
		delete nickNames[socket.id]
	})
}