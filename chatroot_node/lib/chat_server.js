var socketio = require('socket.io')
var io
var guestNumber = 1
var nickNames = {}
var namesUsed = []
var currentRoom = {}

/**
 * 启动socket服务，输出日志
 */
exports.listen = function (server) {
    //启动sockio服务器，允许其搭载在已有的HTTP服务器上
    io = socketio.listen(server)

    io.serveClient('log level', 1)
    //定义每个用户连接的处理逻辑
    io.sockets.on('connectiong', function (socket) {
        //赋予访客名
        guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed)
        //把用户连接上来是放入聊天室Lobby中
        joinRoom(socket, 'Lobby')
        //处理用户消息，更名，以及聊天室的创建和变更
        handleMessageBroadcasting(socket, nickNames)

        handleNameChangeAttempts(socket, nickNames, namesUsed)

        handleRoomJoining(socket)
        //用户发出请求时，向其提供已经被占用的聊天室列表
        socket.on('rooms', function () {
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