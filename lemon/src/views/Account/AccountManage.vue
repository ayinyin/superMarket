<template>
  <div class="accountmanage">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>账号管理</span>
      </div>
      <!-- 表格数据 -->
      <el-table
        ref="Accounttabel"
        :data="Accounttabel"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <!-- 复选框 -->
        <el-table-column type="selection" width="60"></el-table-column>
        <!-- 用户名 -->
        <el-table-column label="用户名" width="120" prop="username"></el-table-column>
        <!-- 用户组 -->
        <el-table-column prop="user_group" label="用户组" width="200"></el-table-column>
        <!-- 日期 -->
        <el-table-column label="日期" width="250">
          <template slot-scope="scope">{{ scope.row.cdata | filterData }}</template>
        </el-table-column>
        <!-- 操作列 -->
        <el-table-column label="操作" show-overflow-tooltip>
          <!-- 注意，需要使用slot-scope属性绑定数据的时候，需要使用模板template加在上面 -->
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="amend(scope.row.id) ">修改</el-button>
            <el-button type="danger" icon="el-icon-delete" @click="delte(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 修改框 -->
      <el-dialog title="修改账号信息" :visible.sync="dialogFormVisible" width="30%">
        <el-form ref="editform" :rules="rules" :model="editform">
          <el-form-item label="账号" label-width="25%" prop="name">
            <el-input width="200px" v-model="editform.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="用户组" label-width="25%">
            <el-select v-model="editform.region" placeholder=" - - 请选择用户组 - - ">
              <el-option label="超级管理员" value="超级管理员"></el-option>`
              <el-option label="普通用户" value="普通用户"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="editData">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pageSise"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
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
// 引入处理时间插件moment
import moment from "moment";
export default {
  data() {
    return {
      Accounttabel: [],
      // 修改框
      editform: {
        name: "",
        region: ""
      },
      dialogFormVisible: false,
      // 存被选中的数据
      checkedData: [],
      // 分页
      // 每一页显示的条数
      pageSise: 5,
      // 当前页
      currentPage: 1,
      total: 0,
      // 修改数据的验证
      rules: {
        name: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 3, max: 6, message: "长度在3-6位之间嗷~", trigger: "blur" }
        ]
      },
    };
  },
  methods: {
    // 每次进入页面都会请求数据，所以分页要写在加载页面哪里
    AccountReq() {
      let params = {
        currentPage: this.currentPage,
        pageSise: this.pageSise
      };
      this.request
        .get("/account/accountlist", params)
        .then(res => {
          let { total, data } = res;
          this.total = total;
          this.Accounttabel = data;
          // 如果当前页没有信息则当前页-1
          if (this.Accounttabel.length === 0 && this.currentPage !== 1) {
            this.currentPage -= 1;
            this.AccountReq();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 取消全选
    toggleSelection() {
      this.$refs.Accounttabel.clearSelection();
    },
    // 修改按钮
    amend(id) {
      // 把点击的那个数据的id绑定一下
      this.editId = id;
      // // 设置显示
      this.dialogFormVisible = true;
      // 发送一个get请求，弹出表单
      this.request
        .get("/account/editclick", { id: id })
        .then(res => {
          // 接收到了数据 -- 把数据挂载上去
          let { username, user_group } = res;
          this.editform.name = username;
          this.editform.region = user_group;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 修改表单的数据 --- 提交的按钮
    editData() {
      // 判断验证是否通过
      this.$refs.editform.validate(valid => {
        if(valid){
           // 收集数据
          let params = {
            id: this.editId,
            name: this.editform.name,
            region: this.editform.region
          };
          // 发送请求
          this.request.post("/account/editFormData", params)
            .then(res => {
              // 操作成功  -- 接收数据
              let { code, message } = res;
              if (code === 0) {
                this.$message({
                  type: "success",
                  message
                });
                // 把修改框关闭
                this.dialogFormVisible = false;
                // 刷新页面
                this.AccountReq();
              } else {
                this.$message.error(message);
              }
            })
            .catch(err => {
              console.log(err);
            });
        }else{
          console.log("前端验证不通过！")
        }
      })
     
    },
    // 删除按钮
    delte(id) {
      // 弹窗
      this.$confirm("是否确认删除？操作不可逆的嗷~", "小贴士", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          // 接收数据
          let params = { id };
          // 发送数据 --- get请求接收的是一个对象
          this.request
            .get("/account/delteData", params)
            .then(data => {
              let { code, message } = data;
              if (code === 0) {
                this.$message({
                  type: "success",
                  message
                });

                this.AccountReq();
              } else {
                this.$message, console.error(message);
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
            type: "warning",
            center: true
          })
          .then(() => {
            // 发送请求
            this.request
              .get("/account/batchData", { idArr: idArr })
              .then(res => {
                // 执行删除成功，接收数据
                let { code, message } = res;
                if (code === 0) {
                  this.$message({
                    type: "success",
                    message
                  });

                  // 刷新页面
                  this.AccountReq();
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
          })
        }
    },
    // 复选框被选中的时候执行的函数
    handleSelectionChange(val) {
      this.checkedData = val;
    },
    // 分页
    // 每页显示的条数
    handleSizeChange(val) {
      this.pageSise = val;
      this.AccountReq();
    },
    // 当前页的改变
    handleCurrentChange(val) {
      this.currentPage = val;
      this.AccountReq();
    }
  },
  // vue生命周期
  created() {
    // 发送请求   --- 调用
    this.AccountReq();
  },
  // 过滤 --- 处理时间
  filters: {
    filterData(val) {
      return moment(val).format("YYYY-MM-DD hh:mm:ss");
    }
  }
};
</script>
<style lang="less">
.accountmanage {
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
// 处理account的请求 --- 所有的
// AccountReq() {
//   this.request
//     .get("/account/accountlist")
//     .then(data => {
//       // 把数据挂载到form对象上
//       this.Accounttabel = data;
//     })
//     .catch(err => {
//       console.log(err);
//     });
// },