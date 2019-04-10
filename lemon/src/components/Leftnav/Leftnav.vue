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
<!-- #545c64 -->
        <el-submenu :index=" index+'' " v-for="(item,index) in menus" :key="index">
            <template slot="title">
                <i class="item.iconimg"></i>
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
             menus : [
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
             ]
         }
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
