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

        Category.find().limit(limit).skip(skip).then(function(categories){
            res.render('admin/category_index', {
                userInfo: req.userInfo,
                categories: categories,

                count: count,
                pages: pages,
                limit: limit,
                page: page
            })
        });
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
        return;
    }

    //数据库中是否已经存在同名的分类名称
    Category.findOne({
        name: name
    }).then(function(cs){
        if(cs){
            //数据库中已存在该分类
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '分类已经存在了'
            })
            return Promise.reject();
        } else {
            //数据库中不存在该分类，可以保存
            return new Category({
                name: name
            }).save();
        }
    }).then(function(newCategory){
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '分类保存成功',
            url: '/admin/category'
        })
    })

})

/*
* 分类修改
* */
router.get('/category/edit', function(req, res){
    //获取要修改的分类的信息，并用表单形式展现出来
    var id = req.query.id || '';

    //获取要修改的分类信息
    Category.findOne({
        _id: id
    }).then(function(category){
        if(!category){
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '分类信息不存在'
            });
            return Promise.reject();
        } else {
            res.render('admin/category_edit', {
                userInfo: req.userInfo,
                category: category
            });
        }
    })
})

/*
* 分类的修改保存
* */
router.post('/category/edit', function(req, res){
    var id = req.query.id || '';
    //获取post提交过来的名称
    var name = req.body.name || '';
    Category.findOne({
        _id: id
    }).then(function(category){
        if(!category){
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '分类信息不存在'
            });
            return Promise.reject();
        } else {
            //当用户没有做任何修改就提交的时候
            if(name == category.name){
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: '修改成功',
                    url: '/admin/category'
                });
                return Promise.reject();
            } else {
                //要修改的分类名称是否已经在数据库中存在了
                return Category.findOne({
                    _id: {$ne: id}, //id不等于当前的id
                    name: name //但是名称一样
                })
            }

        }
    }).then(function(sameCategory){
        if(sameCategory){
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '数据库中已经存在同名分类'
            });
            return Promise.reject();
        } else {
            return Category.update({
                _id: id
            }, {
                name: name
            });
        }
    }).then(function(){
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '修改成功',
            url: '/admin/category'
        });
    })
})


/*
* 分类删除
* */
router.get('/category/delete', function(req, res){
    var id = req.query.id || '';
    Category.remove({
        _id: id
    }).then(function(){
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/category'
        });
    })
})

module.exports = router;