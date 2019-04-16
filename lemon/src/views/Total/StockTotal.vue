<template>
    <div class="stocktotal">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>进货统计</span>
            </div>
            <el-form :inline="true" :model="selectfrom"  class="demo-form-inline">
                <el-form-item label="时间：">
                    <el-date-picker
                        type="daterange"
                        v-model="selectfrom.ctime"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">查询</el-button>
                </el-form-item>
            </el-form>
            <div id="box" style="height:400px;"></div>
        </el-card>
    </div>
</template>
<script>
export default {
    // data(){
    //     return {
    //         selectfrom:{
    //             ctime:''
    //         },

    //     }
    // },
    // methods:{
    //     // 提交按钮
    //     onSubmit(){

    //     }
    // }
    data(){
        return {
            selectfrom:{
                ctime:[],
                region:''
            }
        }
    },
    methods:{
        // 提交按钮
        onSubmit(){
            if(this.selectfrom.ctime === "" && this.selectfrom.region === ""){
                this.$message.error("请选择再操作嗷~");
            }else{
                 //   获取数据
                /*let params = {
                    ctime:this.selectfrom.ctime,
                    region:this.selectfrom.region
                }
                    let starttime = params.ctime[0];
                    let endtime = params.ctime[1];
                    let total = dateSplit(starttime,endtime);*/
                // 发送请求
                this.request.get('/total/stockTotal')
                    .then(res => {
                        // let warehousing =[];
                        // 数组
                        console.log(1111)
                        console.log(res)
                        // 遍历总的
                        // this.EcahrtsFn(total,sold);
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }
           
        },
        // 报表函数
        EcahrtsFn(XaxisData,SeriesData){
             // 初始化
            let mycharts = this.echarts.init(document.getElementById('box'))
            // 写配置
            let option ={
                title: {
                    text: '销售报表'
                },
                tooltip: {},
                legend: {
                    data:['销量']
                },
                xAxis: {
                    data: XaxisData
                },
                yAxis: {},
                series: [{
                    name: '销量',
                    type: 'line',
                    data: SeriesData
                }]
            }
            // 使用配置生成报表
            mycharts.setOption(option);
        },
        // 获取数据
        forData(obj){
            let shapenamearr = [];
            let warehousingarr = [];
            for(const item in obj){
                shapenamearr.push(obj[item].shapename);
                warehousingarr.push(obj[item].warehousing)
            }
            return [shapenamearr,warehousingarr];
        },
        stockTotalFn(){
            this.request.get('/total/stockTotal')
                    .then(res => {
                        // let warehousing =[];
                        // 数组
                        console.log(this.forData(res))
                        let X =  this.forData(res)[0];
                        let Y =  this.forData(res)[1];
                        // 遍历总的
                        // console.log(X,Y)
                        this.EcahrtsFn(X,Y);
                    })
                    .catch(err => {
                        console.log(err);
                    })
        }
    },
    // 还没有渲染的时候
    created(){
        // this.stockTotalFn();
    },
    mounted(){
        this.stockTotalFn();
        // this.request.get('/total/stockTotal')
        //     .then(res => {
        //         let arr = res.data;
        //         let XdataArr = []
        //         let LinedataArr = [];
        //         for (const item in arr) {
        //             XdataArr.push(arr[item].shapename)
        //             LinedataArr.push(arr[item].sold)
        //         }
        //         this.EcahrtsFn(XdataArr,LinedataArr);
        //     })
        //     .catch(err => {
        //         console.log(err);
        //     })  
       
    }
}
</script>
<style lang="less">

</style>
