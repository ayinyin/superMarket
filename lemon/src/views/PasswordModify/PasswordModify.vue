<template>
    <div class="passwordmodify">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>添加管理员账号</span>
            </div>
            <!-- 登录表单 -->
           <el-form :model="passwordForm" status-icon :rules="rules" ref="passwordForm" label-width="100px" class="demo-ruleForm">
                <!-- 旧密码 -->
                <el-form-item label="旧密码" prop="oldpassword">
                    <el-input type="text" v-model="passwordForm.oldpassword" autocomplete="off"></el-input>
                </el-form-item>
                
                <!-- 新密码 -->
                <el-form-item label="新密码" prop="newpassword">
                    <el-input type="text" v-model="passwordForm.newpassword" autocomplete="off"></el-input>
                </el-form-item>

                <!-- 确认新密码 -->
                <el-form-item label="确认新密码" prop="checknewPass">
                    <el-input type="text" v-model="passwordForm.checknewPass" autocomplete="off"></el-input>
                </el-form-item>
                <!-- 提交按钮 -->
                <el-form-item>
                    <el-button type="primary" @click="submitForm()">修改</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>
<script>
// 引入验证函数
import { passwordReg } from "@/utils/validator"
// local 
import local from "@/utils/local"
export default {
    data(){
        // 旧密码
        const oldpasscheck = (rules,value,callback) => {
            if(value === ""){
                callback(new Error("请输入密码！"))
            }else{
                // local验证
                // if(local.get('a_ying') === value){
                //     callback();
                // } else{
                //     callback(new Error("与原密码不一致！"))
                // }
                // 发送表单
                this.request.get('/account/chackoldpass', { password : value })
                    .then(res => {
                        console.log(res)
                        // 解构
                        let {code,message} = res;
                        if(code === 0){
                            callback();
                        }else{
                            callback(new Error(message))
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    })

            }
            

        }
        // 新密码验证
        const newpasscheck = (rules,value,callback) => {
            if(value === ""){
                callback(new Error("新密码不能为空嗷~"))
            }else if(!passwordReg(value)){
                callback(new Error("密码必须是字母或者是数字，3-9位嗷~"))
            }else{
                if(this.passwordForm.checknewPass !== ""){
                    // 获取表单，调用验证字段
                    this.$refs.passwordForm.validateField("checknewPass");
                }
                callback();
            }
        }
        // 二次输入验证
        const confirmpass = (rules,value,callback) => {
              if(value === ""){
                  callback(new Error("请输入新密码~"))
              }else if(value !== this.passwordForm.newpassword){
                  callback(new Error("两次密码输入不一致~"))
              }else{
                  callback()
              }
        }
        return {
            passwordForm:{
                oldpassword:'',
                newpassword:'',
                checknewPass:''
            },
            rules:{
                // 旧密码的验证
                oldpassword:[
                    {required:true,validator:oldpasscheck,trigger:"blur"}
                ],
                // 新密码的验证
                newpassword:[
                    {required:true,validator:newpasscheck,trigger:"blur"}
                ],
                // 验证两次输入是否一样
                checknewPass:[
                    {required:true,validator:confirmpass,trigger:"blur"}
                ]
            }
        }
    },
    methods:{
        submitForm(){
            // 获取表单，调用validate方法 ---- valid参数：如果验证都通过为true
            this.$refs.passwordForm.validate(valid => {
                if(valid) {
                    // 收集数据
                    let params = {
                        newpassword:this.passwordForm.newpassword
                    }
                    this.request.post('/account/modifyPass',params)
                        .then(res => {
                            console.log(res)
                            // 解构
                            let {code,message} = res;
                            if(code === 0){
                                this.$message({
                                    type:"success",
                                    message
                                })
                                local.remove("a_yin_yin_na");
                                // 设置路由地址 --- 跳转
                                this.$router.push("/home/accountmanage");
                            }else{
                                this.$message.error(message);
                            }
                        })
                        .catch(err => {
                            console.log(err);
                        })
                }
            })
        }
    }
}
</script>
<style lang="less">
    .passwordmodify{
        .el-form-item{
            .el-form-item__content{
                width: 400px;
            }
        }
    }
</style>