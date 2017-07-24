/**
 * const 声明后不再改变
 * let 与const相反
 * const 需要兼容es5的一些实现，模块、函数、闭包
 */
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const mongooes = require('mongoose')


const port = process.env.PORT || 3000;
const app = express();

mongooes.Promise = global.Promise;
const handlebars = require("express-handlebars").create({ // 引入模板
	defaultLayout: "index"
});


mongooes.connection.openUri('mongodb://localhost:27017/movie')
const connect = mongooes.connection
connect.on('error', console.error.bind(console, '连接错误: '))
connect.once('open', () => { console.log('数据库成功连接') })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//引入路由
const loginRouter = require('./routes')

app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");

app.use(express.static("dist")); // 托管静态文件
app.use(body_parser); // body中间件解析post请求


//将前端路由请求/;跳转到index
app.get('/', (req, res) => {
    //res.send('Hello World!')
    res.render('index')
})

//app.use('/login',loginRouter)

app.get('/login', (req, res) => {
    let userData = {
        loginName: req.body.loginName,
        passWord: req.body.passWord
    }
    res.json({
        code: '200',
        status: 'success',
        msg: '登陆成功'
    })
})

app.listen(port, () => {
    console.log('开始监听：' + port)
})  //监听端口