var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// 引入account文件
const accountRouter = require("./routes/account")
// 引入goods文件
const goodsRouter = require("./routes/goods")
// 引入admin文件
const adminRouter = require("./routes/admin")
// 引入login文件
const loginRouter = require("./routes/login")
// 引入inventory文件
const inventoryRouter = require("./routes/inventory")
// 引入total
const totalRouter = require('./routes/total')
// 引入shipping
const shippingRouter = require('./routes/shipping')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
// 配置account路由
app.use('/account',accountRouter);
// 配置goods路由
app.use('/goods',goodsRouter);
// 配置admin路由
app.use('/admin',adminRouter);
// 配置login路由
app.use('/login',loginRouter);
// 配置inventoryRouter路由
app.use('/inventory',inventoryRouter)
// 配置total路由
app.use('/total',totalRouter);
// 配置shipping路由
app.use('/shipping',shippingRouter);

app.use(function(req, res, next) {
  next(createError(404));
});


app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
// 监听端口
app.listen(8888,() => {
  console.log("服务器地址为：http://127.0.0.1:8888");
})
module.exports = app;
