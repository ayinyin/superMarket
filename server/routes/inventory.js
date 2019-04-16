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
// --------------------------------------------------------------------------------------------
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
// --------------------------------------------------------------------------------------------

// 入库
router.post('/inventoryadd',(req,res) => {
    let {shapecode,warehousing,purchaseprice} = req.body;
    // 变成num
    warehousing = parseInt(warehousing);
    purchaseprice = parseInt(purchaseprice);
    // 创建sql --- 
    let sqlStr = `select * from goods where shapecode = '${shapecode}'`;
    // 执行sql
    connection.query(sqlStr,(err,data) => {
        if(err) throw err;
        // 保存数据
        // 库存
        let storagenum = data[0].storagenum + warehousing;
        // 已售
        // let sold = storagenum  - warehousing;
        // 创建sql
        sqlStr = `update goods set warehousing = '${warehousing}',
        storagenum = '${storagenum}',purchaseprice = '${purchaseprice}'
         where shapecode = '${shapecode}'`;
        console.log(sqlStr)
        // 执行sql
        connection.query(sqlStr,(err,data) => {
            if(err) throw err;
            if(data.affectedRows === 1){ 
                res.send({code:0,message:"入库成功，请查看~"})
            }else{
                res.send({code:1,message:"入库失败，请重新操作~"})
            }
        })
    })
})

// 商品入库列表
router.get('/inventorymanage',(req,res) => {
    // 接收参数
    let {currentPage,pageSize,classify,shapemsg} =req.query;
    // 跳过n条
    let n = (currentPage - 1) * pageSize;
    // 准备sql
    let sqlStr = `select * from goods where 1=1 `;
    if(classify !== "所有分类" && classify !== ""){
        sqlStr += `and classify = '${classify}' `;
    }
    if(shapemsg !== ""){
        sqlStr += `and (shapename like '%${shapemsg}%' or shapecode like '%${shapemsg}%')`;
    }
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
})

// 删除操作
router.get('/inventoryDelete',(req,res) => {
    let { id } = req.query;
    // 创建sql
    let sqlStr = `delete from goods where id = '${ id }'`;
    // 执行sql
    connection.query(sqlStr,(err,data) => {
        if(err) throw err;
        if(data.affectedRows === 1){
            res.send({code:0,message:"删除商品成功，请查看~"})
        }else if(data.affectedRows === 0){
            res.send({code:1,message:"删除商品失败，请重新操作~"})
        }
    })
})
module.exports = router;
