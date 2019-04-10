<template>
    <div class="login">
        <div class="login-wrap">
           <!-- 标题 -->
           <div class="title">
               <h2><span class="el-icon-menu"></span> 华联超市管理系统</h2>
           </div>
           <!-- 登录表单 -->
           <el-form :model="loginForm" status-icon :rules="rules" ref="loginForm" label-width="100px" class="demo-ruleForm">
                <!-- 账号 -->
                <el-form-item label="账 号" prop="account">
                    <el-input type="text" v-model="loginForm.account" autocomplete="off"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item label="密 码" prop="password">
                    <el-input type="text" v-model="loginForm.password" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="确认密码" prop="checkPass">
                    <el-input type="text" v-model="loginForm.checkPass" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="submitForm()">登录</el-button>
                    <el-button @click="resetForm()">重置</el-button>
                </el-form-item>

            </el-form>
       </div>
    </div>
</template>
<script>
import { passwordReg } from "@/utils/validator"
export default {
    data () {
        // 验证密码
        let passwordcheck = (rule, value, callback) => {
            if(value === ""){
                callback(new Error("请输入密码~"));
            }else if(!passwordReg(value)){
                callback(new Error("只能输入3-9个字母、数字、下划线~"))
            } else {
                if(this.loginForm.checkPass !== ""){
                    // 触发一致性验证
                    this.$refs.loginForm.validateField('checkPass')
                }
                callback()
            }
        }
        // 确认密码
        let confirmpassword = (rule, value, callback) => {
            if(value === ""){
                callback(new Error("请输入密码~"))
            } else if(value !== this.loginForm.password){
                callback(new Error("两次密码输入不一致~"))
            } else {
                callback()
            }
        }
        return {
            // 表单数据
            loginForm: {
                account: '', 
                password: '',
                checkPass: ''
            },
            // 验证规则
            rules: {
                // 账号
                account: [ 
                    {required:true, message:"请输入账号",trigger:"blur"},
                    {min:3,max:6,message:"长度在3-6位嗷~",trigger:"blur"}
                ],
                // 密码
                password: [ 
                    {required:true,validator:passwordcheck,trigger:"blur"}
                ],
                // 确认密码
                checkPass: [
                    {required:true,validator:confirmpassword,trigger:"blur"}
                ]
            }
        }
    },
    methods: {
        // 登录
        submitForm() {
            // 验证loginForm对象
            this.$refs.loginForm.validate(valid => {
                if(valid){
                    let params = {
                        account :this.loginForm.account,
                        password : this.loginForm.password
                    }
                    console.log(params);
                    alert("登陆成功嗷~")
                    // 路由跳转
                    this.$router.push("/home");
                } else {
                    alert("验证出错~")
                    return
                }
            })
        },
        // 重置
        resetForm() {
            // 重置表单
            this.$refs.loginForm.resetFields()
        }
    }
}

</script>
<style lang="less">
    @import './login.less';
</style>