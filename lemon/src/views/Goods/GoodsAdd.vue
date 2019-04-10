<template>
    <div class="goodsadd">
        <!-- 卡片 -->
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>商品添加</span>
            </div>
            <el-form :model="goodsAddForm" status-icon :rules="rules" ref="goodsAddForm" label-width="100px" class="demo-ruleForm">
                <!-- 所属分类 -->
                <el-form-item label="所属分类" prop="classify" class="firstinput" style="width:200px;">
                    <el-select v-model="goodsAddForm.classify" placeholder=" - - 选择分类 - - ">
                        <el-option label="零食" value="snack"></el-option>
                        <el-option label="饮料" value="drink"></el-option>
                        <el-option label="生活用品" value="daily"></el-option>
                        <el-option label="厨房用品" value="kitchenware"></el-option>
                        <el-option label="生鲜食品" value="freshfoods"></el-option>
                    </el-select>
                </el-form-item>
                <!-- 商品条形码 -->
                <el-form-item label="商品条形码" prop="shapecode">
                    <el-input v-model="goodsAddForm.shapecode"></el-input>
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
                <el-form-item label="入库数量" prop="storagenum">
                    <el-input v-model="goodsAddForm.storagenum"></el-input>
                </el-form-item>
                <!-- 商品重量 -->
                <el-form-item label="商品重量" prop="shapeweight">
                    <el-input v-model="goodsAddForm.shapeweight"></el-input>
                </el-form-item>
                <!-- 商品单位 -->
                <el-form-item label="商品单位" prop="shapemonad">
                    <el-input v-model="goodsAddForm.shapemonad"></el-input>
                </el-form-item>
                <!-- 会员优惠 -->
                <el-form-item label="会员优惠" prop="favorable">
                    <el-radio-group v-model="goodsAddForm.favorable">
                    <el-radio label="享受"></el-radio>
                    <el-radio label="不享受"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <!-- 是否促销 -->
                <el-form-item label="是否促销" prop="shapesales">
                    <el-radio-group v-model="goodsAddForm.shapesales">
                    <el-radio label="启用"></el-radio>
                    <el-radio label="禁用"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <!-- 商品简介 -->
                <el-form-item label="商品简介" prop="desc">
                    <el-input type="textarea" v-model="goodsAddForm.desc"></el-input>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>
<script>
// 引入随机数
import { createCode } from "@/utils/validator"

export default {
    data(){
        return {
            // 数据
            goodsAddForm:{
                classify:"",
                shapecode:"",
                shapename:"",
                shapeprice:"",
                marketprice:"",
                purchaseprice:"",
                storagenum:"",
                shapeweight:"",
                shapemonad:"",
                favorable:"",
                shapesales:"",
                desc:""
            },
            rules:{
                classify:[
                    {required:true,message:"",trigger:"blur"}
                ],
                shapecode:[
                    {required:true,message:"",trigger:"blur"}
                ],
                shapename:[
                    {required:true,message:"",trigger:"blur"}
                ],
                shapeprice:[
                    {required:true,message:"",trigger:"blur"}
                ],
                marketprice:[
                    {required:true,message:"",trigger:"blur"}
                ],
                purchaseprice:[
                    {required:true,message:"",trigger:"blur"}
                ],
                storagenum:[
                    {required:true,message:"",trigger:"blur"}
                ],
                shapeweight:[
                    {required:true,message:"",trigger:"blur"}
                ],
                shapemonad:[
                    {required:true,message:"",trigger:"blur"}
                ],
                favorable:[
                    {required:true,message:"",trigger:"blur"}
                ],
                shapesales:[
                    {required:true,message:"",trigger:"blur"}
                ],
                desc:[
                    {required:true,message:"",trigger:"blur"}
                ]
            }
        }
    },
    methods:{
        // 生成条形码
        createshapeCode(){
            let num =  createCode();
            this.goodsAddForm.shapecode = num;
        }
    }
}
</script>
<style lang="less">
    .goodsadd{
        .el-form{
            .el-form-item{
                &:first-child{
                    .el-form-item__content{
                        .el-input{
                            width: 200px;
                        }
                    }
                }
                .el-form-item__content{ 
                    width: 500px;
                    .el-input{
                        width: 300px;
                    }
                    .el-button{
                        margin-left: 10px;
                    }
                }
            }
        }
        
    }
</style>