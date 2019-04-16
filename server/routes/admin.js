var express = require('express');

// 引入数据库模块
const connection = require("./utils/sql");
// 路由跳转模块
var router = express.Router();

// 跨域设置
router.all("*",(req,res,next) => {
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Headers",'authorization');
    next();
})

// ---------------------------   验证合法性开始   ------------------------------------

// 准备一个签名（秘钥）
const secretKey = 'ayinyinna';
/* 验证token的合法性 */
const expressJwt = require('express-jwt');

// 验证token的合法性
router.use(expressJwt ({
    secret: secretKey
}).unless({
    path: ['/login/checkLogin']  // 除了这个地址，其他的URL都需要验证（其他的所有请求 都要带上token 才能获取数据 否则不能获取到数据）
})); 
// 路由拦截器
router.use(function (err, req, res, next) {
    // 如果前端没有token或者是错误的token 就会抛出如下错误
    if (err.name === 'UnauthorizedError') { 
        // 响应给前端token无效的信息
        res.status(401).send('token不合法...');
    }
})

// ---------------------------   验证合法性结束   ------------------------------------

// 添加用户的用户名验证
router.get('/checkuserName',(req,res) => {
  // 获取数据
  let {username} = req.query;
  // 创建sql
  let sqlStr = `select * from user where username ='${username}'`;
  // 执行sql
  connection.query(sqlStr,(err,data) => {
      if(err) throw err;
      if(data.length > 0){
          res.send({code:0,message:"用户名太抢手，已经被使用了嗷~"})
      }else{
          res.send({code:1,message:"用户名可以使用~"})
      }
  })
})

// 会员添加
router.post('/adminadd', (req, res, next) => {
  // 接收参数
  let {Realname,admincardnum, admin_group,idNumber,adminStatus,telphone,LandlineNum,emailaddress,address,detailaddress,postalCode} =req.body;
  // 创建sql
  let sqlStr = `insert into admin(Realname,admincardnum,admin_group,idNumber,adminStatus,telphone,LandlineNum,emailaddress,address,detailaddress,postalCode) 
  values(?,?,?,?,?,?,?,?,?,?,?)`;
  let sqlParams = [Realname,admincardnum, admin_group,idNumber,adminStatus,telphone,LandlineNum,emailaddress,address,detailaddress,postalCode];
  // 执行sql
  connection.query(sqlStr,sqlParams,(err,data) => {
    if(err) throw err;
    console.log(1)
    if(data.affectedRows === 1){
      res.send({code:0,message:"会员添加成功~"})
    }else{
      res.send({code:1,message:"会员添加失败，请重新操作~"})
    }
  })
});

// 账号管理
router.get('/adminlist', (req, res) => {
  let {currentPage,pageSise} = req.query;
  console.log(currentPage,pageSise)
  // 跳过几条的设置
  let n = (currentPage - 1)*pageSise;
  // 准备sql
  let sqlStr = `select * from admin order by cdata desc`;
  // 执行sql
  connection.query(sqlStr ,(err,data) => {
      if(err) throw err;
      let total = data.length;
      // 成功开始获取数据
      sqlStr += ` limit ${n},${pageSise}`;
      console.log(sqlStr,total)
      // 执行sql
      connection.query(sqlStr,(err,data) => {
          if(err) throw err;
          res.send({total,data})
      })
  })
  
});

// 修改按钮的单击
router.get("/editclick",(req,res) => {
  // 接收到了参数
  let { id } = req.query;
  // 创建sql
  let sqlStr = `select * from admin where id = ${ id }`; 
  // 执行sql
  connection.query(sqlStr,(err,data) => {
      if(err) throw err;
      // 数据是一个数组
      res.send(data[0]);
  })
})

// 修改数据的提交
router.post("/editFormData",(req,res) => { 
  let {id,Realname,admin_group,telphone,LandlineNum} = req.body; 
  // 创建sql语句
  let sqlStr = `update admin set Realname = '${Realname}',admin_group='${admin_group}',telphone='${telphone}',LandlineNum='${LandlineNum}' where id = '${ id }'`;
  // 执行sql语句
  connection.query(sqlStr,(err,data) => {
      if(err) throw err;
      if(data.affectedRows === 1){
          res.send({code : 0,message :"修改数据成功，请查阅~"})
      }else {
          res.send({code :1 ,message :"修改数据失败，请重新操作~"})
      }
  })
})

// 批量删除数据请求
router.get("/batchData",(req,res) => {
  let { idArr } = req.query;
  // 创建sql语句
  let sqlStr = `delete from admin where id in (${ idArr })`;
  connection.query(sqlStr,(err,data) => {
      if(err) throw err;
      if(data.affectedRows > 0){
          res.send({code :0 ,message:"执行删除操作成功~"})
      }else{
          res.send({code :0 ,message:"执行删除操作成功~"})
      }
  })
})
module.exports = router;

// 建表语句
// create table `admin`(
//   id int primary key auto_increment,
//   cdata timestamp default current_timestamp,
//   Realname varchar(50),
//   admincardnum varchar(20),
//   admin_group text,
//   idNumber bigint,
//   adminStatus varchar(50),
//   telphone varchar(20),
//   LandlineNum text,
//   emailaddress varchar(50),
//   address varchar(50),
//   detailaddress varchar(50),
//   postalCode  varchar(20)
// )