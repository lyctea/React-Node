
const express = require('express')
let router = express.Router()

router.post('/', (req, res) => {
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

module.exports = router