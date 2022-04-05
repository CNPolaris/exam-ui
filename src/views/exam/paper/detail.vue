<template>
  <div class="app-container">
    <div>
      <header class="el-header align-center">
        <h1 align="center">{{ form.name }}</h1>
        <h5 align="center">建议时长:{{ form.suggestTime }}分钟 年级：{{ form.level|formatLevel }} 总分：{{ form.score }}</h5>
      </header>
      <main class="el-main">
        <el-form ref="form" :model="form">
          <el-form-item v-for="(titleItem, index) in form.titleItems" :key="index">
            <el-card v-if="titleItem.questionItems.length!==0" class="exampaper-item-box">
              <el-form-item
                v-for="(questionItem, questionIndex) in titleItem.questionItems"
                :key="questionIndex"
                :label="(questionIndex+1)+''"
                style="margin-bottom: 15px"
              >
                <el-row>
                  <el-col :span="23">
                    <QuestionShow :q-type="questionItem.questionType" :question="questionItem" />
                  </el-col>
                </el-row>
              </el-form-item>
            </el-card>
          </el-form-item>
        </el-form>
        <div align="center">
          <el-button type="primary">打印</el-button>
          <el-button type="danger" @click="$router.push('/exam/list')">取消</el-button>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { selectExamPaper } from '@/api/exam'
import QuestionShow from '../../question/components/Show'

export default {
  components: { QuestionShow },
  filters: {
    formatLevel(level) {
      switch (level) {
        case 1:
          return '一年级'
        case 2:
          return '二年级'
        case 3:
          return '三年级'
        case 4:
          return '四年级'
        case 5:
          return '五年级'
        case 6:
          return '六年级'
        case 7:
          return '初一'
        case 8:
          return '初二'
        case 9:
          return '初三'
        case 10:
          return '高一'
        case 11:
          return '高二'
        case 12:
          return '高三'
        default:
          return 0
      }
    }
  },
  data() {
    return {
      form: {
        id: null,
        level: null,
        subjectId: null,
        paperType: 1,
        limitDateTime: [],
        name: '',
        suggestTime: null,
        titleItems: []
      },
      subjectFilter: null
    }
  },
  created() {
    const id = this.$route.query.id
    const _this = this
    this.initSubject(function() {
      _this.subjectFilter = _this.subjects
    })
    if (id && parseInt(id) !== 0) {
      selectExamPaper(id).then(re => {
        _this.form = re.data
      })
    }
  }
}
</script>

<style lang="scss">
.exampaper-item-box {
.q-title {
  margin: 0px 5px 0px 5px;
}
.q-item-content {
}
}
</style>
