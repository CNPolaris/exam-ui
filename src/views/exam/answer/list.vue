<template>
  <div class="app-container">
    <el-table :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="编号" prop="id" align="center" width="80" />
      <el-table-column label="试卷名称" prop="paperName" align="center" width="80" />
      <el-table-column label="用户名" prop="userName" align="center" width="80" />
      <el-table-column label="得分" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.userScore }}/{{ row.paperScore }}</span>
        </template>
      </el-table-column>
      <el-table-column label="题目正确" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.questionCorrect }}/{{ row.questionCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="耗时" prop="doTime" align="center" width="100" />
      <el-table-column label="提交时间" prop="createTime" align="center" width="160" :formatter="formatDateTime" />
      <el-table-column label="操作" align="center" width="85">
        <template slot-scope="{row}">
          <el-button size="mini" @click="handleJudge(row)">批改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="query.page" :limit.sync="query.limit" @pagination="getList" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import { formatDate } from '@/utils/date'
import { paperAnswerList } from '@/api/exam'
export default {
  name: 'PaperAnswerList',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      list: null,
      total: 0,
      query: {
        page: 1,
        limit: 15,
        subjectId: ''
      },
      keyQuery: {
        subjectId: null,
        createUser: null
      },
      listLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      paperAnswerList(this.query).then(re => {
        if (re.code === 2000) {
          this.list = re.data.list
          this.total = re.data.total
        }
      })
    },
    handleJudge(row) {
      this.$router.push({ path: '/exam/answer/judge', query: { id: row.id }})
    },
    formatDateTime(row, column, cellValue, index) {
      if (row.createTime === null || row.createTime === '') {
        return 'N/A'
      }
      const date = new Date(row.createTime)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    }
  }
}
</script>

<style scoped>

</style>
