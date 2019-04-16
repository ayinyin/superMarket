<template>
  <div class="goodsmanage">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>商品列表</span>
      </div>
      <!-- 修改框 -->
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
      </el-dialog>
      <!-- 查询 -->
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
      </el-form>

      <!-- 表格 -->
      <el-table ref="Goodstabel" :data="Goodstabel" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <!-- 复选框 -->
        <el-table-column type="selection" width="60"></el-table-column>
        <!-- 商品条形码 -->
        <el-table-column label="商品条形码" width="120" prop="shapecode"></el-table-column>
        <!-- 商品名称 -->
        <el-table-column label="商品名称" width="100" prop="shapename"></el-table-column>
        <!-- 所属分类 -->
        <el-table-column label="所属分类" width="90" prop="classify"></el-table-column>
        <!-- 售价(元) -->
        <el-table-column label="售价(元)" width="90" prop="shapeprice"></el-table-column>
        <!-- 促销(元) -->
        <el-table-column label="促销(元)" width="90" prop="shapesales"></el-table-column>
        <!-- 市场价(元) -->
        <el-table-column label="市场价(元)" width="100" prop="marketprice"></el-table-column>
        <!-- 库存 -->
        <el-table-column label="库存" width="90" prop="storagenum"></el-table-column>
        <!-- 库存总额(元)-->
        <el-table-column label="库存总额(元)" width="100" prop="storagetotal"></el-table-column>
        <!-- 销售总额(元) -->
        <el-table-column label="销售总额(元)" width="100" prop="markettotal"></el-table-column>
        <!-- 操作列 -->3
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
       <!-- 批量删除和取消全选 -->
      <div style="margin-top: 20px">
        <el-button type="danger" @click="batchDelete">批量删除</el-button>
        <el-button type="primary" @click="toggleSelection()">取消选择</el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    // 检测是否是字符串
    const isString = (rules, value, callback) => {
      // 检测是否为空
      if (value === "") {
        callback(new Error("请输入商品名称嗷~"));
      } else if (!isNaN(value)) {
        callback(new Error("输入的名称不能是一个数字嗷~"));
      } else {
        callback();
      }
    };
    // 商品价格的验证
    const shapePrice = (rules, value, callback) => {
      // 检测是否为空
      if (value === "") {
        callback(new Error("请输入价格嗷~"));
      } else if (isNaN(value)) {
        callback(new Error("输入的价格不是一个数字嗷~"));
      } else {
        // 商品价格必须大于进价
        if (value <= this.Goodstabel.purchaseprice) {
          callback(new Error("输入价格必须大于进价！！"));
        }
        callback();
      }
    };
    return {
      Goodstabel: [],
      // 修改框
      editform: {},
      // 修改数据的id
      editDataId: 0,
      // 修改框的验证
      rules: {
        // 商品名称
        shapename: [{ required: true, validator: isString, trigger: "blur" }],
        // 商品价格
        shapeprice: [
          { required: true, validator: shapePrice, trigger: "blur" }
        ],
        // 市场价
        marketprice: [
          { required: true, validator: shapePrice, trigger: "blur" }
        ]
      },
      dialogFormVisible: false,
      // 查询表单的数据
      formInline: {
        classtype: "",
        shapemsg: ""
      },
      // 分页
      // 总页数
      total: 11,
      // 当前页
      currentPage: 1,
      // 每页显示的数量
      pageSize: 5,
      // 存被选中的数据
      checkedData: [],
    };
  },
  methods: {
    // 加载页面 --- 触发页面
    GoodsReq() {
      // 接收参数
      let pamars = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        classify: this.formInline.classtype,
        shapemsg: this.formInline.shapemsg
      };
      this.request.get("/goods/goodslist",pamars)
        .then(res => {
          // 接收参数
          let {total,data} = res;
          this.Goodstabel = data;
          this.total = total;
          if(this.Goodstabel.length === 0){
            this.currentPage -= 1;
          }
          this.Promotion();
          this.enquiryGoods();
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 修改按钮
    amend(id) {
      this.dialogFormVisible = true;
      // 发送一个请求 --- 数据回填
      this.request
        .get("/goods/amendFrom", { id: id })
        .then(res => {
          // 数据回填
          this.editform = res;
          // 保存id
          this.editDataId = res.id;
          if (this.editData.shapesales !== "未促销嗷~") {
            this.editData.shapesales = "促销中~";
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 修改确定
    editData() {
      this.$refs.editform.validate(valid => {
        if (valid) {
          // 接收参数
          let pamars = {
            id: this.editDataId,
            shapename: this.editform.shapename,
            classify: this.editform.classify,
            shapeprice: this.editform.shapeprice,
            marketprice: this.editform.marketprice,
            shapesales: this.editform.shapesales
          };
          // 发送请求
          this.request
            .post("/goods/editDataForm", pamars)
            .then(res => {
              let { code, message } = res;
              if (code === 0) {
                this.$message({
                  type: "success",
                  message
                });
                this.GoodsReq();
                this.dialogFormVisible = false;
              } else {
                this.$message.error(message);
              }
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    },
    // 删除按钮
    delte(id) {
      this.request
        .get("/goods/goodsDelete", { id: id })
        .then(res => {
          // 接收数据
          let { code, message } = res;
          if (code === 0) {
            this.$message({
              type: "success",
              message
            });
            this.GoodsReq();
          } else {
            this.$message.error(message);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 查询数据提交
    onSelect() {
      if (this.formInline.classtype === "" && this.formInline.shapemsg === "") {
        this.$message.error("请输入要查询的内容再进行操作嗷~");
      } else {
        this.GoodsReq();
      }
    },
    // 这是一个计算销售总额和库存总额
    enquiryGoods() {
      for (const item in this.Goodstabel) {
        // this.Goodstabel[item].storagetotal = this.Goodstabel[item].storagetotal || 0;
        // 商品库存总额 = 库存  *  进价
        this.Goodstabel[item].storagetotal =
          this.Goodstabel[item].storagenum *
          this.Goodstabel[item].purchaseprice;
        // 销售总额 = 库存 * 售价
        this.Goodstabel[item].markettotal =
          this.Goodstabel[item].storagenum * this.Goodstabel[item].shapeprice;
      }
    },
    // 这是一个促销的函数
    Promotion() {
      for (const item in this.Goodstabel) {
        if (this.Goodstabel[item].shapesales === "促销中~") {
          this.Goodstabel[item].shapesales = "8.00";
        }
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
    },
    // 取消全选
    toggleSelection() {
      this.$refs.Goodstabel.clearSelection();
    },
    // 批量删除按钮
    batchDelete() {
        // 收集被选中的数据
        let params = this.checkedData;
        // 把id获取到
        let idArr = params.map(v => v.id);
        if(idArr.length === 0){
          this.$message.error("请选择之后再点击")
        }else{
          // 弹窗
          this.$confirm("是否确认删除？操作不可逆的嗷~", "小贴士", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            // type: "warning",
            center: true
          })
          .then(() => {
            // 发送请求
            this.request.get("/goods/batchData", { idArr: idArr })
              .then(res => {
                // 执行删除成功，接收数据
                let { code, message } = res;
                if (code === 0) {
                  this.$message({
                    type: "success",
                    message
                  });
                  // 刷新页面
                  this.GoodsReq();
                } else {
                  this.$message.error(""+message);
                }
                  console.log(2)
              })
              .catch(err => {
                  console.log(1)
                console.log(err);
              });
          })
          .catch(() => {
            this.$message({
                type: "info",
                message: "已取消删除"
              });
          })
        }
      
      
    },
    // 复选框被选中的时候执行的函数
    handleSelectionChange(val) {
      this.checkedData = val;
    },
  },
  // uve生命周期
  created() {
    // 页面请求
    this.GoodsReq();
  }
};
</script>
<style lang="less">
.goodsmanage {
  .el-card {
    .el-table {
      padding-top: 10px;
      border-top: 2px solid #f1f1f1;
    }
  }
  .el-dialog {
    .el-input {
      width: 250px;
    }
  }
}
</style>