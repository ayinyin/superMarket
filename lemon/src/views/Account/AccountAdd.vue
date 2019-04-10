<template>
    <div class="accountadd">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>添加管理员账号</span>
            </div>
            <!-- 登录表单 -->
           <el-form :model="AccountAddForm" status-icon :rules="rules" ref="AccountAddForm" label-width="100px" class="demo-ruleForm">
                <!-- 账号 -->
                <el-form-item label="账 号" prop="account">
                    <el-input type="text" v-model="AccountAddForm.account" autocomplete="off"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item label="密 码" prop="password">
                    <el-input type="text" v-model="AccountAddForm.password" autocomplete="off"></el-input>
                </el-form-item>
                <!-- 确认密码 -->
                <el-form-item label="确认密码" prop="checkPass">
                    <el-input type="text" v-model="AccountAddForm.checkPass" autocomplete="off"></el-input>
                </el-form-item>
                <!-- 选择用户组 -->
                <el-form-item label="用户组" prop="region">
                    <el-select v-model="AccountAddForm.region" placeholder="请选择用户组">
                        <el-option label="普通用户" value="普通用户"></el-option>
                        <el-option label="超级管理员" value="超级管理员"></el-option>
                    </el-select>
                </el-form-item>

                <!-- 提交按钮 -->
                <el-form-item>
                    <el-button type="primary" @click="submitForm()">提交</el-button>
                    <el-button @click="resetForm()">重置</el-button>
                </el-form-item>

            </el-form>
        </el-card>
    </div>
</template>
<script>
import { passwordReg } from "@/utils/validator";

export default {

    data () {
        // 验证密码
        const passwordcheck = (rules,value,callback) => {
            if (value === ""){
                callback(new Error("密码不能为空嗷~"))
            }else if( !passwordReg(value) ){
                callback(new Error("只能输入3-9个字母、数字、下划线~"));
            }else{
                if(this.AccountAddForm.checkPass !== ""){
                    this.$refs.AccountAddForm.validateField("checkPass")
                }
                callback();
            }
        }
        // 确认密码
        const comfirmPass = (rules,value,callback) => {
            if(value === ""){
                callback(new Error("确认密码不能为空嗷~"))
            }else if(value !== this.AccountAddForm.password){
                callback(new Error("两次密码输入不一致"));
            }else{
                callback();
            }
        }
        return {
            // 表单数据
            AccountAddForm: {
                account: '', 
                password: '',
                checkPass: '',
                region:''
            },
            options: [
                { value:"选项1",label :"普通用户" },
                { value:"选项2",label :"超级用户" }
            ],
            value :"",
            // 验证规则
            rules: {
                // 账号
                account: [ 
                    {required:true,message:"请输入账号",trigger:"blur"},
                    {min:3,max:6,message:"长度在3-6位之间嗷~",trigger:"blur"}
                ],
                // 密码
                password: [ 
                    {required:true,validator:passwordcheck,trigger:"blur"}
                ],
                // 确认密码
                checkPass: [
                    {required:true,validator:comfirmPass,trigger:"blur"}
                ],
                // 选择区域
                region:[
                    {required:true,message:"请选择用户组",trigger:"change"}
                ]
            }
        }
    },
    methods: {
        // 提交
        submitForm() {
            // 验证AccountAddForm对象
            this.$refs.AccountAddForm.validate(valid => { 
                // 如果所有的前端验证通过
                if(valid){
                    let user = {
                        account : this.AccountAddForm.account,
                        password:this.AccountAddForm.password,
                        region:this.AccountAddForm.region
                    }
                    alert("添加用户成功，请到账号管理查看");
                    this.$router.push("/home/accountmanage")
                }
            })
        },
        // 重置
        resetForm() {
            // 重置表单
            this.$refs.AccountAddForm.resetFields()
        }
    }
}


</script>
<style lang="less">
    .accountadd{
        .el-form-item{
            .el-form-item__content{
                width: 400px;
            }
        }
    }
</style>
