// 公共函数


// 正则验证
export function passwordReg(val){
    let reg = /^(\w){3,9}$/;
    return reg.test(val);
}

// 随机数
export function createCode(){
    return parseInt(Math.random()*10000000000);
}