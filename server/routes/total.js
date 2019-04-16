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

// 准备一个签名（秘钥）
const secretKey = 'ayinyinna';
/* 验证token的合法性 */
const expressJwt = require('express-jwt');
// ------------------------------------------------------------------------------------------------
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
// ------------------------------------------------------------------------------------------------
// 进入页面生成
router.get('/salestotal',(req,res) => {
    // 创建sql
    let sqlStr = `select shapename,sold from goods`
    // 执行sql
    connection.query(sqlStr,(err,data) => {
        if(err) throw err;
        // 返回数据
        res.send({data})
    })
})

// 查询函数
router.get('/datasalesTotal',(req,res) => {
    console.log(req.query)
    // 解构
    let {ctime} = req.query;
    let starttime = ctime[0];
    let endtime = ctime[1];
    // 创建sql
    let sqlStr = `select ctime,sold from goods where ctime between '${starttime}' and '${endtime}'`;
    // 执行sql
    connection.query(sqlStr,(err,data) => {
        if(err) throw err;
        console.log(data)
        res.send(data)
    })
})
// 查询函数
router.get('/stockTotal',(req,res) => {
    console.log(req.query)
    // 解构
    // let {ctime,region} = req.query;
    // let starttime = ctime[0];
    // let endtime = ctime[1];
    // 创建sql
    let sqlStr = `select shapename,warehousing from goods `;
    // 执行sql
    connection.query(sqlStr,(err,data) => {
        if(err) throw err;
        console.log(data)
        res.send(data)
    })
})
module.exports = router;
