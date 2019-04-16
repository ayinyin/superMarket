<template>
    <div class="goodsadd">
        <!-- 卡片 -->
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>商品添加</span>
            </div>
            <el-form :model="goodsAddForm" status-icon :rules="rules" ref="goodsAddForm" label-width="100px" class="demo-ruleForm">
                <!-- 所属分类 -->
                <el-form-item label="所属分类" prop="classify" class="firstinput">
                    <el-select v-model="goodsAddForm.classify" placeholder=" - - 选择分类 - - ">
                        <el-option label="零食" value="零食"></el-option>
                        <el-option label="饮料" value="饮料"></el-option>
                        <el-option label="生活用品" value="生活用品"></el-option>
                        <el-option label="厨房用品" value="厨房用品"></el-option>
                        <el-option label="生鲜食品" value="生鲜食品"></el-option>
                    </el-select>
                </el-form-item>
                <!-- 商品条形码 -->
                <el-form-item label="商品条形码" prop="shapecode">
                    <el-input v-model="goodsAddForm.shapecode"> </el-input>
                    <el-button type="success" @click="createshapeCode">生成条形码</el-button>
                </el-form-item>
                <!-- 商品名称 -->
                <el-form-item label="商品名称" prop="shapename">
                    <el-input v-model="goodsAddForm.shapename"></el-input>
                </el-form-item>
                <!-- 商品售价 -->
                <el-form-item label="商品售价" prop="shapeprice">
                    <el-input v-model="goodsAddForm.shapeprice"></el-input>
                </el-form-item>
                <!-- 市场价 -->
                <el-form-item label="市场价" prop="marketprice">
                    <el-input v-model="goodsAddForm.marketprice"></el-input>元
                </el-form-item>
                <!-- 商品进价 -->
                <el-form-item label="商品进价" prop="purchaseprice">
                    <el-input v-model="goodsAddForm.purchaseprice"></el-input>元
                </el-form-item>
                <!-- 入库数量 -->
                <el-form-item label="入库数量" prop="warehousing">
                    <el-input v-model="goodsAddForm.warehousing"></el-input>
                </el-form-item>
                <!-- 商品重量 -->
                <el-form-item label="商品重量" prop="shapeweight">
                    <el-input v-model="goodsAddForm.shapeweight"></el-input>
                </el-form-item>
                <!-- 商品单位 -->
                <el-form-item label="商品单位" prop="shapemonad">
                    <el-select v-model="goodsAddForm.shapemonad">
                        <el-option label="个" value="个"></el-option>
                        <el-option label="盒" value="盒"></el-option>
                        <el-option label="件" value="件"></el-option>
                    </el-select>
                </el-form-item>
                <!-- 会员优惠 -->
                <el-form-item label="会员优惠" prop="favorable">
                    <el-radio-group v-model="goodsAddForm.favorable">
                        <el-radio label="0">享受</el-radio>
                        <el-radio label="1">不享受</el-radio>
                    </el-radio-group>
                </el-form-item>
                <!-- 是否促销 -->
                <el-form-item label="是否促销" prop="shapesales">
                    <el-radio-group v-model="goodsAddForm.shapesales">
                        <el-radio label="促销中~">启用</el-radio>
                        <el-radio label="未促销嗷~">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <!-- 商品简介 -->
                <el-form-item label="商品简介" prop="shapedesc">
                    <el-input type="textarea" v-model="goodsAddForm.shapedesc"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm()">添加</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>
<script>
// 引入随机数
import { createCode } from "@/utils/validator";

