var mongoose = require('mongoose')

mongoose.connection.openUri('mongodb://localhost:27017/test')
const connect = mongoose.connection

connect.on('error', console.error.bind(console, '连接错误: '))
connect.once('open', () => {
    console.log('数据库成功连接')
    
    //定义一个schema  数据库模版
    let Schema = mongoose.Schema({
        category: String,
        name: String
    })

    Schema.methods.eat = function () {
        console.log("I've eatten one " + this.name)
    }

    //继承一个schema 通过集成Schema定义的基本方法和属性得到相关的内容
    let Model = mongoose.model('fruit', Schema)
    //生成一个文档document
    let apple = new Model({
        category: 'apple',
        name: 'apple'
    })
    //存放数据
    apple.save((err, apple) => {
        //保存数据异常
        if(err) return console.log(err)
        apple.eat()
        //查找数据
        Model.find({ name: 'apple' }, (err, data) => {
            console.log(data)
        })
    })
})