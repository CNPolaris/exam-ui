<template>
  <div class="app-container">
    <el-form ref="form" v-loading="formLoading" :model="form" label-width="100px" :rules="rules">
      <el-form-item label="年级：" prop="level" required>
        <el-select v-model="form.level" placeholder="年级" @change="levelChange">
          <el-option v-for="item in levelEnum" :key="item.key" :value="item.key" :label="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="学科：" prop="subjectId" required>
        <el-select v-model="form.subjectId" placeholder="学科">
          <el-option
            v-for="item in subjects"
            :key="item.id"
            :value="item.id"
            :label="item.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="试卷类型：" prop="paperType" required>
        <el-select v-model="form.paperType" placeholder="试卷类型">
          <el-option v-for="item in paperTypeEnum" :key="item.key" :value="item.key" :label="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item v-show="form.paperType===4" label="时间限制：" required>
        <el-date-picker
          v-model="form.limitDateTime"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item label="试卷名称：" prop="name" required>
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item v-for="(titleItem,index) in form.titleItems" :key="index" :label="'标题'+(index+1)+'：'" required>
        <el-input v-model="titleItem.name" style="width: 80%" />
        <el-button type="text" class="link-left" style="margin-left: 20px" size="mini" @click="addQuestion(titleItem)">
          添加题目
        </el-button>
        <el-button type="text" class="link-left" size="mini" @click="form.titleItems.splice(index,1)">删除</el-button>
        <el-card v-if="titleItem.questionItems.length!==0" class="exampaper-item-box">
          <el-form-item
            v-for="(questionItem,questionIndex) in titleItem.questionItems"
            :key="questionIndex"
            :label="'题目'+(questionIndex+1)+'：'"
            style="margin-bottom: 15px"
          >
            <el-row>
              <el-col :span="23">
                <QuestionShow :q-type="questionItem.questionType" :question="questionItem" />
              </el-col>
              <el-col :span="1">
                <el-button type="text" size="mini" @click="titleItem.questionItems.splice(questionIndex,1)">删除
                </el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-card>
      </el-form-item>
      <el-form-item label="建议时长：" prop="suggestTime" required>
        <el-input v-model="form.suggestTime" placeholder="分钟" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
        <el-button type="success" @click="addTitle">添加标题</el-button>
        <el-button @click="handleBack">取消</el-button>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="questionPage.showDialog" width="70%">
      <el-form ref="queryForm" :model="questionPage.queryParam" :inline="true">
        <el-form-item label="ID：">
          <el-input v-model="questionPage.queryParam.id" clearable />
        </el-form-item>
        <el-form-item label="题型：">
          <el-select v-model="questionPage.queryParam.questionType" clearable>
            <el-option v-for="item in questionTypeEnum" :key="item.key" :value="item.key" :label="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryForm">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table
        v-loading="questionPage.listLoading"
        :data="questionPage.tableData"
        border
        fit
        highlight-current-row
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="35" />
        <el-table-column prop="id" label="Id" width="60px" />
        <el-table-column prop="questionType" label="题型" :formatter="questionTypeFormatter" width="70px" />
        <el-table-column prop="shortTitle" label="题干" show-overflow-tooltip />
      </el-table>
      <pagination
        v-show="questionPage.total>0"
        :total="questionPage.total"
        :page.sync="questionPage.queryParam.pageIndex"
        :limit.sync="questionPage.queryParam.pageSize"
        @pagination="search"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="questionPage.showDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmQuestionSelect">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { mapGetters, mapState, mapActions } from 'vuex'
import Pagination from '@/components/Pagination'
import QuestionShow from '../../question/components/Show'
import { selectExamPaper, createExamPaper, updateExamPaper } from '@/api/exam'
import { selectQuestion, getQuestionList } from '@/api/question'