export default {
    data(){
        // 检测是否是字符串
        const isString = (rules,value,callback) =>{
             // 检测是否为空
            if(value === ""){
                callback(new Error("请输入商品名称嗷~"))
            } else if( !isNaN(value) ){
                callback(new Error("输入的名称不能是一个数字嗷~"))
            } else{
                callback();
            }
        }
        // 检测是否为数字
        const isNumber = (rules,value,callback) => {
            // 检测是否为空
            if(value === ""){
                callback(new Error("请输入商品价格嗷~"))
            } else if( isNaN(value) ){
                callback(new Error("输入的价格不是一个数字嗷~"))
            }
            else{
                callback();
            }
        }
        // 商品价格的验证
        const shapePrice = (rules,value,callback) => {
            // 检测是否为空
            if(value === ""){
                callback(new Error("请输入价格嗷~"))
            } else if( isNaN(value) ){
                callback(new Error("输入的价格不是一个数字嗷~"))
            } else{
                value = parseInt(value)
                let purchaseprice = 0;
                if(this.goodsAddForm.purchaseprice !== ""){
                    purchaseprice = parseInt(this.goodsAddForm.purchaseprice)
                }
                // 商品价格必须大于进价
                if(value <= purchaseprice ){
                    callback(new Error("输入价格必须大于进价!！"));
                }
                callback();
            }
        }
        // 进价
        const isNumberPrice = (rules,value,callback) => {
             // 检测是否为空
            if(value === ""){
                callback(new Error("请输入商品价格嗷~"))
            } else if( isNaN(value) ){
                callback(new Error("输入的价格不是一个数字嗷~"))
            }
            else{
                if(this.goodsAddForm.shapeprice !== "" || this.goodsAddForm.marketprice !== ""){
                    console.log(value,this.goodsAddForm.shapeprice,this.goodsAddForm.marketprice)
                    // 触发字段 --- 商品价格的验证 --- 触发只能写在一起不能分开

                    this.$refs.goodsAddForm.validateField("shapeprice");
                    this.$refs.goodsAddForm.validateField("marketprice");
                }
                callback();
            }
        }
        return {
            // 数据
            goodsAddForm:{
                classify:"",
                shapecode:"",
                shapename:"",
                shapeprice: "",
                marketprice:"",
                purchaseprice:"",
                warehousing:"",
                shapeweight:"",
                shapemonad:"",
                favorable:"0",
                shapesales:"未促销嗷~",
                shapedesc:""
            },
            rules:{
                classify:[
                    {required:true,message:"商品分类必须选择嗷~",trigger:"change"}
                ],
                // 条形码
                shapecode:[
                    {required:true,message:"必须生成条形码~",trigger:"change"}
                ],
                // 商品名称
                shapename:[
                    {required:true,validator:isString,trigger:"blur"}
                ],
                // 商品价格
                shapeprice:[
                    {required:true,validator:shapePrice,trigger:"blur"}
                ],
                // 市场价
                marketprice:[
                    {required:false,validator:shapePrice,trigger:"blur"}
                ],
                // 进价
                purchaseprice:[
                    {required:true,validator:isNumberPrice,trigger:"blur"}
                ],
                // 库存数量
                warehousing:[
                    {required:true,validator:isNumber,trigger:"blur"}
                ]
            }
        }
    },
    methods:{
        // 生成条形码
        createshapeCode(){
            let num =  createCode();
            this.goodsAddForm.shapecode = num;
        },
        // 表单登录
        submitForm(){
            this.$refs.goodsAddForm.validate(valid => {
                if(valid){
                    // 获取表单的数据
                    let formData = {
                        classify : this.goodsAddForm.classify,
                        shapecode : this.goodsAddForm.shapecode,
                        shapename : this.goodsAddForm.shapename,
                        shapeprice : this.goodsAddForm.shapeprice,
                        marketprice : this.goodsAddForm.marketprice || 0,
                        purchaseprice : this.goodsAddForm.purchaseprice || 0,
                        warehousing : this.goodsAddForm.warehousing || 0,
                        shapeweight : this.goodsAddForm.shapeweight || 0,
                        shapemonad : this.goodsAddForm.shapemonad,
                        favorable : this.goodsAddForm.favorable,
                        shapesales:this.goodsAddForm.shapesales,
                        shapedesc:this.goodsAddForm.shapedesc
                    }
                    // 发送请求
                    this.request.post("/goods/goodsadd",formData)
                        .then(data => {
                            if(data.code === 0){
                                alert(data.message)
                                this.$router.push("/home/goodsmanage");
                            }else {
                                alert(data.message)
                            }
                        })
                        .catch(err => {
                            console.log(err);
                        })
                }else {
                    console.log("数据没有填写完，不能提交")
                }
            })
        }
    }
}
</script>
<style lang="less">
    @import "./goodsadd.less";
</style>