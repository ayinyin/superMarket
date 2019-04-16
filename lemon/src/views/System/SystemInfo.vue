<template>
    <div class="systeminfo">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
            <span>系统信息</span>
        </div>
        <el-alert
            title="商品总数：5，已经销售的总金额：899.00，库存商品总价：123.5"
            type="success">
        </el-alert>
        <el-alert
            title=""
            type="success"
            :closable="false">
            <el-button size="mini" type="text" style="font-size:12px;">导入数据</el-button>
        </el-alert>
        <el-row>
            <el-col :span="11">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>销售排行</span>
                    </div>
                    <el-table
                    :data="shapeTable"
                    style="width: 100%">
                    <el-table-column
                        prop="name"
                        label="商品名称"
                        width="300">
                    </el-table-column>
                    <el-table-column
                        prop="address"
                        label="销量">
                    </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
            <el-col :span="11">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>缺货的商品</span>
                    </div>
                    <el-table :data="SoldTable" style="width: 100%">
                        <el-table-column prop="name" label="商品名称" width="300"></el-table-column>
                        <el-table-column prop="address" label="销量">
                        </el-table-column>
                        <el-table-column label="操作" show-overflow-tooltip>
                            <!-- 注意，需要使用slot-scope属性绑定数据的时候，需要使用模板template加在上面 -->
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" @click="amend(scope.row.id) ">入库</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
        </el-row>
        </el-card>
    </div>
</template>
<script>
export default {
    data(){
        return{
            shapeTable:[],
            SoldTable:[]
        }
    }
}
</script>
<style lang="less">
.systeminfo{
    .el-card{
        .el-alert{
            margin: 10px 0;
        }
        .el-row{
            .el-col{
                margin: 10px 20px;
            }
        }
    }
}
</style>