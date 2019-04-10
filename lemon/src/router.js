import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'/',
      redirect: '/login'
    },
    {
      path: '/login', 
      component: () => import("./views/Login/Login.vue") 
    },
    {
      path: '/home',
      // 重定向
      redirect: "/home/systeminfo",
      component: () => import("./views/Home/Home.vue"),
      children:[
        //添加账号
        { 
          path : '/home/accountadd',
          component:  () => import("./views/Account/AccountAdd.vue")
        },
        // 账号管理
        {
          path : '/home/accountmanage',
          component:  () => import("./views/Account/AccountManage.vue")
        },
        // 密码修改
        {
          path : '/home/passwordmodify',
          component:  () => import("./views/PasswordModify/PasswordModify.vue")
        },
        // 添加商品
        {
          path : '/home/goodsadd',
          component:  () => import("./views/Goods/GoodsAdd.vue")
        },
        // 商品管理
        {
          path : '/home/goodsmanage',
          component:  () => import("./views/Goods/GoodsManage.vue")
        },
        // 系统管理
        {
          path: "/home/systeminfo",
          component: () => import("./views/System/SystemInfo.vue")
        },
        // 销售统计
        {
          path: "/home/salestotal",
          component: () => import("./views/Total/SalesTotal.vue")
        },
        // 进货统计
        {
          path: "/home/stocktotal",
          component: () => import("./views/Total/StockTotal.vue")
        },
      ]
    }
  ]
})
// export default 一个组件中，只能使用一次