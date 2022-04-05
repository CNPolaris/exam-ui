<template>
  <div class="app-container">

    <el-form ref="form" v-loading="formLoading" :model="form" label-width="100px" :rules="rules">
      <el-form-item label="标题：" prop="title" required>
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item label="内容：" prop="content" required>
        <el-input v-model="form.content" type="textarea" rows="13" />
      </el-form-item>
      <el-form-item label="接收人：" required>
        <el-select
          v-model="form.receiveUserIds"
          multiple
          filterable
          remote
          reserve-keyword
          placeholder="请输入用户名"
          :remote-method="getUserByUserName"
          :loading="selectLoading"
        >
          <el-option v-for="item in options" :key="item.value" :label="item.name" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">发送</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { selectByUsername } from '@/api/user'
import { sendMessage } from '@/api/message'

export default {
  data() {
    return {
      form: {
        title: '',
        content: '',
        receiveUserIds: []
      },
      formLoading: false,
      selectLoading: false,
      options: [],
      rules: {
        title: [
          { required: true, message: '请输入消息标题', trigger: 'blur' }
        ],
        realName: [
          { required: true, message: '请输入消息内容', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
  },
  methods: {
    getUserByUserName(query) {
      const _this = this
      if (query !== '') {
        _this.selectLoading = true
        selectByUsername(query).then(re => {
          _this.selectLoading = false
          _this.options = re.data
        })
      } else {
        _this.options = []
      }
    },
    submitForm() {
      const _this = this
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.formLoading = true
          sendMessage(this.form).then(data => {
            if (data.code === 2000) {
              // _this.$message.success(data.message)
              _this.delCurrentView(_this).then(() => {
                _this.$router.push('/message/list')
              })
            } else {
              // _this.$message.error(data.message)
              _this.formLoading = false
            }
          }).catch(e => {
            _this.formLoading = false
          })
        } else {
          return false
        }
      })
    },
    resetForm() {
      const lastId = this.form.id
      this.$refs['form'].resetFields()
      this.form = {
        title: '',
        content: '',
        receiveUserIds: []
      }
      this.form.id = lastId
    },
    ...mapActions('tagsView', { delCurrentView: 'delCurrentView' })
  }
}
</script>
