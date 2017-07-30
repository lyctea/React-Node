let app = require('express')()
let http = require('http').Server(app)
let io = require('socket.io')(http)

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

io.on('connection', (socket)=>{
    console.log('a user connected')
    //监听连接断开事件
    socket.on('disconnect', ()=>{
        console.log('user disconnect')
    })
    //监听客户端发送消息事件
    socket.on('chat message', (msg)=>{
        console.log('message: ' + msg)
        //向所有客户端广播事件
        io.emit('chat message', msg)
    }) 
})

http.listen(3000, () => {
    console.log('listening on *.3000')
})