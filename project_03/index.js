let app = require('express')()
let http = require('http').Server(app)
let io = require('socket.io')(http)

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

io.on('connection', (socket)=>{
    console.log('a user connected')
    socket.on('disconnect', ()=>{
        console.log('user disconnect')
    })
    socket.on('chat message', (msg)=>{
        console.log('message: ' + msg)
    })
})

http.listen(3000, () => {
    console.log('listening on *.3000')
})