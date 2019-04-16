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

// 添加数据
router.post('/goodsadd', (req, res) => {
    // 解构
    let { classify,shapecode,shapename,shapeprice,marketprice,
        purchaseprice,warehousing,shapeweight,shapemonad,favorable,
        shapesales,shapedesc } = req.body;
    // 总库存
    let storagenum = warehousing;
    // 创建sql语句
    let sqlStr = `insert into goods(classify,shapecode,shapename,shapeprice,marketprice,
        purchaseprice,warehousing,shapeweight,shapemonad,favorable,
        shapesales,shapedesc,sold,storagenum) values('${classify}','${shapecode}','${shapename}','${shapeprice}',${marketprice},
        ${purchaseprice},${warehousing},${shapeweight},'${shapemonad}','${favorable}',
        '${shapesales}','${shapedesc}',0,'${storagenum}')`;
    // 执行sql
    connection.query(sqlStr , (err,data) => {
        if(err) throw err;
        // data.affectedRows  为响应行数
        if(data.affectedRows === 1){
            res.send({code:0,message:"添加商品成功，请到商品列表查看~"});
        }else if(data.affectedRows === 0){
            res.send({code:0,message:"添加商品失败，请重新添加~"});
        }
    })
});

// 列表页面加载
router.get('/goodslist', (req, res) => {
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
});

// 删除操作
router.get('/goodsDelete',(req,res) => {
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

// 修改按钮 -- 数据回填
router.get('/amendFrom',(req,res) => {
    // 接收数据
    let { id } = req.query;
    // 创建sql
    let sqlStr = `select * from goods where id = '${ id }'`;
    // 执行sql
    connection.query(sqlStr,(err,data) => {
        if(err) throw err;
        // 返回数据
        res.send(data[0]);
    })
})

// 修改数据的提交
router.post('/editDataForm',(req,res) => {
    let {id,shapename,classify,shapeprice,marketprice,shapesales} = req.body;
    // 创建sql
    let sqlStr = `update goods set shapename = '${shapename}',classify = '${classify}',
    shapeprice = '${shapeprice}',marketprice = '${marketprice}',shapesales = '${shapesales}'
     where id = '${id}'`;
    //  执行sql
    connection.query(sqlStr,(err,data) => {
        if(err) throw err;
        if(data.affectedRows === 1){
            res.send({code:0,message:"修改数据成功，请查看~"})
        }else{
            res.send({code:1,message:"修改数据失败，请重新操作~"})
        }
    })
})

// 批量删除数据请求
router.get("/batchData",(req,res) => {
    console.log(req.query)
    let { idArr } = req.query;
    // 创建sql语句
    let sqlStr = `delete from goods where id in (${ idArr })`;

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
// create table `goods`(
//     id int primary key auto_increment,
//     classify varchar(50),
//     shapecode bigint,
//     shapename varchar(50),
//     shapeprice int,
//     marketprice int,
//     purchaseprice int,
//     storagenum int,
//     shapeweight int,
//     shapemonad varchar(50),
//     favorable varchar(20),
//     shapesales varchar(20),
//     shapedesc text,
//     ctime timestamp default current_timestamp,
//     sold int
// )

// 查询
// router.post('/selectClassify',(req,res) => {
//     // console.log(req)
//     let {classify,shapemsg} = req.body;
//     let sqlStr = `select * from goods where 1=1 `;
//     if(classify !== "所有分类" ){
//         sqlStr += `and classify = '${classify}'`;
//     }
//     if(shapemsg !== ""){
//         sqlStr += `and(shapename like '%${shapemsg}%' or shapecode like '%${shapemsg}%')`;
//     }
//     // 执行sql
//     connection.query(sqlStr,(err,data) => {
//         if(err) throw err;
//         // 把数据返回回去
//         if(data.length > 0){
//             res.send({code:0,data,message:"查询商品成功，请查看结果~"});
//         }else{
//             res.send({code:1,data,message:"现在还没有这个商品嗷~"});
//         }
//     })
// })
