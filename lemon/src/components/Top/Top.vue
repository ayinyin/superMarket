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
                            <img :src="imgUrl" alt="个人头像">
                        </el-col>
                        <el-col :span="14">
                                <el-dropdown placement="bottom" trigger= "click" @command="handleCommand">
                                    <span class="el-dropdown-link">
                                        {{account}}<i class="el-icon-arrow-down el-icon--right"></i>
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
// 引入local
import local from "@/utils/local"
export default {
    data(){
        return{
            account:'',
            imgUrl:''
        }
    },
    methods:{
        // 退出登录
        handleCommand(command){
            if(command === "a"){
                this.$router.push('/home/personal')
            }
            if(command === "b"){
                // 清除密钥
                local.remove("a_yin_yin_na")
                this.$message({
                    type:"success",
                    message:"退出登录成功，欢迎回来~"
                })
                this.$router.push('/login')
            }
        },
        // 加载top的函数
        accpountInfo(){
            this.request.get('/login/checkName')
                .then(res => {
                    // 获取数据
                    let {account,password,imgdefault} =res;
                    local.set('a_ying',password);
                    this.account = account;
                    this.imgUrl = `http://127.0.0.1:8888${imgdefault}`;
                })
                .catch(err => {
                    console.log(err);
                })
        }
    },
    // 生命周期
    created(){
       this.accpountInfo();
    }
}
</script>
<style lang="less">
    @import "./Top.less";
</style>
