<template>
  <div class="inventorymanage">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>库存管理</span>
      </div>
      <!-- 查询 -->
      <el-form :inline="true" :model="formInline" class="demo-form-inline" style="height:52px">
        <el-form-item label="选择分类">
          <el-select
            v-model="formInline.classtype"
            placeholder=" - - 请选择分类 - - "
            style="width:200px"
          >
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
      </el-form>
      <!-- 表格 -->
      <el-table
        ref="multipleTable"
        :data="Inventorytabel"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <!-- 复选框 -->
        <el-table-column type="selection" width="60"></el-table-column>
        <!-- 商品条形码 -->
        <el-table-column label="商品条形码" width="120" prop="shapecode"></el-table-column>
        <!-- 商品名称 -->
        <el-table-column label="商品名称" width="100" prop="shapename"></el-table-column>
        <!-- 所属分类 -->
        <el-table-column label="所属分类" width="100" prop="classify"></el-table-column>
        <!-- 进价 -->
        <el-table-column label="进价" width="100" prop="purchaseprice"></el-table-column>
        <!-- 入库 -->
        <el-table-column label="入库" width="100" prop="warehousing"></el-table-column>
        <!-- 库存 -->
        <el-table-column label="库存" width="100" prop="storagenum"></el-table-column>
        <!-- 已售 -->
        <el-table-column label="已售" width="100" prop="sold"></el-table-column>
        <!-- 操作列 -->
        <el-table-column label="操作" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="amend(scope.row.id) "></el-button>
            <el-button type="danger" icon="el-icon-delete" @click="delte(scope.row.id)"></el-button>
          </template>
        </el-table-column>
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
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 查询表单的数据
      formInline: {
        classtype: "",
        shapemsg: ""
      },
      // 表格的数据
      Inventorytabel: [],
      // 分页
      // 总页数
      total: 11,
      // 当前页
      currentPage: 1,
      // 每页显示的数量
      pageSize: 5
    };
  },
  methods: {
    // 页面刷新
    InventoryReq() {
        // 接收参数
        let pamars = {
            currentPage: this.currentPage,
            pageSize: this.pageSize,
            classify: this.formInline.classtype,
            shapemsg: this.formInline.shapemsg
        };
        this.request.get("/inventory/inventorymanage",pamars)
            .then(res => {
                // 接收参数
                let {total,data} = res;
                this.Inventorytabel = data;
                this.total = total;
                // if(this.Inventorytabel.length === 0){
                    // this.currentPage -= 1;
                // }
            })
            .catch(err => {
                console.log(err); 
            });
    },
    // 修改
    amend() {},
    // 删除按钮
    delte(id) {
      this.$confirm("是否确认删除？操作不可逆的嗷~", "小贴士", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          this.request
            .get("/inventory/inventoryDelete", { id: id })
            .then(res => {
              // 接收数据
              let { code, message } = res;
              if (code === 0) {
                this.$message({
                  type: "success",
                  message
                });
                this.InventoryReq();
              } else {
                this.$message.error(message);
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 查询数据提交
    onSelect() {
      if (this.formInline.classtype === "" && this.formInline.shapemsg === "") {
        this.$message.error("请输入要查询的内容再进行操作嗷~");
      } else {
        this.InventoryReq();
      }
    },
    // 每页的条数变化
    handleSizeChange(val) {
      this.pageSize = val;
      this.GoodsReq();
    },
    // 当前页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.GoodsReq();
    }
  },
  // vue生命周期
  created() {
    this.InventoryReq();
  }
};
</script>
<style lang="less">
.inventorymanage {
  .el-button {
    width: 80px;
    padding: 10px;
  }
  .el-pagination {
    margin-top: 20px;
  }
  .el-dialog {
    .el-input {
      width: 250px;
    }
  }
}
</style>