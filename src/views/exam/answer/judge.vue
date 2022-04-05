<template>
  <div class="app-container">
    <div class="paper-contain">
      <div class="paper-item-order-fake">
        <div class="paper-item-order">
          <el-card shadow="never">
            <el-form :model="form">
              <el-form-item>
                <h4>{{ form.paper.name }}</h4>
                <div class="split" />
                <div>得分：{{ form.paper.score }}</div>
                <div>耗时：{{ form.answer.doTimeStr }}</div>
                <div>考生：{{ form.answer.createUser }}</div>
                <div class="split" />
                <div v-for="(item,index) in form.answer.answerItems" :key="index" class="label">
                  <el-tag>{{ index+1 }}</el-tag>
                </div>
                <div class="split" />
                <div align="center">
                  <el-button type="primary" @click="handleSubmit">提交批改</el-button>
                </div>
              </el-form-item>
            </el-form>
          </el-card>
        </div>
      </div>
      <div class="paper-question-content">
        <el-card shadow="never">
          <el-form :model="form">
            <el-row v-for="(titleItem,index) in form.paper.titleItems" :key="index">
              <div v-if="titleItem.questionItems.length!==0" class="exam-paper-item-box">
                <el-form-item
                  v-for="(questionItem,questionIndex) in titleItem.questionItems"
                  :key="questionIndex"
                  :label="(questionIndex+1)"
                  class="exam-paper-item-box-contain exam-paper-item-box-contain-line"
                >
                  <QuestionJudge :q-type="questionItem.questionType" :question="questionItem" :answer="findAnswer(questionItem.id)" />
                  <div class="split"></div>
                </el-form-item>
              </div>
            </el-row>
          </el-form>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import { paperRead, submitJudge } from '@/api/exam'
import QuestionJudge from './components/Judge'
export default {
  components: { QuestionJudge },
  data() {
    return {
      form: {
        paper: {
          id: null,
          score: null,
          classes: [],
          level: null,
          limitDateTime: null,
          name: null,
          paperType: null,
          subjectId: null,
          suggestTime: null,
          titleItems: []
        },
        answer: {
          id: null,
          doTime: null,
          doTimeStr: null,
          score: null,
          createUser: null,
          answerItems: []
        }
      },
      submitForm: {
        id: null,
        answerItems: []
      }
    }
  },
  created() {
    const id = this.$route.query.id
    if (id && parseInt(id) !== 0) {
      paperRead(id).then(re => {
        this.form.answer = re.data.answer
        this.form.paper = re.data.paper
      })
    }
  },
  methods: {
    findAnswer(qId) {
      for (const answer of this.form.answer.answerItems) {
        if (answer.questionId === qId) {
          return answer
        }
      }
    },
    handleSubmit() {
      this.submitForm.answerItems = this.form.answer.answerItems
      this.submitForm.id = this.form.answer.id
      this.submitForm.createUser = this.form.answer.createUser
      this.submitForm.doTime = this.form.answer.doTime
      this.submitForm.doTimeStr = this.form.answer.doTimeStr
      this.submitForm.score = this.form.answer.score
      submitJudge(this.submitForm).then(re => {
        this.$message.success(re.data)
      })
    }
  }
}
</script>

<style scoped>

</style>
