/**
 * Created by WangPei on 2017/4/19.
 */

var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    username: String,
    password: String,
    isAdmin: {
        type: Boolean,
        default: false
    }
});