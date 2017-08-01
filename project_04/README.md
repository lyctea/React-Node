---
title: Express英文官方文档实践
tags: Node.js,Express
---

# Getting started
## 安装
新建一个目录, 初始化项目

``` stylus
mkdir myapp
cd myapp
npm init  //可以手动输入入口文件,如entry point: (index.js)
```

安装express依赖

``` stylus
npm install express --save
npm install express --no-save   //也可以不将express添加到依赖中
```

## 新建一个Hello World 示例
修改目录下index.js文件如下:

``` stylus
const express = require('express')
const app = express()

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
```
运行这个应用用一下命令:

``` stylus
node index.js
```

打开浏览器 http://localhost:3000/ , 就能看到输入 'Hello World!'


## 使用Express 的脚手架构建项目
使用脚手架工具, 可以快速的创建项目骨架,
全局安装express-generator

``` stylus
npm install express-generator -g
```
-h命令参数 可以看到打印的信息

``` stylus
$express -h
Usage: express [options] [dir]

  Options:

    -h, --help           output usage information
        --version        output the version number
    -e, --ejs            add ejs engine support
        --pug            add pug engine support
        --hbs            add handlebars engine support
    -H, --hogan          add hogan.js engine support
    -v, --view <engine>  add view <engine> support (dust|ejs|hbs|hjs|jade|pug|twig|vash) (defaults to jade)
    -c, --css <engine>   add stylesheet <engine> support (less|stylus|compass|sass) (defaults to plain css)
        --git            add .gitignore
    -f, --force          force on non-empty directory

```
使用一下命令可以快速构建指定项目名的应用, 并且可以同时指定模板引擎

``` stylus
express --view=pug myapp

   create : myapp
   create : myapp/package.json
   create : myapp/app.js
   create : myapp/public
   create : myapp/public/javascripts
   create : myapp/public/images
   create : myapp/routes
   create : myapp/routes/index.js
   create : myapp/routes/users.js
   create : myapp/public/stylesheets
   create : myapp/public/stylesheets/style.css
   create : myapp/views
   create : myapp/views/index.pug
   create : myapp/views/layout.pug
   create : myapp/views/error.pug
   create : myapp/bin
   create : myapp/bin/www
```

进到工作目录中,安装依赖, 并运行项目

``` stylus
cd myapp
npm install
```
On MacOS or Linux系统,执行以下命令:

``` shell
$ DEBUG=myapp:* npm start
```

On Windows系统, 执行以下命令:

``` shell
> set DEBUG=myapp:* & npm start
```
同样打开浏览器 http://localhost:3000/

通过脚手架创建的项目,  目录结构如下

``` stylus
.
├── app.js
├── bin
│   └── www
├── package.json
├── public
│   ├── images
│   ├── javascripts
│   └── stylesheets
│       └── style.css
├── routes
│   ├── index.js
│   └── users.js
└── views
    ├── error.pug
    ├── index.pug
    └── layout.pug

7 directories, 9 files
```
## 基础路由
应用的路由处理客户端通过URL或路径等特定的http请求方法(GET POST ...)的请求
每一个路由当被匹配的时候, 都由一个或者多个的处理函数
定义路由的方法

``` stylus
app.METHOD(PATH, HANDLER)
```
这里需要注意的几个点
- app是express的实例
- METHOD是HTTP请求方方法, 小写
- PATH是服务器路径
- HANDLER是当路由匹配的时候执行的方法

### 路由简单实例

相应'Hello World!'字符串在主页上

``` stylus
app.get('/', function(req,res){
	res.send('Hello World!')
})
```
相应一个post方法的请求

``` stylus
app.post('/', function (req, res) {
  res.send('Got a POST request')
}
```
相应PUT方法的请求, 匹配/user 路由

``` stylus
app.put('/user', function(req, res){
	res.send('Got a PUT request a /user')
})
```
相应DELETE方法的请求, 匹配/user 路由

``` stylus
app.delete('/user', function (req, res) {
  res.send('Got a DELETE request at /user')
})
```
## 在express中的静态文件
静态文件, 图片 css javascript等,  使用express内置的中间件express.static处理. 

通过命名的目录包含这些静态资源文件, express.static中间件函数开始直接为这些文件提供支持.
例如:

``` stylus
app.user(express.static('public'))
```
现在可以加载这些文件了  ps:使用的是相对路径

``` stylus
http://localhost:3000/images/kitten.jpg
http://localhost:3000/css/style.css
http://localhost:3000/js/app.js
http://localhost:3000/images/bg.png
http://localhost:3000/hello.html
```
如果有多个静态资源目录, 调用express.static中间件多次即可

``` stylus
app.use(express.static('public'))
app.use(express.static('files'))
```
express会按顺序设置这些静态文件

### 虚拟前缀
创建一个虚拟的前缀(这个前缀并不存在与服务器的文件系统中)

``` stylus
app.use('/static', express.static('public'))
```

现在可以通过这个虚拟的前缀访问到静态资源文件

``` stylus
http://localhost:3000/static/images/kitten.jpg
http://localhost:3000/static/css/style.css
http://localhost:3000/static/js/app.js
http://localhost:3000/static/images/bg.png
http://localhost:3000/static/hello.html
```

### 小结
express.static使用相对路径加载静态文件当你加载你的node程序, 如果你从其他路径运行的express 应用,
一个更安全的策略是使用绝对路径

``` stylus
app.use('/static', express.static(path.join(__dirname, 'public')))
```




