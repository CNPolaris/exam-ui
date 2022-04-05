<template>
  <el-form>
    <el-form-item label="真实姓名">
      <el-input v-model.trim="userInfo.real_name" />
    </el-form-item>
    <el-form-item label="手机号">
      <el-input v-model.trim="userInfo.phone" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">更新</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { updateUser } from '@/api/user'

export default {
  props: {
    userInfo: {
      type: Object,
      default: () => {
        return {
          realName: '',
          phone: ''
        }
      }
    }
  },
  methods: {
    submit() {
      const _this = this
      updateUser(this.userInfo).then(re => {
        if (re.code === 2000) {
          _this.$notify({
            title: '成功',
            message: re.message,
            type: 'success',
            duration: 2000
          })
        } else {
          _this.$notify({
            title: '失败',
            message: re.message,
            type: 'error',
            duration: 2000
          })
        }
      })
    }
  }
}
</script>
