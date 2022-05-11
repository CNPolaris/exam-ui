<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="年级">
        <el-select v-model="queryParam.gradeLevel" placeholder="年级">
          <el-option v-for="item in levelEnum" :key="item.key" :value="item.key" :label="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="学科">
        <el-select v-model="queryParam.subjectId" placeholder="学科">
          <el-option v-for="item in subjects" :key="item.id" :value="item.id" :label="item.name" />
        </el-select>
      </el-form-item>
      <el-form-item label="题目类型">
        <el-select v-model="queryParam.questionType" placeholder="题目类型">
          <el-option v-for="item in questionTypeEnum" :key="item.key" :value="item.key" :label="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="getList">查询</el-button>
        <el-button type="success" size="small" @click="handleClear">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column prop="id" label="Id" width="90px" />
      <el-table-column prop="subjectId" label="学科" :formatter="subjectFormatter" width="120px" />
      <el-table-column prop="questionType" label="题型" :formatter="questionTypeFormatter" width="70px" />
      <el-table-column prop="shortTitle" label="题干" show-overflow-tooltip />
      <el-table-column prop="score" label="分数" width="60px" />
      <el-table-column prop="difficult" label="难度" width="60px" />
      <el-table-column prop="createTime" label="创建时间" :formatter="formatDateTime" width="160px" />
      <el-table-column label="操作" align="center" width="220px">
        <template slot-scope="{row}">
          <!--              <el-button size="mini"   @click="showQuestion(row)">预览</el-button>-->
          <el-button type="primary" size="mini" @click="editQuestion(row)">编辑</el-button>
          <el-button size="mini" type="danger" class="link-left" @click="handleDeleteQuestion(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="pageQuery.page" :limit.sync="pageQuery.limit" style="text-align: center" @pagination="getList" />
    <el-dialog :visible.sync="questionShow.dialog" style="width: 100%;height: 100%">
      <QuestionShow :q-type="questionShow.qType" :question="questionShow.question" :q-loading="questionShow.loading" />
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import { formatDate } from '@/utils/date'
import { getQuestionList, selectQuestion, deleteQuestion } from '@/api/question'
import QuestionShow from './components/Show'
const { mapActions, mapGetters, mapState } = require('vuex')

export default {
  name: 'QuestionList',
  components: { Pagination, QuestionShow },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      pageQuery: {
        page: 1,
        limit: 15
      },
      queryParam: {
        id: null,
        questionType: null,
        gradeLevel: null,
        subjectId: null
      },
      questionShow: {
        qType: 0,
        dialog: false,
        question: null,
        loading: false
      },
      statusOptions: ['有效', '无效'],
      subjectFilter: null,
      questionTypeEnum: [{ key: 1, value: '单选题' }, { key: 2, value: '多选题' }, { key: 3, value: '判断题' }, { key: 4, value: '填空题' }, { key: 5, value: '简答题' }]
    }
  },
  computed: {
    ...mapGetters('enumItem', ['enumFormat']),
    ...mapState('enumItem', {
      questionType: state => state.exam.question.typeEnum,
      editUrlEnum: state => state.exam.question.editUrlEnum,
      levelEnum: state => state.user.levelEnum
    }),
    ...mapGetters('exam', ['subjectEnumFormat']),
    ...mapState('exam', { subjects: state => state.subjects })
  },
  created() {
    this.getList()
    this.initSubject()
  },
  methods: {
    getList() {
      this.listLoading = true
      getQuestionList(this.pageQuery, this.queryParam).then(response => {
        const { data } = response
        this.list = data.data
        this.total = data.total
        // setTimeout(() => {
        this.listLoading = false
        // }, 1.5 * 1000)
      })
    },
    levelChange() {
      this.queryParam.subjectId = null
      this.subjectFilter = this.subjects.filter(data => data.level === this.queryParam.level)
    },
    showQuestion(row) {
      const _this = this
      this.questionShow.dialog = true
      this.questionShow.loading = true
      selectQuestion(row.id).then(re => {
        _this.questionShow.qType = re.data.questionType
        _this.questionShow.question = re.data
        _this.questionShow.loading = false
      })
    },
    editQuestion(row) {
      const url = this.enumFormat(this.editUrlEnum, row.questionType)
      this.$router.push({ path: url, query: { id: row.id, isUpdate: 1 }})
    },
    handleDeleteQuestion(id) {
      deleteQuestion(id).then(response => {
        if (response.code === 2000) {
          this.$notify({
            title: '成功',
            message: response.message,
            type: 'success',
            duration: 2000
          })
          this.getList()
        } else {
          this.$notify({
            title: '失败',
            message: response.message,
            type: 'error',
            duration: 2000
          })
        }
      })
    },
    handleClear() {
      Object.assign(this.queryParam, {})
    },
    questionTypeFormatter(row, column, cellValue, index) {
      return this.enumFormat(this.questionType, cellValue)
    },
    subjectFormatter(row, column, cellValue, index) {
      return this.subjectEnumFormat(cellValue)
    },
    formatDateTime(row, column, cellValue, index) {
      if (row.createTime === null || row.createTime === '') {
        return 'N/A'
      }
      const date = new Date(row.createTime)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    },
    ...mapActions('exam', { initSubject: 'initSubject' })
  }
}
</script>
