<template>
    <div class="home">
        <el-container>
            <!-- 左侧 -->
            <el-aside width="200px">
                <div class="systematic">
                    <i class="el-icon-menu"></i>
                </div>
                <Leftnav></Leftnav>
            </el-aside>

            <!-- 右侧 -->
            <el-container>
                <!-- 头 -->
                <el-header>
                    <Top></Top>
                </el-header>
                <!-- 中 -->
                <el-main>
                    <router-view></router-view>

                </el-main>
                <!-- 尾 -->
                <el-footer>
                    <Bottom></Bottom>
                </el-footer>
            </el-container>

        </el-container> 
    </div>
</template>
<script>
// 引入菜单
import Leftnav from "@/components/Leftnav/Leftnav.vue";
// 引入头部
import Top from "@/components/Top/Top.vue";
// 引入底部
import Bottom from "@/components/Bottom/Bottom.vue";

export default {
    // 注册组件
    components:{
        Leftnav,
        Top,
        Bottom
    }
}
</script>
<style lang="less">
    // 引入样式 
    @import "./home.less";
</style>
// http://localhost:8080/#/home/systeminfo