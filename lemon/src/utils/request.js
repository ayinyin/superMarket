// 引入axios
import axios from "axios"
// 引入处理post函数
import qs from "qs"
// 引入local
import local from "@/utils/local"
// 设置默认请求的服务器地址
axios.defaults.baseURL = "http://127.0.0.1:8888";
// 拦截axios请求
//设置请求拦截器 --- 相当于直接设置在axios原型上
axios.interceptors.request.use(function(config) {
    // 获取
    const token = local.get('a_yin_yin_na');
    config.headers.authorization = `Bearer ${token}` 
    return config;
})
// 封装axios请求
export default { 
    
    get(url ,params={}){
        return new Promise((resolve,reject) => {
            // console.log(params)
            // 发送请求
            axios.get( url ,{ params })
            .then(response => {
                resolve(response.data)
            })
            .catch(err => { 
                reject(err);
            })
        });
    },
    post(url ,params={}){
        return new Promise((resolve,reject) => {
            // 发送请求
            axios.post( url , qs.stringify(params) )
            .then(response => {
                resolve(response.data)
            })
            .catch(err => {
                reject(err);
            })
        });
    }
}
   

