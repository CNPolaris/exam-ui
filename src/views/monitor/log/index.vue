<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :model="queryParam" :inline="true">
        <el-form-item label="用户名">
          <el-input v-model="queryParam.username" placeholder="用户名" style="width: 100px;" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item>
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="resetFilter">
            重置
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            搜索
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :key="tableKey" v-loading="listLoading" :data="list" style="width: 100%;">
      <el-table-column label="编号" prop="id" align="center" width="150" />
      <el-table-column label="用户名" prop="userName" align="center" width="250" />
      <el-table-column label="ip" prop="ip" align="center" width="250" />
      <el-table-column label="登陆地址" prop="address" align="center" width="250" />
      <el-table-column label="浏览器" prop="browser" align="center" width="251" />
      <el-table-column label="登录时间" prop="loginTime" :formatter="formatDateTime" align="center" width="518" />
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryParam.page" :limit.sync="queryParam.limit" @pagination="getList" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import { formatDate } from '@/utils/date'
import { loginLog } from '@/api/monitor'
export default {
  name: 'LoginLog',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      queryParam: {
        page: 1,
        limit: 15,
        username: ''
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      loginLog(this.queryParam).then(response => {
        const { data } = response
        this.list = data.data
        this.total = data.total
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    resetFilter() {
      this.queryParam.username = ''
    },
    handleFilter() {
      this.queryParam.page = 1
      this.getList()
    },
    formatDateTime(row, column, cellValue, index) {
      if (row.loginTime === null || row.loginTime === '') {
        return 'N/A'
      }
      const date = new Date(row.loginTime)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    }
  }
}
</script>

<style scoped>

</style>
