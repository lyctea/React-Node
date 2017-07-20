// 服务器端入口文件
var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
var mongooes = require('mongoose')
var Movie = require('./database/models/movie')     //数据库模型,提供接口,用以访问数据库,进行增删改查等
var _ = require('underscore')  //一个空白的 HTML 页面，并希望立即开始工作

var port = process.env.PORT || 3303
var app = express()

mongooes.Promise = global.Promise
// var db = mongooes.createConnection('localhost','movie') //数据库连接
// db.on('error',console.error.bind(console,'连接错误: '))
// db.once('open',()=>{console.log('数据库成功连接')})
mongooes.connection.openUri('mongodb://localhost:27017/movie')
const connect = mongooes.connection
connect.on('error',console.error.bind(console,'连接错误: '))
connect.once('open',()=>{console.log('数据库成功连接')})

app.set('views',path.join(__dirname, './views/pages')) //模板路径
app.set('view engine','pug')  //指定模板引擎

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname,''))) //静态文件指定目录,又重定向作用
app.locals.moment = require('moment')  //moment 模块用于格式化时间

app.listen(port)  //监听端口

console.log('test start port=' + port)

//首页
app.get('/',function (req,res) {
    Movie.fetch(function (err,movies) {
        if (err){
            console.log("获取数据错误: " + err)
        }
        res.render('index',{
            title: '测试首页',
            movies: movies
        })
    })
})

//详细
app.get('/movie/:id',function (req,res) {
    var id = req.params.id
    Movie.findById(id,function (err,movie) {
        res.render('detail',{
            titile: 'Movie' + movie.title + '详情',
            movie: movie
        })
    })
})

//后台
app.get('/admin/movie',function (req,res) {
    console.log('进入后台')
    res.render('admin',{
        title: '后台页',
        movie: {
            title: '',
            flash: '',
            doctor: '',
            country: '',
            language: '',
            year: '',
            poster: '',
            summary: ''
       }
    })
})
//录入时新增或者更新
app.get('./admin/movie/new',function (req,res) {
    var id = req.body.movie._id
    var movieOBJ = req.body.movie
    console.log('获取的数据:'+movieOBJ)
    var _movie
    //更新
    if (id !== 'undefined'){
        Movie.findById(id,function (err,movie) {
            if(err){
                console.log('查询错误,错误入下:' + err)
            }
            _movie = _.extend(movie,movieOBJ)
            _movie.save(function (err, movie) {
                console.log('查询错误,错误入下: ' + err)
            })
            res.redirect('/movie' + movie._id)
        })
    } else {
        _movie = new Movie({
            doctor: movieOBJ.doctor,
            title: movieOBJ.title,
            country: movieOBJ.country,
            flash: movieOBJ.flash,
            year: movieOBJ.year,
            summary: movieOBJ.summary,
            language: movieOBJ.language,
            poster: movieOBJ.poster,
        })
        _movie.save(function (err, movie) {
            console.log('查询错误,错误如下: ' + err)
        })
        res.redirect('/movie/' + movie._id)
    }
})

//修改
app.get('/admin/update/:id',function (req,res) {
    if(id){
        Movie.findById(id,function (err,movie) {
            if(err){
                console.log('查询错误,错误入下:' + err)
            }
            _movie = _.extend(movie,movieOBJ)
            _movie.save(function (err, movie) {
                console.log('修改查询错误,错误如下: ' + err)
            })
            res.redirect('/movie/',movie._id)
        })
    }
})

//列表
app.get('/admin/list',function (req,res) {
    Movie.fetch(function (err, movies) {
        if(err){
            console.log("数据获取错误,错误=" + err)
        }
        res.render('list',{
            title: '列表页',
            movies: movies
        })
    })
})

//404页面
app.get('/error',function (req,res) {
    res.render('error',{
        errMess: "页面被外星人劫持了!"
    })
})

