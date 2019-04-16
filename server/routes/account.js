var express = require('express');

// 引入数据库模块
const connection = require("./utils/sql");

var router = express.Router();

// 跨域设置
router.all("*",(req,res,next) => {
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Headers",'authorization');
    // res.setHeader("Access-Control-Request-Headers",'authorization');
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

// 添加用户
router.post('/accountmanage', (req, res) => {
    // 查询数据库
    console.log(req.body)
    // 解构
    let { account,password,region } = req.body;
    // 创建图片
    let imgdefault = `/upload/imgdefault.jpg`;
    // 创建sql语句
    let sqlStr = `insert into user(username,userpwd,user_group,img_url) values('${ account }','${ password }','${ region }','${imgdefault}')`;

    // 执行sql
    connection.query(sqlStr , (err,data) => {
        if(err) throw err;
        // data.affectedRows  为响应行数
        if(data.affectedRows === 1){
            res.send({code:0,message:"添加用户成功，请到账号管理查看~",imgdefault});
        }else if(data.affectedRows === 0){
            res.send({code:0,message:"添加用户失败，请重新添加~"});
        }
    })
});

// 账号管理
router.get('/accountlist', (req, res) => {
    let {currentPage,pageSise} = req.query;
    console.log(currentPage,pageSise)
    // 跳过几条的设置
    let n = (currentPage - 1)*pageSise;
    // 准备sql
    let sqlStr = `select * from user order by cdata desc`;
    // 执行sql
    connection.query(sqlStr ,(err,data) => {
        if(err) throw err;
        // console.log(data.length)
        let total = data.length;
        // 成功开始获取数据
        sqlStr += ` limit ${n},${pageSise}`;
        console.log(sqlStr,total)
        // 执行sql
        connection.query(sqlStr,(err,data) => {
            if(err) throw err;
            res.send({total,data})
        // res.send("1");
        })
        // 成功，把数据交出去
    })
    
});

// 旧密码验证
router.get('/chackoldpass', (req,res) => {
    let { password } = req.query;
    let sqlpwd = req.user.userpwd;
    if(password === sqlpwd){
        res.send({code:0,message:""})
    }else{
        res.send({code:1,message:"与原密码不一致~请重新输入"})
    }
})

// 密码修改
router.post('/modifyPass',(req,res) => {
    let {newpassword} = req.body;
    // 获取id
    let id = req.user.id;
    // 创建sql
    let sqlStr = `update user set userpwd = '${newpassword}' where id = ${id}`;
    // 执行sql
    connection.query(sqlStr,(err,data) => {
        if(err) throw err;
        if(data.affectedRows === 1){
            res.send({code:0,message:"修改密码成功~"})
        }else{
            res.send({code:1,message:"修改密码失败~请重新操作"}) 
        }
    })
})

// 删除按钮 --- 删除数据请求接收
router.get('/delteData',(req,res) => {
    // console.log(req.query)
    let { id } = req.query;
    // 通过id查找数据库
    let sqlStr = `delete from user where id = ${ id }`;
    connection.query(sqlStr,(err,data) => {
        if(err) throw err;
        console.log(data)
        if(data.affectedRows === 1){
            res.send({code:0,message:"删除成功，请查阅~"})          
        }else{
            res.send({code:0,message:"删除失败，请重新操作~"})
        }
    })
})

// 修改按钮的单击
router.get("/editclick",(req,res) => {
    // 接收到了参数
    let { id } = req.query;
    // 创建sql
    let sqlStr = `select * from user where id = ${ id }`; 
    // 执行sql
    connection.query(sqlStr,(err,data) => {
        if(err) throw err;
        // 数据是一个数组
        res.send(data[0]);
    })
})

// 修改数据的提交
router.post("/editFormData",(req,res) => { 
    let {id,name,region} = req.body; 
    // 创建sql语句
    let sqlStr = `update user set username = '${ name }' , user_group = '${ region }' where id = '${ id }'`;
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
    console.log(req.query)
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
// create table `user`(
//     id int primary key auto_increment,
//     cdata timestamp default current_timestamp,
//     username varchar(50),
//     userpwd varchar(50),
//     user_group text
// )