<template>
  <el-card style="margin-bottom:20px;">
    <div slot="header" className="clearfix">
      <span>关于我</span>
    </div>

    <div className="user-profile">
      <div className="box-center" @click="handleShow">
        <img
          :src="userInfo.avatar"
          height="100px"
          width="100px"
          style="border-radius: 50px"
        >
      </div>
      <div className="box-center">
        <div className="user-name text-center">{{ userInfo.userName }}</div>
        <div className="user-role text-center text-muted">{{ enumFormat(roleEnum, userInfo.role) }}</div>
      </div>
    </div>

    <div className="user-bio">
      <div className="user-education user-bio-section">
        <div className="user-bio-section-header">
          <svg-icon icon-class="education" />
          <span>个人简介</span></div>
        <div className="user-bio-section-body">
          <div className="text-muted">
            无
          </div>
        </div>
      </div>
      <el-dialog
        title="上传头像"
        :visible.sync="uploadDialogVisible"
        width="45%"
        :before-close="handleClose"
      >
        <el-upload
          class="avatar-uploader"
          action="/api/image/upload"
          :show-file-list="false"
          :headers="headers"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="tempAvatar" :src="tempAvatar" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-dialog>
    </div>
  </el-card>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { uploadAvatar } from '@/api/user'
import { getToken } from '@/utils/auth'

export default {
  props: {
    userInfo: {
      type: Object,
      default: () => {
        return {
          realName: '',
          userName: '',
          role: '',
          avatar: null
        }
      }
    }
  },
  data() {
    return {
      uploadDialogVisible: false,
      tempAvatar: null,
      imagecropperShow: false,
      headers: {
        Authorization: 'Bearer ' + getToken(),
        smail: '*_~'
      }
    }
  },
  methods: {
    handleShow() {
      this.tempAvatar = this.userInfo.avatar
      this.uploadDialogVisible = true
    },
    handleClose() {
      this.tempAvatar = null
      this.uploadDialogVisible = false
    },
    handleUpload() {
      uploadAvatar(this.tempAvatar).then(re => {
        this.userInfo.avatar = re.data
        this.uploadDialogVisible = false
      })
    },
    handleAvatarSuccess(res, file) {
      const { response } = file
      if (response.code === 2000) {
        this.userInfo.avatar = response.data
        uploadAvatar(response.data).then(re => {
          if (re.code === 2000) {
            this.$notify({
              title: '成功',
              message: re.message,
              type: 'success',
              duration: 2000
            })
            this.getInfo()
          }
        })
        this.uploadDialogVisible = false
      } else {
        this.$notify({
          title: '失败',
          message: '上传失败',
          type: 'error',
          duration: 2000
        })
      }
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$notify({
          title: '失败',
          message: '上传头像图片只能是 JPG 格式!',
          type: 'error',
          duration: 2000
        })
      }
      if (!isLt2M) {
        this.$notify({
          title: '失败',
          message: '上传头像图片大小不能超过 2MB!',
          type: 'error',
          duration: 2000
        })
      }
      return isJPG && isLt2M
    }
  },
  computed: {
    ...mapGetters('enumItem', [
      'enumFormat'
    ]),
    ...mapState('enumItem', {
      roleEnum: state => state.user.roleEnum
    })
  }
}
</script>

<style lang="scss" scoped>
.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}

.user-profile {
  .user-name {
    font-weight: bold;
  }

  .box-center {
    padding-top: 10px;
  }

  .user-role {
    padding-top: 10px;
    font-weight: 400;
    font-size: 14px;
  }

  .box-social {
    padding-top: 30px;

    .el-table {
      border-top: 1px solid #dfe6ec;
    }
  }

  .user-follow {
    padding-top: 20px;
  }
}

.user-bio {
  margin-top: 20px;
  color: #606266;

  span {
    padding-left: 4px;
  }

  .user-bio-section {
    font-size: 14px;
    padding: 15px 0;

    .user-bio-section-header {
      border-bottom: 1px solid #dfe6ec;
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-weight: bold;
    }
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
</style>
