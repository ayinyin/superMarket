<template>
    <div class="goodsoutstock">
        <!-- 卡片 -->
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>商品出库</span>
            </div>
            <el-form
                :model="OrderaddedForm"
                status-icon
                :rules="rules1"
                ref="OrderaddedForm"
                label-width="100px"
                class="demo-ruleForm"
            >
                <!-- 条形码 -->
                <el-form-item label="条形码" prop="shapecode">
                <el-input type="text" v-model="OrderaddedForm.shapecode" autocomplete="off"></el-input>
                </el-form-item>
                <!-- 数量 -->
                <el-form-item label="数量" prop="sold">
                <el-input type="text" v-model="OrderaddedForm.sold" autocomplete="off"></el-input>
                </el-form-item>
                <!-- 提交按钮 -->
                <el-form-item>
                <el-button type="primary" @click="Orderadded()">加入订单</el-button>
                <el-button type="text" @click="resetForm()">重新出库</el-button>
                </el-form-item>
            </el-form>
            <div style="border-top:3px solid #f1f1f1;border-bottom:3px solid #f1f1f1;padding:15px 15px 20px;">
                <!-- 表格数据 -->
                <el-table
                    ref="Ordertabel"
                    :data="Ordertabel"
                    tooltip-effect="dark"
                    style="width: 100%"
                >
                    <!-- 名称 -->
                    <el-table-column label="名称" width="120" prop="shapename"></el-table-column>
                    <!-- 数量 -->
                    <el-table-column prop="sold" label="数量" width="200"></el-table-column>
                    <!-- 单价(元) -->
                    <el-table-column prop="shapeprice" label="单价(元)" width="200"></el-table-column>
                    <!-- 总价(元) -->
                    <el-table-column prop="markettotal" label="总价(元)" width="200"></el-table-column>
                    <!-- 优惠总价(元) -->
                    <el-table-column prop="Preferentialprice" label="优惠总价(元)" width="200"></el-table-column>
                </el-table>
                <p style="margin-top:20px;">总价：元，优惠：元。<span style="color:red;">小计：元</span> </p>
            </div>
           <el-form
                :model="ReceivingForm"
                status-icon
                :rules="rules2"
                ref="ReceivingForm"
                label-width="100px"
                class="demo-ruleForm"
                style="margin-top:15px"
            >
                <!-- 会员卡号： -->
                <el-form-item label="会员卡号：" prop="admincardnum">
                <el-input type="text" v-model="ReceivingForm.admincardnum" autocomplete="off"></el-input>
                </el-form-item>
                <!-- 提交按钮 -->
                <el-form-item>
                <el-button type="primary" @click="placeorder()">确认提交</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>
