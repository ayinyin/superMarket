// 连接数据库的js文件
// 引入数据库
const mysql = require("mysql");

// 使用mysql模块，设置sql对象
let connection = mysql.createConnection({
    host:"localhost", // 连接数据库的地址
    user:"root",  //用户名
    password: "", // 密码
    database : "super", //连接的数据库名
    port : "3306"  //端口号，可以不写，---- 数据库的默认端口号
});

// 执行连接
connection.connect();

// 暴露出去
module.exports = connection;