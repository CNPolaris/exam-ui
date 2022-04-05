<template>
  <div class="app-container">
    <el-button @click="back">返回</el-button>
    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="编号" prop="id" sortable="custom" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="真实姓名" width="140">
        <template slot-scope="{row}">
          <span>{{ row.realName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="性别" width="140">
        <template slot-scope="{row}">
          <span>{{ row.sex|formatSex }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="电话" width="140">
        <template slot-scope="{row}">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="注册时间" width="180">
        <template slot-scope="{row}">
          <span>{{ row.createTime|formatDateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="最后一次登录时间" width="180">
        <template slot-scope="{row}">
          <span>{{ row.lastActiveTime|formatDateTime }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import waves from '@/directive/waves'
import { formatDate } from '@/utils/date'
export default {
  name: 'StudentList',
  directives: { waves },
  filters: {
    formatDateTime(time) {
      if (time == null || time === '') {
        return 'N/A'
      }
      const date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    },
    statusFormat(status) {
      if (status === 1) {
        return '有效'
      }
      return '无效'
    },
    formatRole(roleId) {
      switch (roleId) {
        case 1:
          return '超级管理员'
        case 2:
          return '教师'
        case 3:
          return '学生'
        default:
          return '游客'
      }
    },
    formatSex(sex) {
      switch (sex) {
        case '1':
          return '男'
        case '0':
          return '女'
      }
    },
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
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      visible: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      this.list = this.$route.query.list
      this.listLoading = false
    },
    back() {
      this.$router.push('/class/list')
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>

<style scoped>

</style>
