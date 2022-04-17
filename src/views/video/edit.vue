<template>
  <div class="app-container">
    <el-form ref="query" :model="query" label-width="100px" :rules="rules">
      <el-form-item label="年级：" prop="level" required>
        <el-select v-model="query.level" placeholder="年级">
          <el-option v-for="item in levelEnum" :key="item.key" :value="item.key" :label="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="学科：" prop="subjectId" required>
        <el-select v-model="query.subjectId" placeholder="学科">
          <el-option v-for="item in subjects" :key="item.id" :value="item.id" :label="item.name" />
        </el-select>
      </el-form-item>
      <el-form-item label="名称" prop="name" required>
        <el-input v-model="query.name" size="20" />
      </el-form-item>
      <el-form-item label="封面" prop="cover" required>
        <el-upload
          class="avatar-upload"
          action="/api/image/upload"
          :show-file-list="false"
          :headers="headers"
          :on-success="handleImageSuccess"
          :before-upload="beforeImageUpload"
        >
          <el-button size="small" type="primary">上传封面</el-button>
        </el-upload>
        <el-image style="width: 100px; height: 100px" :src="query.cover" />
      </el-form-item>
      <el-form-item label="视频">
        <el-upload
          class="avatar-uploader"
          action="/api/video/upload"
          :show-file-list="false"
          :headers="headers"
          :on-success="handleVideoSuccess"
          :before-upload="beforeVideoUpload"
        >
          <el-button size="small" type="primary">上传视频</el-button>
        </el-upload>
        <video controls :src="query.url" width="200" />
      </el-form-item>
      <el-form-item label="标签" prop="tags">
        <el-tag v-for="item in tags" :key="item" closable :disable-transitions="false" @close="handleClose(item)">
          {{ item }}
        </el-tag>
        <el-input
          ref="saveTagInput"
          v-model="tag"
          class="input-new-tag"
          size="small"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        />
      </el-form-item>
      <el-button type="primary" @click="handleSaveVideo">提交</el-button>
      <el-button @click="handleClear">重置</el-button>
    </el-form>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { getToken } from '@/utils/auth'
import { saveVideo, selectVideo } from '@/api/video'

export default {
  name: 'VideoEdit',
  data() {
    return {
      tag: '',
      tags: [],
      query: {
        name: null,
        level: null,
        subjectId: null,
        cover: null,
        url: null,
        path: null,
        tags: null
      },
      formLoading: false,
      headers: {
        Authorization: 'Bearer ' + getToken(),
        smail: '*_~'
      },
      subjectFilter: null,
      rules: {
        gradeLevel: [
          { required: true, message: '请选择年级', trigger: 'change' }
        ],
        subjectId: [
          { required: true, message: '请选择学科', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    const _this = this
    const id = this.$route.query.id
    this.initSubject(function() {
      _this.subjectFilter = _this.subjects
    })
    if (id && parseInt(id) !== 0) {
      _this.formLoading = true
      selectVideo(id).then(re => {
        _this.query = re.data
        this.tags = re.data.tags
        _this.formLoading = false
      })
    }
  },
  methods: {
    handleClose(tag) {
      this.tags.splice(this.tags.indexOf(tag), 1)
    },
    handleInputConfirm() {
      const tag = this.tag
      if (tag) {
        this.tags.push(tag)
      }
      this.tag = ''
    },
    handleClear() {
      this.query.Object.assign({})
    },
    handleSaveVideo() {
      this.query.tags = this.tags
      const _this = this
      saveVideo(this.query).then(response => {
        if (response.code === 2000) {
          _this.$router.push('/video/list')
        } else {
          _this.$message.error(response.message)
        }
      }).catch(e => {
        console.log(e)
      })
    },
    handleVideoSuccess(res, file) {
      const { response } = file
      this.query.path = response.data.path
      this.query.url = response.data.url
    },
    beforeVideoUpload(file) {
      const isLt512M = file.size / 1024 / 1024 < 512
      if (!isLt512M) {
        this.$notify({
          title: '失败',
          message: '上传图片大小不能超过 2MB!',
          type: 'error',
          duration: 2000
        })
      }
      return isLt512M
    },
    handleImageSuccess(res, file) {
      const { response } = file
      this.query.cover = response.data
    },
    beforeImageUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$notify({
          title: '失败',
          message: '上传图片大小不能超过 2MB!',
          type: 'error',
          duration: 2000
        })
      }
      return isLt2M
    },
    ...mapActions('exam', { initSubject: 'initSubject' })
  },
  computed: {
    ...mapState('enumItem', {
      levelEnum: state => state.user.levelEnum
    }),
    ...mapState('exam', { subjects: state => state.subjects })
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
  //输入框tags
  .tags-wrap{
    width: 100%;
    height: 100%;
    outline: none;
    &::after{
      content: "";
      display: block;
      height: 0;
      clear: both;
    }
  }
  .tags, .tags-input{
    position: relative;
    float: left;
    color: #fff;
    line-height: 28px;
    margin: 0 4px 4px 0;
    padding: 0 22px 0 10px;
    border-radius: 6px;
    .content{
      line-height: 28px;
    }
    .del{
      width: 22px;
      height: 28px;
      text-align: center;
      cursor: pointer;
      position: absolute;
      top: -1px;
      right: 0;
    }
  }
  .tags-input{
    font-size: 14px;
    padding: 0;
    background-color: inherit;
    border: none;
    color: inherit;
    width: 10em;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
}
</style>

