var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var upload = require('./routes/upload');
var BtMovies = require('./routes/BtMovies');
var DYTTMovies = require('./routes/DYTTMovies');
var PornMovies = require('./routes/PornMovies');
var Country = require('./routes/Country');



var sqldb = require('./database');
sqldb.sequelize.sync({force: false}).then(function() {
  console.log("数据库连接成功");
}).catch(function(err){
  console.log("数据库连接失败");
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({limit:'20mb',extended: true }));
app.use(cookieParser());
//将静态资源文件所在的目录作为参数传递给 express.static 中间件以便访问静态资源文件
app.use(express.static(path.join(__dirname, 'public/images')));

//设置跨域访问
app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
	res.header("Content-Type", "application/json;charset=utf-8");
	next();
});
//指定跳转
app.use('/', index);
app.use('/users', users);
//图片上传
app.use('/upload',upload);
//BT吧电影
app.use('/BtMovies',BtMovies);
//电影天堂电影
app.use('/DYTTMovies',DYTTMovies);
//国外电影
app.use('/PornMovies',PornMovies);
//国产电影
app.use('/Country',Country);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
