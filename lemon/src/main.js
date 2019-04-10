import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 引入element-ui
import ElementUI from "element-ui"
// 注册样式
import "element-ui/lib/theme-chalk/index.css"
// 使用
Vue.use(ElementUI)
Vue.config.productionTip = false
// 引入公共样式
import "@/assets/css/common.css"
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
