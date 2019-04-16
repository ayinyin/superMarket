<template>
    <div class="saleslist">
        <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span>销售列表</span>
        </div>
        <!-- 修改框
        <el-dialog title="修改商品信息" :visible.sync="dialogFormVisible" width="30%">
            <el-form ref="editform" :rules="rules" :model="editform">
            <el-form-item label="商品名称" label-width="25%" prop="shapename">
                <el-input v-model="editform.shapename" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="所属分类" label-width="25%">
                <el-select v-model="editform.classify" prop="classify" placeholder=" - - 选择分类 - - ">
                <el-option label="零食" value="零食"></el-option>
                <el-option label="饮料" value="饮料"></el-option>
                <el-option label="生活用品" value="生活用品"></el-option>
                <el-option label="厨房用品" value="厨房用品"></el-option>
                <el-option label="生鲜食品" value="生鲜食品"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="售价(元)" prop="shapeprice" label-width="25%">
                <el-input v-model="editform.shapeprice" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="市场价(元)" label-width="25%" prop="marketprice">
                <el-input v-model="editform.marketprice" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="促销(元)" label-width="25%">
                <el-radio-group v-model="editform.shapesales">
                <el-radio label="促销中~">启用</el-radio>
                <el-radio label="未促销嗷~">禁用</el-radio>
                </el-radio-group>
            </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="editData">确 定</el-button>
            </div>
        </el-dialog> -->
        <!-- 查询
        <el-form :inline="true" :model="formInline" class="demo-form-inline" style="height:52px">
            <el-form-item label="选择分类">
            <el-select
                v-model="formInline.classtype"
                placeholder=" - - 请选择分类 - - "
                style="width:200px"
            >
                <el-option label="所有分类" value="所有分类"></el-option>
                <el-option label="零食" value="零食"></el-option>
                <el-option label="饮料" value="饮料"></el-option>
                <el-option label="生活用品" value="生活用品"></el-option>
                <el-option label="厨房用品" value="厨房用品"></el-option>
                <el-option label="生鲜食品" value="生鲜食品"></el-option>
            </el-select>
            <el-form-item label="关键字：" style="margin-left:20px;">
                <el-input v-model="formInline.shapemsg" placeholder="商品名称，条形码" style="width:250px"></el-input>
            </el-form-item>
            </el-form-item>
            <el-form-item>
            <el-button type="primary" @click="onSelect">查询</el-button>
            </el-form-item>
        </el-form> -->

        <!-- 表格 -->
        <el-table ref="Salestabel" :data="Salestabel" tooltip-effect="dark" style="width: 100%" >
            <!-- 订单号 -->
            <el-table-column label="订单号" width="300" prop="shapecode"></el-table-column>
            <!-- 商品名称 -->
            <el-table-column label="商品名称" width="300" prop="shapename"></el-table-column>
            <!-- 销售数量 -->
            <el-table-column label="销售数量" width="200" prop="sold"></el-table-column>
            <!-- 售价(元) -->
            <el-table-column label="售价(元)" width="200" prop="shapeprice"></el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            style="margin-top:20px"
        ></el-pagination>
        <!-- 批量删除和取消全选
        <div style="margin-top: 20px">
            <el-button type="danger" @click="batchDelete">批量删除</el-button>
            <el-button type="primary" @click="toggleSelection()">取消选择</el-button>
        </div> -->
    </el-card>
    </div>
</template>
<script>
export default {
  data() {
    return {
      Salestabel: [],
      // 分页
      // 总页数
      total: 11,
      // 当前页
      currentPage: 1,
      // 每页显示的数量
      pageSize: 5,
    };
  },
  methods: {
    // 加载页面 --- 触发页面
    SalesReq() {
      // 接收参数
      let pamars = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
      };
      this.request.get("/shipping/shippinglist",pamars)
        .then(res => {
          // 接收参数
          let {total,data} = res;
          this.Salestabel = data;
          this.total = total;
          if(this.Salestabel.length === 0){
            this.currentPage -= 1;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 每页的条数变化
    handleSizeChange(val) {
      this.pageSize = val;
      this.SalesReq();
    },
    // 当前页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.SalesReq();
    },
  },
  // uve生命周期
  created() {
    // 页面请求
    this.SalesReq();
  }
}
</script>
<style lang="less">

</style>