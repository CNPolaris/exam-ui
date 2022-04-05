<template>
  <div class="app-container">
    <el-row :gutter="40">
      <el-col :xs="12" :sm="12" :lg="6">
        <div>
          <div>
            <svg-icon icon-class="exam"/>
          </div>
          <div>
            <div>
              班级总数
            </div>
            <vue-count-to :start-val="0" :end-val="form.classCount" />
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { dashInfo } from '@/api/dashboard'
export default {
  name: 'Dashboard',
  data() {
    return {
      form: {
        classCount: 0
      }
    }
  },
  created() {
    this.getDashInfo()
  },
  methods: {
    getDashInfo() {
      dashInfo().then(re => {
        this.form = re.data
        console.log(this.form)
      })
    }
  }
}
</script>

<style scoped>

</style>
