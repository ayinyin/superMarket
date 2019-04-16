<template>
  <div class="adminmanage">
     <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>账号管理</span>
      </div>
      <!-- 表格数据 -->
      <el-table
        ref="Admintabel"
        :data="Admintabel"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <!-- 复选框 -->
        <el-table-column type="selection" width="60"></el-table-column>
        <!-- 会员卡卡号 -->
        <el-table-column label="会员卡卡号" width="120" prop="admincardnum"></el-table-column>
        <!-- 会员姓名 -->
        <el-table-column label="会员姓名" width="120" prop="Realname"></el-table-column>
        <!-- 会员等级 -->
        <el-table-column label="会员等级" prop="admin_group" width="120"></el-table-column>
        <!-- 会员积分 -->
        <el-table-column label="会员积分" prop="integral" width="120"></el-table-column>
        <!-- 折扣 -->
        <el-table-column label="折扣" prop="Discount" width="120"></el-table-column>
        <!-- 手机号 -->
        <el-table-column label="手机号" prop="telphone" width="150"></el-table-column>
        <!-- 座机号 -->
        <el-table-column label="座机号" prop="LandlineNum" width="150"></el-table-column>
        <!-- 操作列 -->
        <el-table-column label="管理" show-overflow-tooltip>
          <!-- 注意，需要使用slot-scope属性绑定数据的时候，需要使用模板template加在上面 -->
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="amend(scope.row.id) ">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 修改框 -->
      <el-dialog title="修改账号信息" :visible.sync="dialogFormVisible" width="30%">
        <el-form ref="editform" :rules="rules" :model="editform">
          <el-form-item label="会员姓名" label-width="25%" prop="Realname">
            <el-input width="200px" v-model="editform.Realname" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="会员组" label-width="25%">
            <el-select v-model="editform.admin_group" placeholder=" - - 请选择用户组 - - ">
              <el-option label="普通会员" value="普通会员"></el-option>`
              <el-option label="超级会员" value="超级会员"></el-option>
              <el-option label="特别会员" value="特别会员"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="手机号" label-width="25%" prop="telphone">
            <el-input width="200px" v-model="editform.telphone" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="座机号" label-width="25%" prop="LandlineNum">
            <el-input width="200px" v-model="editform.LandlineNum" auto-complete="off"></el-input>
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
      Admintabel: [],
      // 修改框
      editform: {
        Realname: "",
        admin_group: "",
        telphone: "",
        LandlineNum: ""
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
      },
    };
  },
  methods: {
    // 每次进入页面都会请求数据，所以分页要写在加载页面哪里
    AdminReq() {
      let params = {
        currentPage: this.currentPage,
        pageSise: this.pageSise
      };
      this.request
        .get("/admin/adminlist", params)
        .then(res => {
          let { total, data } = res;
          this.total = total;
          this.Admintabel = data;
          this.DiscountFn(data);
          // 如果当前页没有信息则当前页-1
          if (this.Admintabel.length === 0 && this.currentPage !== 1) {
            this.currentPage -= 1;
            this.AdminReq();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 取消全选
    toggleSelection() {
      this.$refs.Admintabel.clearSelection();
    },
    // 修改按钮
    amend(id) {
      // 把点击的那个数据的id绑定一下
      this.editId = id;
      // // 设置显示
      this.dialogFormVisible = true;
      // 发送一个get请求，弹出表单
      this.request
        .get("/admin/editclick", { id: id })
        .then(res => {
          // 接收到了数据 -- 把数据挂载上去
          let { Realname, admin_group, telphone,LandlineNum } = res;
          this.editform.Realname = Realname;
          this.editform.admin_group = admin_group;
          this.editform.telphone = telphone;
          this.editform.LandlineNum = LandlineNum;
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
            Realname: this.editform.Realname,
            admin_group: this.editform.admin_group,
            telphone: this.editform.telphone,
            LandlineNum: this.editform.LandlineNum
          };
          // 发送请求
          this.request.post("/admin/editFormData", params)
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
                this.AdminReq();
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
              .get("/admin/batchData", { idArr: idArr })
              .then(res => {
                // 执行删除成功，接收数据
                let { code, message } = res;
                if (code === 0) {
                  this.$message({
                    type: "success",
                    message
                  });

                  // 刷新页面
                  this.AdminReq();
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
      this.AdminReq();
    },
    // 当前页的改变
    handleCurrentChange(val) {
      this.currentPage = val;
      this.AdminReq();
    },
    // 处理折扣的函数
    DiscountFn(val){
      // 直接处理data
      // 遍历
      for(const item in val){
        // 随机数
        let integral ; 
        if(val[item].admin_group === "普通会员"){
          val[item].Discount = "90%";
          integral = parseInt(Math.random()*200);
        }else if(val[item].admin_group === "超级会员"){
          val[item].Discount = "70%";
          integral = parseInt(Math.random()*300+200);
        }else if(val[item].admin_group === "特别会员"){
          val[item].Discount = "60%";
          integral = parseInt(Math.random()*500+500);
        }
        val[item].integral = integral;
      }
    }
  },
  // vue生命周期
  created() {
    // 发送请求   --- 调用
    this.AdminReq();
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
.adminmanage {
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