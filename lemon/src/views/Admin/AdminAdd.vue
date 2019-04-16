<template>
  <div class="adminnadd">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>添加会员账号</span>
      </div>
      <!-- 登录表单 -->
      <el-form
        :model="AdminAddForm"
        status-icon
        :rules="rules"
        ref="AdminAddForm"
        label-width="100px"
        class="demo-ruleForm"
        style="width:300px"
      >
        <!-- 真实名字 -->
        <el-form-item label="真实名字" prop="Realname">
          <el-input type="text" v-model="AdminAddForm.Realname"></el-input>
        </el-form-item>
        <!-- 会员卡号 -->
        <el-form-item label="会员卡号" prop="admincardnum">
          <el-input type="text" v-model="AdminAddForm.admincardnum"></el-input>
        </el-form-item>
        <!-- 选择用户组 -->
        <el-form-item label="会员组" prop="admin_group">
          <el-select v-model="AdminAddForm.admin_group" placeholder="请选择用户组">
            <el-option label="普通会员" value="普通会员"></el-option>
            <el-option label="超级会员" value="超级会员"></el-option>
            <el-option label="特别会员" value="特别会员"></el-option>
          </el-select>
        </el-form-item>
        <!-- 身份证号 -->
        <el-form-item label="身份证号">
          <el-input type="text" v-model="AdminAddForm.idNumber"></el-input>
        </el-form-item>
        <!-- 用户状态 -->
        <el-form-item label="用户状态">
          <el-radio-group v-model="AdminAddForm.adminStatus">
            <el-radio label="促销中~">启用</el-radio>
            <el-radio label="未促销嗷~">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 手机号码 -->
        <el-form-item label="手机号码">
          <el-input type="text" v-model="AdminAddForm.telphone"></el-input>
        </el-form-item>
        <!-- 座机号码 -->
        <el-form-item label="座机号码">
          <el-input type="text" v-model="AdminAddForm.LandlineNum"></el-input>
        </el-form-item>
        <!-- 邮箱地址 -->
        <el-form-item label="邮箱地址">
          <el-input type="text" v-model="AdminAddForm.emailaddress"></el-input>
        </el-form-item>
        <!-- 地区选择 -->
        <el-form-item label="地址选择">
          <el-cascader :options="options" v-model="AdminAddForm.address" change-on-select></el-cascader>
        </el-form-item>
        <!-- 详细地址 -->
        <el-form-item label="详细地址">
          <el-input type="text" v-model="AdminAddForm.detailaddress"></el-input>
        </el-form-item>
        <!-- 邮政编码 -->
        <el-form-item label="邮政编码">
          <el-input type="text" v-model="AdminAddForm.postalCode"></el-input>
        </el-form-item>
        <!-- 提交按钮 -->
        <el-form-item>
          <el-button type="primary" @click="submitForm()">添加</el-button>
          <el-button @click="resetForm()">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    // 会员卡号
    const checkCardnum = (rules, value, callback) => {
      if (value === "") {
        callback(new Error("会员卡号不能为空"));
      } else if (isNaN(value)) {
        callback(new Error("输入的卡号必须是数字嗷~"));
      } else {
        callback();
      }
    };
    return {
      AdminAddForm: {
        idNumber:"",
        Realname:'',
        admincardnum:'',
        admin_group:'',
        adminStatus:"",
        telphone:"",
        LandlineNum:"",
        emailaddress:"",
        address:"",
        detailaddress:"",
        postalCode:""
      },
      rules: {
        Realname: [
          { required: true, message: "请输入姓名~", trigger: "blur" },
          { min: 2, max: 8, message: "姓名长度最多8位~", trigger: "blur" }
        ],
        admincardnum: [
          { required: true, validator: checkCardnum, trigger: "blur" }
        ],
        admin_group: [
          { required: true, message: "请选择用户组~", trigger: "change" }
        ]
      },
      options: [
        {
          value: "四川",
          label: "四川",
          children: [
            {
              value: "成都",
              label: "成都",
              children: [
                {
                  value: "郫县",
                  label: "郫县"
                },
                {
                  value: "新都",
                  label: "新都"
                },
                {
                  value: "武侯区",
                  label: "武侯区"
                },
                {
                  value: "锦江区",
                  label: "锦江区"
                }
              ]
            },
            {
              value: "简阳",
              label: "简阳",
              children: [
                {
                  value: "简阳",
                  label: "简阳"
                },
                {
                  value: "简阳",
                  label: "简阳"
                }
              ]
            }
          ]
        },
        {
          value: "广东",
          label: "广东",
          children: [
            {
              value: "广州",
              label: "广州",
              children: [
                {
                  value: "广州",
                  label: "广州"
                },
                {
                  value: "广州",
                  label: "广州"
                },
                {
                  value: "广州",
                  label: "广州"
                },
                {
                  value: "广州",
                  label: "广州"
                },
                {
                  value: "广州",
                  label: "广州"
                }
              ]
            }
          ]
        },
        {
          value: "北京",
          label: "北京",
          children: [
            {
              value: "朝阳",
              label: "朝阳",
              children: [{ value: "朝阳", label: "朝阳" }]
            },
            {
              value: "朝阳",
              label: "朝阳",
              children: [{ value: "朝阳", label: "朝阳" }]
            },
            {
              value: "朝阳",
              label: "朝阳",
              children: [{ value: "朝阳", label: "朝阳" }]
            }
          ]
        }
      ]
    };
  },
  methods: {
    submitForm() {
      this.$refs.AdminAddForm.validate(valid => {
        if(valid){
          // 接收参数
          let parmas = {
            Realname:this.AdminAddForm.Realname,
            admincardnum:this.AdminAddForm.admincardnum,
            admin_group:this.AdminAddForm.admin_group,
            idNumber:this.AdminAddForm.idNumber,
            adminStatus:this.AdminAddForm.adminStatus,
            telphone:this.AdminAddForm.telphone,
            LandlineNum:this.AdminAddForm.LandlineNum,
            emailaddress:this.AdminAddForm.emailaddress,
            address:this.AdminAddForm.address,
            detailaddress:this.AdminAddForm.detailaddress,
            postalCode:this.AdminAddForm.postalCode
          }
          // 发送请求
          this.request.post('/admin/adminadd',parmas)
            .then(res => {
              // 接收参数
              let {code,message} = res;
              if(code === 0){
                this.$message({
                  type:"success",
                  message
                });
                // 跳转
                this.$router.push('/home/adminmanage');
              }else{
                this.$message.error(message);
              }
            })
            .catch(err => {
              console.log(err)
            })
        }
      })
    },
    // 重置
    resetForm() {
      // 重置表单
      this.$refs.AdminAddForm.resetFields();
    }
    // getaddress(value){
    //   console.log(value)
    //   return value;
    // }
  }
};
</script>
<style lang="less">
</style>