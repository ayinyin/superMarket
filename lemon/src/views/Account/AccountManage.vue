<template>
    <div class="accountmanage">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>卡片名称</span>
            </div>
            <el-table
                ref="multipleTable"
                :data="Accounttabel"
                tooltip-effect="dark"
                style="width: 100%">
                    <!-- 复选框 -->
                    <el-table-column
                    type="selection"
                    width="60">
                    </el-table-column>
                    <!-- 用户名 -->
                    <el-table-column
                    label="用户名"
                    width="200"
                    prop="username">
                    </el-table-column>
                    <!-- 用户组 -->
                    <el-table-column
                    prop="usergroup"
                    label="用户组"
                    width="300">
                    </el-table-column>
                    <!-- 操作列 -->
                    <el-table-column
                    label="操作"
                    show-overflow-tooltip
                    >
                        <el-button type="primary" icon="el-icon-edit">修改</el-button>
                        <el-button type="danger" icon="el-icon-delete">删除</el-button>
                    </el-table-column>
            </el-table>
            <el-pagination
                :current-page="currentPage4"
                :page-sizes="[5, 10, 15, 20]"
                :page-size="5"
                layout="total, sizes, prev, pager, next, jumper"
                :total="112">
            </el-pagination>
        </el-card>
    </div>
</template>
<script>
export default {
    data(){
        return {
            Accounttabel:[
                {
                username:"张三",
                usergroup:"超级管理员"
                },
                {
                username:"张二",
                usergroup:"普通用户"
                },
                {
                username:"李四",
                usergroup:"普通用户"
                },
                {
                username:"李五",
                usergroup:"普通用户"
                },
            ],
            currentPage4:4
        }
    },
    methods:{
        handleSelectionChange(){
            
        }
    }
}
</script>
<style lang="less">
.accountmanage{
    
    .el-button{
        width: 80px;
        padding: 10px;
    }
    .el-pagination{
        margin-top: 20px;
    }
}
</style>