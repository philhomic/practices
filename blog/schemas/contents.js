var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    //内容表结构

    //关联字段 - 内容分类的id
    category: {
        //类型
        type: mongoose.Schema.Types.ObjectId,
        //引用，这里的Category指的就是model Category
        ref: 'Category'
    },
    //内容标题
    title: String,

    //关联字段 - 用户的id
    user: {
        //类型
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    //添加时间
    addTime: {
        type: Date,
        default: new Date()
    },

    //阅读量
    views: {
        type: Number,
        default: 0
    },


    //简介
    description: {
        type: String,
        default: ''
    },

    //内容
    content: {
        type: String,
        default: ''
    }

})