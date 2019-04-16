<template>
    <div class="inventoryadd">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>商品入库</span>
            </div>
            <!-- 表单 -->
            <el-form :model="inventoryFrom" status-icon :rules="rules" ref="inventoryFrom" label-width="100px" class="demo-ruleForm">
                <el-form-item label="商品条形码" prop="shapecode">
                    <el-input type="text" v-model="inventoryFrom.shapecode" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="数量" prop="warehousing">
                    <el-input type="text" v-model="inventoryFrom.warehousing" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="进价" prop="purchaseprice">
                    <el-input v-model.number="inventoryFrom.purchaseprice" style="width:100px;"></el-input>元
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm()">入库</el-button>
                    <el-button @click="resetForm()">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>
<script>
// 引入随机数
import { createCode } from '@/utils/validator';

export default {
    data(){
        // 检测是否为数字
        const isNumber = (rules,value,callback) => {
            // 检测是否为空
            if(value === ""){
                callback(new Error("必须这一项嗷~"))
            } else if( isNaN(value) ){
                callback(new Error("输入的不是一个数字嗷~"))
            }
            else{
                callback();
            }
        }
        return {
            inventoryFrom:{
                shapecode:'',
                warehousing:'',
                purchaseprice:'',
            },
            rules:{
                // 条形码
                shapecode:[
                    {required:true,validator:isNumber,trigger:"blur"}
                ],
                // 库存数量
                warehousing:[
                    {required:true,validator:isNumber,trigger:"blur"}
                ],
                // 进价
                purchaseprice:[
                    {required:true,validator:isNumber,trigger:"blur"}
                ],
            }
        }
    },
    methods:{
        // 表单提交
        submitForm(){
            // 验证通过提交数据
            this.$refs.inventoryFrom.validate(valid => {
                if(valid){
                    // 收集数据
                    let formData = {
                        shapecode : this.inventoryFrom.shapecode,
                        warehousing : this.inventoryFrom.warehousing,
                        purchaseprice : this.inventoryFrom.purchaseprice
                    }
                    // 发送请求
                    this.request.post('/inventory/inventoryadd',formData)
                        .then(res => {
                            // 接收数据
                            let {code,message} = res;
                            if(code === 0){
                                this.$message({
                                    type:"success",
                                    message
                                })
                                // 跳转
                                this.$router.push('/home/inventorymanage')
                            }else{
                                this.$message.error(message)
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
.inventoryadd{
    .el-input{
        width: 200px;
        margin-right:10px;
    }
}
</style>