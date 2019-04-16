var express = require('express');

// 引入数据库模块
const connection = require("./utils/sql");
// 引入jsonwebtoken
const jwt = require('jsonwebtoken');
// 路由跳转模块
var router = express.Router();

// 跨域设置
router.all("*",(req,res,next) => {
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Headers",'authorization','Content-Type');
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
// 登陆 --- 检查用户名和密码
router.post('/checkLogin',(req,res) => {
    let {account,password} = req.body;
    // 创建sql
    let sqlStr = `select * from user where username = '${account}' and userpwd = '${password}'`;
    // 执行sql
    connection.query(sqlStr,(err,data) => {
        if(err) throw err;
        if(data.length){
            // 使用jwt生成token   object.assign()：浅拷贝     expiresIn：设置密钥自动销毁的时间
            const token = jwt.sign(Object.assign({},data[0]) ,secretKey,{expiresIn:60*60*2});
            res.send({code:0,message:"欢迎~登陆成功~",token})
        }else{
            res.send({code:1,message:"登陆失败！请检查账号和用户名再重新登陆"})
        }
    })
})

// 用户名的显示
router.get('/checkName',(req,res) => {
    // 用户的数据会保存到req.user中
    console.log()
    let account = req.user.username;
    let password = req.user.userpwd;
    let imgdefault;
    // 根据id获取
    let sqlStr = `select img_url from user where id = ${req.user.id}`;
    // 执行sql
    connection.query(sqlStr,(err,data) => {
        if(err) throw err;
        console.log(data[0].img_url)
        imgdefault = data[0].img_url;
        res.send({account,password,imgdefault})
    })
})

// 引入multer
const multer = require('multer')

// 配置上传到服务器放置的目录 和 重命名
const storage = multer.diskStorage({
	destination: 'public/upload', // 图片上传到服务器的这个目录
	  // 图片重命名
    filename (req, file, cb) {
        var fileFormat =(file.originalname).split("."); // haha.jpg => ['haha', 'jpg']
        // 获取时间戳
        var filename = new Date().getTime();  
        // 124354654 + "." + jpg
        cb(null, filename + "." + fileFormat[fileFormat.length - 1]);
    }
})

// 上传对象
const upload = multer({
    storage,
});

// 头像上传
router.post('/uploadavatar',upload.single('file'),(req,res) => {
    console.log(req.file)
    // 获取文件名
    let filename = req.file.filename;
    // 拼接路径
    let path = `/upload/${filename}`;
    // 构造sql
    const sqlStr = `update user set img_url = '${path}' where id = ${req.user.id}`;
    
    // 执行sql
    connection.query(sqlStr,(err,data) => {
        if(err) throw err;
        if(data.affectedRows > 0){
            res.send({code:0,message:"头像上传成功~",path})
        }else{
            res.send({code:1,message:"头像上传失败，请重新操作~"})
        }
    })  
})

// 个人信息
router.get('/accountinfo', (req, res) => {
	// 获取当前登录用户的id
	const id = req.user.id;
	const sqlStr = `select * from user where id=${id}`;
	connection.query(sqlStr, (err, data) => {
		if (err) throw err;
		res.send(data)
	})
}) 

// 用户角色
router.get('/getmenus',(req,res) => {
    // 获取用户组
    let userGroup = req.user.user_group;
    let role = userGroup === "超级管理员"? 'super' : 'nornmal';
    let menus = [
        //  系统管理数据
        {
            iconimg :"el-icon-location", //图标
            title:"系统管理",
            roles:['super','nornmal'],
            children : [
                {
                    path : "/home/systeminfo", //index地址
                    information : "系统信息"
                }
            ]
        },
        // 账号管理数据
        {
            iconimg :"el-icon-tickets", //图标
            title:"账号管理",
            roles:['super'],
            children : [
                {
                    path : "/home/accountmanage", //index地址
                    information : "账号管理"
                },
                {
                    path : "/home/accountadd", //index地址
                    information : "添加账号"
                },
                {
                    path : "/home/passwordmodify", //index地址
                    information : "密码修改"
                }
            ]
        },
        // 商品管理数据
        {
            iconimg :"el-icon-sold-out", //图标
            title:"商品管理",
            roles:['super','nornmal'],
            children : [
                {
                    path : "/home/goodsmanage", //index地址
                    information : "商品管理"
                },
                {
                    path : "/home/goodsadd", //index地址
                    information : "添加商品"
                }
            ]
        },
        // 统计管理数据
        {
            iconimg :"el-icon-document", //图标
            title:"统计管理",
            roles:['super'],
            children : [
                {
                    path : "/home/salestotal", //index地址
                    information : "销售统计"
                },
                {
                    path : "/home/stocktotal", //index地址
                    information : "进货统计"
                }
            ]
        },
        // 会员管理
        {
            iconimg :"el-icon-document", //图标
            title:"会员管理",
            roles:['super','nornmal'],
            children : [
                {
                    path : "/home/adminadd", //index地址
                    information : "会员添加"
                },
                {
                    path : "/home/adminmanage", //index地址
                    information : "会员管理"
                }
            ]
        },
        // 出货管理
        {
            iconimg :"el-icon-document", //图标
            title:"出货管理",
            roles:['super','nornmal'],
            children : [
                {
                    path : "/home/saleslist", //index地址
                    information : "销售列表"
                },
                {
                    path : "/home/goodsoutstock", //index地址
                    information : "商品出库"
                }
            ]
        },
        // 进货管理
        {
            iconimg :"el-icon-document", //图标
            title:"进货管理",
            roles:['super','nornmal'],
            children : [
                {
                    path : "/home/inventoryadd", //index地址
                    information : "添加库存"
                },
                {
                    path : "/home/inventorymanage", //index地址
                    information : "库存管理"
                }
            ]
        },
    ]
    // 过滤菜单
    // let accessMenu = [];
    // menus.forEach(item => {
    //     if(item.roles.includes(role)){
    //         accessMenu.push(item);
    //     }
    // })
    let accessMenu = menus.filter(item => item.roles.includes(role));

    res.send({accessMenu})
})

module.exports = router;
/*[
    //  系统管理数据
    {
        iconimg :"el-icon-location", //图标
        title:"系统管理",
        children : [
            {
                path : "/home/systeminfo", //index地址
                information : "系统信息"
            }
        ]
    },
    // 账号管理数据
    {
        iconimg :"el-icon-tickets", //图标
        title:"账号管理",
        children : [
            {
                path : "/home/accountmanage", //index地址
                information : "账号管理"
            },
            {
                path : "/home/accountadd", //index地址
                information : "添加账号"
            },
            {
                path : "/home/passwordmodify", //index地址
                information : "密码修改"
            }
        ]
    },
    // 商品管理数据
    {
        iconimg :"el-icon-sold-out", //图标
        title:"商品管理",
        children : [
            {
                path : "/home/goodsmanage", //index地址
                information : "商品管理"
            },
            {
                path : "/home/goodsadd", //index地址
                information : "添加商品"
            }
        ]
    },
    // 统计管理数据
    {
        iconimg :"el-icon-document", //图标
        title:"统计管理",
        children : [
            {
                path : "/home/salestotal", //index地址
                information : "销售统计"
            },
            {
                path : "/home/stocktotal", //index地址
                information : "进货统计"
            }
        ]
    },
    // 会员管理
    {
        iconimg :"el-icon-document", //图标
        title:"会员管理",
        children : [
            {
                path : "/home/adminadd", //index地址
                information : "会员添加"
            },
            {
                path : "/home/adminmanage", //index地址
                information : "会员管理"
            }
        ]
    },
    // 出货管理
    {
        iconimg :"el-icon-document", //图标
        title:"出货管理",
        children : [
            {
                path : "/home/saleslist", //index地址
                information : "销售列表"
            },
            {
                path : "/home/goodsoutstock", //index地址
                information : "商品出库"
            }
        ]
    },
    // 进货管理
    {
        iconimg :"el-icon-document", //图标
        title:"进货管理",
        children : [
            {
                path : "/home/inventoryadd", //index地址
                information : "添加库存"
            },
            {
                path : "/home/inventorymanage", //index地址
                information : "库存管理"
            }
        ]
    },
]*/