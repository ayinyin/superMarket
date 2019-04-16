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
router.post('/OrderaddedData',(req,res) => {
    // 接收参数
    let {shapecode,sold} = req.body;
    // 创建sql
    let sqlStr = `select * from goods where shapecode = '${shapecode}'`;
    // 执行sql
    connection.query(sqlStr,(err,data) => {
        if(err) throw err;
        // 获取sold
        if(data.length === 0){
            res.send({code:1,message:"没有这个商品嗷~"});
        }else{
            data[0].sold += parseInt(sold) ;
            res.send(data[0])
        }
    })
})

// 条形码的验证
router.get('/checkshapecode',(req,res) => {
    let { value } = req.query;
    // 创建sql
    let sqlStr = `select * from goods where shapecode = '${value}'`;
    // 执行
    connection.query(sqlStr,(err,data) => {
        if(err) throw err;
        if(data.length === 0){
            res.send({code:1,message:"商品条形码不存在嗷~"})
        }else{
            res.send({code:0,message:""})
        }
    })
})

// 数量 --- 库存的验证
router.get('/checkstorngnum',(req,res) => {
    let {value,shapenum} = req.query;
    let sqlStr = `select storagenum from goods where shapecode = '${shapenum}'`;
    connection.query(sqlStr,(err,data) => {
        if(err) throw err;
        value = parseInt(value)
        if(data[0].storagenum >= value){
            res.send({code:0,message:""})
        }else{
            res.send({code:1,message:"仓库里没有这么多货物嗷~"})
        }
    })
})

// 表单
router.get('/placeorderData',(req,res) => {    //数据中有数组的话，最好还是使用get方式，不然数据传输格式会改变
    // 接收参数
    let {shapecode,sold} = req.query;
    // 计算库存
    let sqlStr = `select storagenum from goods where shapecode = '${shapecode}'`;
    connection.query(sqlStr,(err,data) => {
        if(err) throw err;
        // if(storagenum < sold){
        //     res.send({message:"没有那么多库存"})
        // }
        let storagenum = data[0].storagenum - parseInt(sold);
        // 创建sql 
        let sqlStr = `update goods set sold = '${sold[0]}',storagenum = '${storagenum}' where shapecode = '${shapecode}'`;
        console.log(sqlStr)
        // 执行sql
        connection.query(sqlStr,(err,data) => {
            if(err) throw err;
            if(data.affectedRows > 0){
                res.send({code:0,message:"商品出货成功！"})
            }else{
                res.send({code:1,message:"商品出货失败，请重新操作~"});
            }
        })
    })
    
})

// 销售统计
router.get('/shippinglist', (req, res) => {
    // 接收参数
    let {currentPage,pageSize} =req.query;
    // 跳过n条
    let n = (currentPage - 1) * pageSize;
    // 准备sql
    let sqlStr = `select * from goods order by sold desc`;
    // 执行sql
    connection.query(sqlStr ,(err,data) => {
        if(err) throw err;
        // 查询
        let total = data.length;
        // 准备sql
        sqlStr += ` limit ${ n },${ pageSize }`;
        // 执行sql
        connection.query(sqlStr,(err,data) => {
            if(err) throw err
            // 成功，把数据交出去
            res.send({total,data});
        });
    })
});
module.exports = router;
