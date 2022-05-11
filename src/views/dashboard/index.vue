<template>
  <div class="dashboard-container">
    <el-row :gutter="20" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="tree" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              班级总数
            </div>
            <count-to v-loading="loading" :start-val="0" :end-val="form.classCount" :duration="2600" class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper">
            <svg-icon icon-class="student" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              学生总数
            </div>
            <count-to v-loading="loading" :start-val="0" :end-val="form.studentCount" :duration="2600" class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper">
            <svg-icon icon-class="question" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              题目总数
            </div>
            <count-to v-loading="loading" :start-val="0" :end-val="form.questionCount" :duration="2600" class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper">
            <svg-icon icon-class="paper" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              试卷总数
            </div>
            <count-to v-loading="loading" :start-val="0" :end-val="form.paperCount" :duration="2600" class="card-panel-num" />
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 10px">
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <user-active-line />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <question-create-count />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import CountTo from 'vue-count-to'
import { dashInfo } from '@/api/dashboard'
import UserActiveLine from '@/views/dashboard/components/UserActiveLine'
import QuestionCreateCount from '@/views/dashboard/components/QuestionCreateCount'
export default {
  name: 'Dashboard',
  components: {
    CountTo, UserActiveLine, QuestionCreateCount
  },
  data() {
    return {
      loading: false,
      form: {
        classCount: 0
      },
      loginLogData: {
        date: [],
        count: []
      }
    }
  },
  created() {
    this.getDashInfo()
  },
  methods: {
    getDashInfo() {
      const _this = this
      dashInfo().then(re => {
        _this.form = re.data
      })
    }
  }
}
</script>

<style scoped>

</style>
