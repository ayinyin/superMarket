<template>
  <div class="personal">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>个人中心</span>
      </div>
      <div>
        <!-- 头像 -->
        <el-upload
            class="avatar-uploader"
            action="biubiubiubiu"
            :http-request="UpdateFile"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload">
            <!-- 图像 -->
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <!-- 图标 -->
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      <!-- 用户信息 -->
      <p>ID: {{ accountInfo.id }}</p>
      <h1>用户名：{{ accountInfo.username }} </h1>
      <p>用户组： {{ accountInfo.user_group }}</p>
      <p>创建时间： {{ accountInfo.ctime | filterDate }}</p>
      </div>
    </el-card>
  </div>
</template>
<script>
// 引入模块
import moment from 'moment'
import axios from 'axios'
export default {
  data() {
    return {
      accountInfo: {},
      imageUrl: ''
    }
  },
  methods: {
    // 获取信息函数
    getAccountInfo() {
        this.request.get('/login/accountinfo')
          .then(res => {
              this.accountInfo = res[0]
          })
          .catch(err => {
              console.log(err)
          })
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    UpdateFile(file){
      // 参数
      let imgfile = file.file;
      // 创建一个fromdata对象
      let fileFormData = new FormData();
      // 把文件数据放入fromdata 
      // fileFormData.append('表单名', 文件对象, 文件名);
      fileFormData.append('file', imgfile, imgfile.fileName);
      console.log(fileFormData.get('file'))
      // 发送axios给后端
      axios.post('/login/uploadavatar',fileFormData,{
        headers:{
          'Content-Type':'multipart/form-data'
        }
      })
      .then(response => {
        // 接收后端响应的数据
        let {code,message,path} = response.data;
        if(code === 0){
          // 回填头像
          this.imageUrl = `http://127.0.0.1:8888${path}`
          // 触发父组件方法
          this.$emit('A')
        }else if(code === 1){
          this.$message.error(message)
        }
      })
      .catch(err => {
        console.log(err);
      })
    }
  },
  filters: {
    filterDate(val) {
      return moment(val).format('YYYY/MM/DD hh:mm:ss')
    }
  },
  created(){
    this.getAccountInfo();
  }
};
</script>
<style lang="less">
.personal {
  .el-card {
    .el-card__header {
      background-color: #f1f1f1;
    }
      .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }
      .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
      }
      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
      }
      .avatar {
        width: 178px;
        height: 178px;
        display: block;
      }
  }
}
</style>
