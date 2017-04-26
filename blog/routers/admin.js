var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Category = require('../models/Category');

router.use(function(req, res, next){
    if(!req.userInfo.isAdmin){
        //当前用户为非管理员
        res.send('对不起，只有管理员才可以进入后台管理。');
        return;
    }
    next();
})

/*首頁*/
router.get('/', function(req, res, next){
    res.render('admin/index', {
        userInfo: req.userInfo
    });
})

/*用戶管理*/
router.get('/user', function(req, res){

    /*
    * 從數據庫中讀取所有的用戶數據
    * limit(Number): 限制獲取數據的條數
    * skip(): 忽略數據的條數
    *
    * 如果每頁有兩條，那麼：
    * 1: 1-2 skip: 0 -> (當前頁-1)*limit
    * 2: 3-4 skip: 2
    *
    * User.count 返回User表的總條數
    * */

    var page = Number(req.query.page || 1);
    var limit = 2;
    var pages = 0;

    User.count().then(function(count){
        //計算總頁數
        pages = Math.ceil(count / limit);
        page = Math.min(page, pages);
        //取值不能小於1
        page = Math.max(page, 1);

        var skip = (page - 1) * limit;

        User.find().limit(limit).skip(skip).then(function(users){
            res.render('admin/user_index', {
                userInfo: req.userInfo,
                users: users,

                count: count,
                pages: pages,
                limit: limit,
                page: page
            })
        });
    });

})

/*
* 分类管理
* */

router.get('/category', function(req, res, next){
    res.render('admin/category_index', {
        userInfo: req.userInfo
    });
})

/*
* 添加分类
* */

router.get('/category/add', function(req, res, next){
    res.render('admin/category_add', {
        userInfo: req.userInfo
    });
});

/*
* 分类的保存
* */
router.post('/category/add', function(req, res){
    var name = req.body.name || '';
    if(name == ''){
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '名称不能为空'
        });
    }
})

module.exports = router;