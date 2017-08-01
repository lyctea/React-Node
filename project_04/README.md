---
title: Express英文官方文档实践
tags: Node.js,Express
grammar_cjkRuby: true
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
