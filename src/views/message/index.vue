<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParam" :inline="true">
      <el-form-item label="发送者用户名：">
        <el-input v-model="queryParam.send" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column prop="id" label="Id" width="100" />
      <el-table-column prop="title" label="标题" show-overflow-tooltip />
      <el-table-column prop="content" label="内容" show-overflow-tooltip />
      <el-table-column prop="sendUserName" label="发送人" width="100" />
      <el-table-column prop="receives" label="接收人" show-overflow-tooltip />
      <el-table-column prop="readCount" label="已读数" width="70" />
      <el-table-column prop="receiveUserCount" label="接收人数" width="100" />
      <el-table-column prop="createTime" label="创建时间" width="160px" />
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParam.page"
      :limit.sync="queryParam.limit"
      @pagination="getList"
    />
  </div>
</template>

<script>

import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import { getAdminMessageList } from '@/api/message'

export default {
  components: { Pagination },
  directives: { waves },

  data() {
    return {
      listLoading: true,
      list: null,
      total: 0,
      queryParam: {
        page: 1,
        limit: 10,
        send: ''
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getAdminMessageList(this.queryParam).then(response => {
        const { data } = response
        this.list = data.data
        this.total = data.total
        this.listLoading = false
      })
    },
    submitForm() {
      this.queryParam.pageIndex = 1
      this.search()
    }
  }
}
</script>
