/**
 * const 声明后不再改变
 * let 与const相反
 * const 需要兼容es5的一些实现，模块、函数、闭包
 */
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const mongooes = require('mongoose')
const exphbs  = require('express-handlebars')

/**
 * 端口号等配置
 */
const port = process.env.PORT || 3000
const app = express()
mongooes.Promise = global.Promise

/**
 * 模板引擎设置
 */
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

/**
 * 数据库连接
 */
mongooes.connection.openUri('mongodb://localhost:27017/movie')
const connect = mongooes.connection
connect.on('error', console.error.bind(console, '连接错误: '))
connect.once('open', () => { console.log('数据库成功连接') })

/**
 * 使用body中间件解析post请求
 */
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//引入后端路由
const loginRouter = require('./routes')
// 托管静态文件
app.use(express.static("build")) 

//将前端路由请求/;跳转到index
app.get('/', (req, res) => {
    res.render('home')
})

//app.use('/login',loginRouter)

app.post('/login', (req, res) => { 
    /**
     * 拿到请求数据
     */
    let userData = {
        loginName: req.body.id,
        passWord: req.body.password
    }

    res.json({
        code: '200',
        status: 'success',
        msg: '登陆成功'
    })
})

app.listen(port, () => {
    console.log('开始监听：' + port)
}) 