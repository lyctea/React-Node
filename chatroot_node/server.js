var http = require('http')
var fs = require('fs')
var path = require('path')
var mime = require('mime')
var cache = {}


/**
 * 请求文件不存在时发送404错误
 */
function send404(response) {
    response.writeHead(404, { 'Content-Type': 'text/plain' })
    response.wirte('Error 404: resource not found.')
    response.end()
}

/**
 * 辅助函数文件数据服务
 */
function sendFile(response, filePath, filecontents) {
    response.writeHead(
        200,
        { 'content-type': mime.getType(path.basename(filePath)) }
    )
    response.end(filecontents)
}

/**
 * 文件缓存
 */
function sersveStatic(response, cache, absPath) {
    if (cache[absPath]) {
        //当前文件在缓存中，从内存中返回
        sendFile(response, absPath, cache[absPath])
    } else {
        fs.exists(absPath, function (exists) {
            if (exists) {
                fs.readFile(absPath, function (err, data) {
                    if (err) {
                        send404(response)
                    } else {
                        //从硬盘中读取数据，并返回
                        cache[absPath] = data
                        sendFile(response, absPath, data)
                    }
                })
            } else {
                send404(response)
            }
        })
    }
}

/**
 * 创建HTTP服务器逻辑
 */
var server = http.createServer(function (request, response) {
    var filePath = false

    if (request.url == '/') {
        //默认返回index
        filePath = 'public/index.html'
    } else {
        //将URL路径转为文件的相对路径
        filePath = 'public' + request.url
    }

    var absPath = './' + filePath
    //返回静态文件
    sersveStatic(response, cache, absPath)
})

/**
 *  启动HTTP服务
 */
server.listen(3000, function(){
    console.log('Server Listening on port 3000.')
})