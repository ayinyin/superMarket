<template>
    <div class="top">
        <el-row :gutter="24">
            <el-col :span="18">
                <!-- <i class="el-icon-menu"></i> -->
                华联超市管理系统欢迎你
            </el-col>
            <el-col :span="6">
                <span class="user">
                    <el-row :gutter="20">
                        <el-col :span="6" class="userimg">
                            <img src="./a.jpg" alt="个人头像">
                        </el-col>
                        <el-col :span="14">
                                <el-dropdown placement="bottom" trigger= "click">
                                    <span class="el-dropdown-link">
                                        阿银银呐<i class="el-icon-arrow-down el-icon--right"></i>
                                    </span>
                                    <el-dropdown-menu slot="dropdown" >
                                        <el-dropdown-item command="a">个人中心</el-dropdown-item>
                                        <el-dropdown-item command="b">退出登录</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                        </el-col>
                    </el-row>
                </span>
                
            </el-col>
        </el-row>
    </div>
</template>
<script>
export default {
    
}
</script>
<style lang="less">
    @import "./Top.less";
</style>
