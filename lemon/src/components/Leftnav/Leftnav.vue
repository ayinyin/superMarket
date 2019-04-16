<template>
    <div class="leftnav">
        <el-menu
            :default-active="$route.path"
            class="el-menu-vertical-demo"
            background-color="#384b72"
            text-color="#DBDBDB"
            active-text-color="#1C86EE"
            unique-opened
            router>
        <el-submenu :index=" index+'' " v-for="(item,index) in menus" :key="index">
            <template slot="title">
                <i :class=" item.iconimg "></i>
                <span> {{ item.title }} </span>
            </template>
            <el-menu-item :index="child.path" v-for="(child,index) in item.children" :key="index">
                {{ child.information }}
                </el-menu-item>
        </el-submenu>

    </el-menu>
    </div>
</template>
<script>
export default {
    data() {
        return {
            menus : []
        }
    },
    methods:{
        getMenusData(){
            // 发送请求
            this.request.get('/login/getmenus')
                .then(res => {
                    // 渲染
                    this.menus = res.accessMenu;
                })
                .catch(err => {
                    console.log(err);
                })
        }
    },
    created(){
        this.getMenusData();
    }

}
</script>
<style lang="less">
.leftnav{
    .el-menu-vertical-demo{
        .el-submenu{
            width:200px;
        }
    }
}
</style>
