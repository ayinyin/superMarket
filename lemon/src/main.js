import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 引入axios
import axios from "axios"
// 挂载在原型上
Vue.prototype.axios = axios;

// 引入axios请求函数 --- 解构获取
import  request  from "./utils/request"
// 挂载在原型上
Vue.prototype.request = request;

// 引入echarts
import echarts from "echarts"
// 挂载在原型上
Vue.prototype.echarts = echarts;

// 引入element-ui
import ElementUI from "element-ui"
// 注册样式
import "element-ui/lib/theme-chalk/index.css"
// 使用
Vue.use(ElementUI)

// 阻止生产提示
Vue.config.productionTip = false

// // 引入local
import local from "@/utils/local"

// 路由守卫
router.beforeEach((to,from,next) => {
  // 获取浏览器中的token
  const token = local.get('a_yin_yin_na');
  if(token){
    next();
  }else{
    if(to.path === '/login'){
      next();
    }else{
      next('/login');
    }
  }
})

// 引入公共样式
import "@/assets/css/common.css"
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
