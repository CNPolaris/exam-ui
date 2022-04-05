<template>
  <div style="line-height: 1.8">
    <!--    单选题   -->
    <div v-if="qType===1" v-loading="qLoading">
      <div class="q-title" v-html="question.title" />
      <div class="q-content">
        <span v-for="item in question.items" :key="item.id">
          <el-radio>
            {{ item.prefix+'. '+item.content }}
          </el-radio>
        </span>
        <span>结果：<el-tag v-if="answer.doRight===true" type="danger">错误</el-tag><el-tag v-if="answer.doRight!==true" type="success">正确</el-tag></span><br>
        <span>分数：{{ question.score }}</span><br>
        <span>难度：<el-rate v-model="question.difficult" /></span>
        <span>解析：{{ question.analyze }}</span><br>
        <span>正确答案：{{ question.correct }}</span><br>
      </div>
    </div>
    <!--    多选题    -->
    <div v-if="qType===2">
      <div class="q-title" v-html="question.title" />
      <div class="q-content">
        <span v-for="item in question.items" :key="item.id">
          <el-checkbox checked="handleChecked(item.prefix)">{{ item.prefix+'. '+ item.content }}</el-checkbox>
        </span>
        <span>结果：<el-tag v-if="answer.doRight===true" type="danger">错误</el-tag><el-tag v-if="answer.doRight!==true" type="success">正确</el-tag></span><br>
        <span>分数：{{ question.score }}</span><br>
        <span>难度：<el-rate v-model="question.difficult" /></span>
        <span>解析：{{ question.analyze }}</span><br>
        <span>正确答案：{{ question.correct }}</span><br>
      </div>
    </div>
    <!--    判断题   -->
    <div v-if="qType===3">
      <div class="q-title" v-html="question.title" />
      <span v-for="item in question.items" :key="item.id">
        <el-radio>{{ item.prefix+'. '+item.content }}</el-radio>
      </span>
      <span>结果：<el-tag v-if="answer.doRight===true" type="danger">错误</el-tag><el-tag v-if="answer.doRight!==true" type="success">正确</el-tag></span><br>
      <span>分数：{{ question.score }}</span><br>
      <span>难度：<el-rate v-model="question.difficult" /></span>
      <span>解析：{{ question.analyze }}</span><br>
      <span>正确答案：{{ question.correct }}</span><br>
    </div>
    <!--    填空题    -->
    <div v-if="qType===4">
      <div class="q-title" v-html="question.title" />
      <span>结果：<el-tag v-if="answer.doRight===true" type="danger">错误</el-tag><el-tag v-if="answer.doRight!==true" type="success">正确</el-tag></span><br>
      <span>分数：{{ question.score }}</span><br>
      <span>难度：<el-rate v-model="question.difficult" /></span>
      <span>解析：{{ question.analyze }}</span><br>
      <span>正确答案：<span v-for="(item,index) in question.correctArray" :key="index">{{ item }}</span></span><br>
    </div>
    <!--    简答题    -->
    <div v-if="qType===5">
      <div class="q-title" v-html="question.title" />
      <div class="q-content" v-html="answer.content" />
      <span>结果：<el-tag v-if="answer.score===0" type="danger">未批改</el-tag><el-tag v-if="answer.score!==0" type="success">已批改</el-tag></span><br>
      <span>分数：{{ question.score }}</span><br>
      <span>难度：<el-rate v-model="question.difficult" /></span>
      <span>解析：{{ question.analyze }}</span><br>
      <span>正确答案：{{ question.correct }}</span><br>
      <div>
        <span>批改</span>
        <el-input-number v-model="answer.score" :precision="1" :step="1" :max="question.score" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QuestionJudge',
  props: {
    question: {
      type: Object,
      default: function() {
        return {}
      }
    },
    answer: {
      type: Object,
      default: function() {
        return {}
      }
    },
    qLoading: {
      type: Boolean,
      default: false
    },
    qType: {
      type: Number,
      default: 0
    }
  },
  methods: {
    handleChecked(prefix) {
      for (const content in this.answer.contentArray) {
        if (content === prefix) {
          return true
        }
      }
      return false
    }
  }
}
</script>

<style scoped>

</style>
