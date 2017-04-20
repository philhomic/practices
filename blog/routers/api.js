var express = require('express');
var router = express.Router();
var User = require('../models/User');

//统一返回格式
var responseData;

//初始化处理
router.use(function(req, res, next){
    responseData = {
        code: 0,
        message: ''
    };
    next();
})

/*
* 用户注册逻辑
*
* 1. 用户名不能为空
* 2. 密码不能为空
* 3. 两次输入密码必须一致
*
* 1. 用户是否已经被注册了
*       数据库查询
* */

router.post('/user/register', function(req, res, next){
    var username = req.body.username;
    var password = req.body.password;
    var repassword = req.body.repassword;

    if(username == ''){
        responseData.code = 1;
        responseData.message = '用户名不能为空';
        res.json(responseData);
        return;
    }

    if(password == ''){
        responseData.code = 2;
        responseData.message = '密码不能为空';
        res.json(responseData);
        return;
    }

    if(password != repassword){
        responseData.code = 3;
        responseData.message = '两次输入的密码不一致';
        res.json(responseData);
        return;
    }

    //用户名是否已经被注册
    User.findOne({
        username: username
    }).then(function(userInfo){
        if(userInfo){
            //数据库中有该记录
            responseData.code = 4;
            responseData.message = '用户名已经被注册了';
            res.json(responseData);
            return;
        }
        //保存注册信息到数据库中
        var user = new User({
            username: username,
            password: password
        });
        return user.save();
    }).then(function(newUserInfo){
        responseData.message = '注册成功';
        res.json(responseData);
    })

});

/* 登录逻辑 */
router.post('/user/login', function(req, res, next){
    var username = req.body.username;
    var password = req.body.password;

    if(username == '' || password == ''){
        responseData.code = 1;
        responseData.message = '用户名和密码不能为空';
        res.json(responseData);
        return;
    }
     //在数据库中查询用户名密码是否存在，如果存在并一致就登录成功
    User.findOne({
        username: username,
        password: password
    }).then(function(userInfo){
        if(!userInfo){
            responseData.code = 2;
            responseData.message = '用户名或密码错误';
            res.json(responseData);
            return;
        }
        //用户名和密码是正确的
        responseData.message = '登录成功';
        responseData.userInfo = {
            _id: userInfo._id,
            username: userInfo.username
        }
        req.cookies.set('userInfo', JSON.stringify({
            _id: userInfo._id,
            username: userInfo.username
        }));
        res.json(responseData);
        return;
    })
})

/* 退出 */
router.get('/user/logout', function(req, res, next){
    req.cookies.set('userInfo', null);
    res.json(responseData);
})

module.exports = router;