export default {
  components: { Pagination, QuestionShow },
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
      pageQuery: {
        page: 1,
        limit: 10
      },
      subjectFilter: null,
      formLoading: false,
      rules: {
        level: [
          { required: true, message: '请选择年级', trigger: 'change' }
        ],
        subjectId: [
          { required: true, message: '请选择学科', trigger: 'change' }
        ],
        paperType: [
          { required: true, message: '请选择试卷类型', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入试卷名称', trigger: 'blur' }
        ],
        suggestTime: [
          { required: true, message: '请输入建议时长', trigger: 'blur' }
        ]
      },
      questionPage: {
        multipleSelection: [],
        showDialog: false,
        queryParam: {
          id: null,
          questionType: null,
          subjectId: 1,
          pageIndex: 1,
          pageSize: 5
        },
        listLoading: true,
        tableData: [],
        total: 0
      },
      currentTitleItem: null
    }
  },
  created() {
    const id = this.$route.query.id
    const _this = this
    this.initSubject(function() {
      _this.subjectFilter = _this.subjects
    })
    if (id && parseInt(id) !== 0) {
      _this.formLoading = true
      selectExamPaper(id).then(re => {
        _this.form = re.data
        _this.formLoading = false
      })
    }
  },
  methods: {
    submitForm() {
      const _this = this
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.formLoading = true
          if (this.$route.query.isUpdate === 1) {
            updateExamPaper(this.form).then(re => {
              if (re.code === 2000) {
                _this.$message.success(re.message)
                _this.delCurrentView(_this).then(() => {
                  _this.$router.push('/exam/list')
                })
              } else {
                _this.$message.error(re.message)
                this.formLoading = false
              }
            }).catch(e => {
              this.formLoading = false
            })
          } else {
            createExamPaper(this.form).then(re => {
              if (re.code === 2000) {
                _this.$message.success(re.message)
                _this.delCurrentView(_this).then(() => {
                  _this.$router.push('/exam/list')
                })
              } else {
                _this.$message.error(re.message)
                this.formLoading = false
              }
            }).catch(e => {
              this.formLoading = false
            })
          }
        } else {
          return false
        }
      })
    },
    addTitle() {
      this.form.titleItems.push({
        name: '',
        questionItems: []
      })
    },
    addQuestion(titleItem) {
      this.currentTitleItem = titleItem
      this.questionPage.showDialog = true
      this.search()
    },
    removeTitleItem(titleItem) {
      this.form.titleItems.remove(titleItem)
    },
    removeQuestion(titleItem, questionItem) {
      titleItem.questionItems.remove(questionItem)
    },
    queryForm() {
      this.questionPage.queryParam.pageIndex = 1
      this.search()
    },
    confirmQuestionSelect() {
      const _this = this
      this.questionPage.multipleSelection.forEach(q => {
        selectQuestion(q.id).then(re => {
          _this.currentTitleItem.questionItems.push(re.data)
        })
      })
      this.questionPage.showDialog = false
    },
    levelChange() {
      this.form.subjectId = null
      this.subjectFilter = this.subjects.filter(data => data.level === this.form.level)
    },
    search() {
      this.questionPage.queryParam.subjectId = this.form.subjectId
      this.questionPage.listLoading = true
      getQuestionList(this.pageQuery, this.questionPage.queryParam).then(response => {
        const { data } = response
        this.questionPage.tableData = data.data
        this.questionPage.total = data.total
        this.questionPage.listLoading = false
      })
    },
    handleSelectionChange(val) {
      this.questionPage.multipleSelection = val
    },
    handleBack() {
      this.form = {}
      this.$router.push('/exam/list')
    },
    questionTypeFormatter(row, column, cellValue, index) {
      return this.enumFormat(this.questionTypeEnum, cellValue)
    },
    subjectFormatter(row, column, cellValue, index) {
      return this.subjectEnumFormat(cellValue)
    },
    resetForm() {
      const lastId = this.form.id
      this.$refs['form'].resetFields()
      this.form = {
        id: null,
        level: null,
        subjectId: null,
        paperType: 1,
        limitDateTime: [],
        name: '',
        suggestTime: null,
        titleItems: []
      }
      this.form.id = lastId
    },
    ...mapActions('exam', { initSubject: 'initSubject' }),
    ...mapActions('tagsView', { delCurrentView: 'delCurrentView' })
  },
  computed: {
    ...mapGetters('enumItem', ['enumFormat']),
    ...mapState('enumItem', {
      questionTypeEnum: state => state.exam.question.typeEnum,
      paperTypeEnum: state => state.exam.examPaper.paperTypeEnum,
      levelEnum: state => state.user.levelEnum
    }),
    ...mapState('exam', { subjects: state => state.subjects })
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
