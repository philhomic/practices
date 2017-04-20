var express = require('express');
var router = express.Router();

router.use(function(req, res, next){
    if(!req.userInfo.isAdmin){
        //当前用户为非管理员
        res.send('对不起，只有管理员才可以进入后台管理。');
        return;
    }
    next();
})

router.get('/', function(req, res, next){
    res.send('后台管理首页');
})

module.exports = router;