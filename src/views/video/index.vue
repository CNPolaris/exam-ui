<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :model="query" :inline="true">
        <el-form-item label="学科" prop="subjectId">
          <el-select v-model="query.subjectId" style="width: 100px">
            <el-option v-for="item in subjects" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
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
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column prop="id" label="Id" align="center" width="90px" />
      <el-table-column prop="name" label="视频名称" align="center" width="275px" />
      <el-table-column prop="level" :formatter="levelFormatter" align="center" label="年级" width="200px" />
      <el-table-column prop="subjectId" label="学科" :formatter="subjectFormatter" align="center" width="120px" />
      <el-table-column label="标签" prop="tags" align="center" width="430px">
        <template slot-scope="{row}">
          <el-tag v-for="item in row.tags" :key="item">
            {{ item }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" :formatter="formatDateTime" align="center" width="226px" />
      <el-table-column label="操作" align="center" width="326" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="$router.push({ path:'/video/edit', query:{ id:row.id, isUpdate: 1 }})">编辑</el-button>
          <el-button type="primary" size="mini" @click="$router.push({ path: '/video/preview', query:{ id: row.id }})">预览</el-button>
          <el-popconfirm
            v-model="visible"
            placement="top"
            width="160"
            title="是否确定要删除该项数据"
            @onConfirm="handleDelete(row, $index)"
          >
            <el-button slot="reference" size="mini" type="danger">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="query.page" :limit.sync="query.limit" @pagination="getList" />
  </div>
</template>

<script>
import { videoList, deleteVideo } from '@/api/video'
import { formatDate } from '@/utils/date'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'

const { mapActions, mapGetters, mapState } = require('vuex')

export default {
  name: 'VideoList',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      visible: false,
      query: {
        page: 1,
        limit: 15,
        subjectId: null
      },
      subjectFilter: null
    }
  },
  created() {
    this.getList()
    this.initSubject()
  },
  methods: {
    getList() {
      videoList(this.query).then(response => {
        const { data } = response
        if (response.code === 2000) {
          this.$notify({
            type: 'success',
            message: '成功!'
          })
          this.list = data.data
          this.total = data.total
          this.listLoading = false
        }
      })
    },
    resetFilter() {
      this.query.subjectId = null
    },
    handleDelete(row, index) {
      deleteVideo(row.id).then(response => {
        if (response.code === 2000) {
          this.$notify({
            title: '成功',
            message: response.message,
            type: 'success',
            duration: 2000
          })
          this.list.splice(index, 1)
        } else {
          this.$notify({
            title: '失败',
            message: response.message,
            type: 'error',
            duration: 2000
          })
          this.list.splice(index, 1)
        }
      })
    },
    handleFilter() {
      this.query.page = 1
      this.getList()
    },
    subjectFormatter(row, column, cellValue, index) {
      return this.subjectEnumFormat(cellValue)
    },
    levelFormatter(row, column, cellValue, index) {
      return this.enumFormat(this.levelEnum, cellValue)
    },
    formatDateTime(row, column, cellValue, index) {
      if (row.createTime === null || row.createTime === '') {
        return 'N/A'
      }
      const date = new Date(row.createTime)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    },
    ...mapActions('exam', { initSubject: 'initSubject' })
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
  }
}
</script>

<style scoped>

</style>
