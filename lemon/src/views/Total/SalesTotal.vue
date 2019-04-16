<template>
    <div class="salestotal">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>销售统计</span>
            </div>
            <el-form :inline="true" :model="selectfrom"  class="demo-form-inline">
                <el-form-item label="时间：">
                    <el-date-picker
                        type="daterange"
                        v-model="selectfrom.ctime"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item >
                    <el-select v-model="selectfrom.region"  placeholder=" - - 请选择 - - ">
                        <el-option label="销售情况统计" value="销售情况统计"></el-option>
                        <el-option label="库存统计" value="库存"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">查询</el-button>
                </el-form-item>
            </el-form>
            <div id="box" style="height:400px;">
            </div>
        </el-card>
    </div>
</template>
<script>
// 引入时间处理函数
import { dateSplit } from "@/utils/Datesplit"
export default {
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
            if(this.selectfrom.ctime.length === 0 && this.selectfrom.region === ""){
                this.$message.error("请选择再操作嗷~");
            }else{
                 //   获取数据
                let params = {
                    ctime:this.selectfrom.ctime,
                    // region:this.selectfrom.region
                }
                    let starttime = params.ctime[0];
                    let endtime = params.ctime[1];
                    let total = dateSplit(starttime,endtime);
                // 发送请求
                this.request.get('/total/datasalesTotal',params)
                    .then(res => {
                        let sold =[];
                        // 数组
                        let datatime = this.forData(res)[0];
                        let region = this.forData(res)[1];
                        // 遍历总的
                        let flag = 0;
                        for(let i = 0;i < total.length;i++){
                            // 有的话
                            // console.log(i,datatime.indexOf(total[i]) !== -1)
                            if(datatime.indexOf(total[i]) !== -1){
                                // 数组.indexOf(值)
                                let index = datatime.indexOf(total[i]);
                                // 添加进
                                let item = sold[i - 1];
                                if(flag !== 0 ){
                                    item += region[index];
                                    sold.push(item);
                                }else{
                                    sold.push(region[index]);
                                }
                                // 移除元素
                                datatime.splice(index, 1);
                                region.splice(index, 1);
                                // 再次检索
                                i--;
                                flag++;
                            }else {
                                if(flag === 0){
                                    sold.push(0);
                                }
                                flag=0;
                            }
                            
                        }
                        
                        this.EcahrtsFn(total,sold);
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
            let timearr = [];
            let soldarr = [];
            for(const item in obj){
                timearr.push(obj[item].ctime.substr(0,10))
                soldarr.push(obj[item].sold)
            }
            return [timearr,soldarr];
        }
    },
    // 还没有渲染的时候
    created(){
        // this.requestData();
              
    },
    mounted(){
        this.request.get('/total/salestotal')
            .then(res => {
                let arr = res.data;
                let XdataArr = []
                let LinedataArr = [];
                for (const item in arr) {
                    XdataArr.push(arr[item].shapename)
                    LinedataArr.push(arr[item].sold)
                }
                this.EcahrtsFn(XdataArr,LinedataArr);
            })
            .catch(err => {
                console.log(err);
            })  
       
    }
}
</script>
<style lang="less">
.salestotal{
    .el-card{
        .el-card__header{
            background-color: #f1f1f1;
        }
    }
}

</style>
//   requestData(){
//             return this.request.get('/total/salestotal')
//                     .then(res => {
//                         // 接收数据
//                         let arr = res.data;
//                         let XdataArr = []
//                         let LinedataArr = [];
//                         for (const item in arr) {
//                             XdataArr.push(arr[item].shapename)
//                             LinedataArr.push(arr[item].sold)
//                         }
//                         this.Mycharts.Xdata = XdataArr;
//                         this.Mycharts.linedata = LinedataArr;
//                         console.log(this.Mycharts.Xdata,this.Mycharts.linedata)
                        
//                     })
//                     .catch(err => {
//                         console.log(err);
//                     })  
//         }