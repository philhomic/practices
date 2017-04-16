var express = require('express');
var app = express();


app.get('/', function(req, res, next){
    res.send('<h1>欢迎光临我的博客</h1>')
});

app.listen(8081);