<template>
  <div class="app-container">
    <el-form :model="query" :rules="rules">
      <el-form-item prop="className" label="班级名称" required >
        <el-input v-model="query.className" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleEdit">确认</el-button>
        <el-button @click="handleBack">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { editClass } from '@/api/classes'
export default {
  name: 'EditClass',
  data() {
    return {
      query: {
        id: null,
        className: null
      },
      rules: {
        className: [
          {
            required: true,
            message: '请输入班级名称',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    handleEdit() {
      if (this.query.className !== null) {
        editClass(this.query).then(re => {
          this.$notify({
            title: '成功',
            message: re.message,
            type: 'success',
            duration: 2000
          })
          this.$router.push('/class/list')
        })
      } else {
        this.$notify({
          title: '失败',
          message: '不能为空',
          type: 'error',
          duration: 2000
        })
      }
    },
    handleBack() {
      this.$router.push('/class/list')
    }
  }
}
</script>

<style scoped>

</style>