<script>
export default {
    data(){
        // 条形码的验证
        const shapeCode = (rules,value,callback) => {
            // 检测是否为空
            if(value === ""){
                callback(new Error("请输入内容嗷~"))
            } else if( isNaN(value) ){
                callback(new Error("输入的不是一个数字嗷~"))
            } else{
                this.request.get('/shipping/checkshapecode',{value})
                    .then(res => {
                        let {code,message} = res;
                        if(code === 0){
                            callback();
                        }else{
                            callback(new Error(message))
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        }
        // 数量的验证
        const shapePrice = (rules,value,callback) => {
            // 检测是否为空
            if(value === ""){
                callback(new Error("请输入内容嗷~"))
            } else if( isNaN(value) ){
                callback(new Error("输入的不是一个数字嗷~"))
            } else{
                let shapenum = this.OrderaddedForm.shapecode;
                this.request.get('/shipping/checkstorngnum',{value,shapenum})
                    .then(res => {
                        let {code,message} = res;
                        if(code === 0){
                            callback();
                        }else{
                            callback(new Error(message)) 
                        }   
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        }
        // 会员卡号
        const isNumber = (rules,value,callback) => {
            // 检测是否为空
            if(value === ""){
                callback(new Error("请输入内容嗷~"))
            } else if( isNaN(value) ){
                callback(new Error("输入的不是一个数字嗷~"))
            } else{
                /* let shapenum = this.OrderaddedForm.shapecode;
                    this.request.get('/shipping/checkstorngnum',{value,shapenum})
                    .then(res => {
                        let {code,message} = res;
                        if(code === 0){
                            callback();
                        }else{
                            callback(new Error(message)) 
                        }   
                    })
                    .catch(err => {
                        console.log(err)
                    })*/
                callback();
            }
        }
        return{
            // 加入订单表单
            OrderaddedForm:{
                shapecode:'',
                sold:''
            },

            rules1:{
                // 条形码
                shapecode:[
                    {required:true,validator:shapeCode,trigger:"blur"}
                ],
                sold:[
                    {required:true,validator:shapePrice,trigger:"blur"}
                ]
            },
            rules2:{
                admincardnum:[
                    {required:true,validator:isNumber,trigger:"blur"}
                ]
            },
            // 表格
            Ordertabel:[],
            // 会员卡号
            ReceivingForm:{
                admincardnum:''
            }
        }
    },
    methods:{
        // 加入订单
        Orderadded(){
            this.$refs.OrderaddedForm.validate(valid => {
                if(valid){
                    // 收集数据
                    let params = {
                        shapecode:this.OrderaddedForm.shapecode,
                        sold:this.OrderaddedForm.sold
                    }
                    // 发送请求
                    this.request.post('/shipping/OrderaddedData',params)
                        .then(res => {
                            let {shapecode,sold} = res;
                            let shapecodeArr = this.GetShapeArr();
                            let index = shapecodeArr.indexOf(res.shapecode);
                            console.log(index)
                            if(index !== -1){
                                this.Ordertabel[index].sold += res.sold;
                                // console.log(this.Ordertabel[index].sold)
                            }else{
                                // 渲染
                                this.Ordertabel.push(res);
                            }
                            this.enquiryGoods();
                        })
                        .catch(err => {
                            console.log(err)
                        })
                }else{
                    this.$message.error("请输入数据再操作~")
                }
            })
            
        },
        // 确认提交
        placeorder(){
            this.$refs.ReceivingForm.validate(valid => {
                if(valid){
                    let shapecode = this.GetShapeArr()
                    let sold = this.OrdertabelData()
                    // 接收参数
                    let params = { shapecode,sold }
                    console.log(params)
                    // 发送请求
                    this.request.get('/shipping/placeorderData',params)
                        .then(res => {
                            let {code,message} = res;
                            if(code === 0){
                                this.$message({
                                    type:"success",
                                    message
                                })
                                // 跳转到销售
                                this.$router.push('/home/saleslist');
                            }
                        })
                        .catch(err => {
                            console.log(err);
                        })
                }
            })
        },
        // 重置
        resetForm() {
            // 重置表单
            this.$refs.OrderaddedForm.resetFields();
        },
        // 这是一个计算总额的函数
        enquiryGoods() {
            for (const item in this.Ordertabel) {
                // this.Ordertabel[item].storagetotal = this.Ordertabel[item].storagetotal || 0;
                // 销售总额 = 库存 * 售价
                this.Ordertabel[item].markettotal =
                this.Ordertabel[item].sold * this.Ordertabel[item].shapeprice;
                // 商品库存总额 = 库存  *  进价
                this.Ordertabel[item].Preferentialprice =
                this.Ordertabel[item].markettotal * 1;
            }
        },
        // 获取表格中的商品条形码
        GetShapeArr(){
            // 存条形码
            let shapecodeArr = [];
            if(this.Ordertabel.length === 0){
                return [];
            }else{
                for(const item in this.Ordertabel){
                    shapecodeArr.push(this.Ordertabel[item].shapecode);
                }
                return shapecodeArr;
            }
        },
        // 获取表格中的s数量
        OrdertabelData(){
            // 存条形码
            let soldArr = [];
            if(this.Ordertabel.length === 0){
                return [];
            }else{
                for(const item in this.Ordertabel){
                    soldArr.push(this.Ordertabel[item].sold);
                }
                return soldArr;
            }
        }
    }
}
</script>
<style lang="less">
.goodsoutstock{
    .el-form{
        .el-form-item{
            .el-form-item__content{
                .el-input{
                    width: 200px;
                }
            }
        }
    }
    
}
</style>