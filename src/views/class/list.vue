<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :model="filterQuery" :inline="true">
        <el-form-item label="班级名">
          <el-input v-model="filterQuery.className" place-holder="班级名称" style="width: 100px;" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item>
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column prop="id" label="序号" width="90px" align="center" />
      <el-table-column prop="className" label="班级名称" width="300px" align="center" />
      <el-table-column prop="classCode" label="班级口令" width="425px" align="center" />
      <el-table-column prop="level" label="年级" width="150px" align="center" :formatter="levelFormatter" />
      <el-table-column prop="classCount" label="班级人数" width="100px" align="center" />
      <el-table-column prop="createTime" label="创建时间" width="300px" align="center" :formatter="formatDateTime" />
      <el-table-column label="操作" align="center" width="300px" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="success" size="mini" @click="$router.push({ path: '/class/student', query: { id: row.id}})">
            详情
          </el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
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
    <pagination v-show="total>0" :total="total" :page.sync="query.page" :limit.sync="query.limit" style="text-align: center" @pagination="getList" />

    <el-dialog :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="id" prop="id" label-width="140">
          <a>{{ temp.id }}</a>
        </el-form-item>
        <el-form-item label="班级名称" prop="className" label-width="140">
          <el-input v-model="temp.className" />
        </el-form-item>
        <el-table-column label="年级" prop="level" label-width="140">
          <el-select v-model="temp.level">
            <el-option v-for="item in levelEnum" :key="item.key" :value="item.key" :label="item.value" />
          </el-select>
        </el-table-column>
        <el-form-item label="班级人数" prop="classCount" label-width="140">
          <a>{{ temp.classCount }}</a>
        </el-form-item>
        <el-form-item label="班级口令" prop="classCode" label-width="320">
          <a>{{ temp.classCode }}</a>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-popconfirm
          v-model="visible"
          placement="top"
          width="160"
          title="是否确定要修改该项数据"
          @onConfirm="updateData()"
        >
          <el-button slot="reference" type="primary">
            确认
          </el-button>
        </el-popconfirm>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import { getClassList, deleteClass, editClass, getStudentList } from '@/api/classes'
import { formatDate } from '@/utils/date'

export default {
  name: 'ClassList',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      list: null,
      total: 0,
      studentList: null,
      query: {
        page: 1,
        limit: 15,
        name: ''
      },
      filterQuery: {
        className: null
      },
      temp: {
        className: undefined
      },
      listLoading: false,
      visible: false,
      dialogFormVisible: false,
      detailDialogVisible: false
    }
  },
  computed: {
    ...mapGetters('enumItem', ['enumFormat']),
    ...mapState('enumItem', {
      levelEnum: state => state.user.levelEnum
    })
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getClassList(this.query).then(response => {
        const { data } = response
        this.list = data.list
        this.total = data.total
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 20)
      })
    },
    handleFilter() {
      if (this.filterQuery.className === null) {
        this.query.name = ''
      } else {
        this.query.name = this.filterQuery.className
      }
      this.getList()
    },
    handleDelete(row, index) {
      deleteClass(row.id).then(re => {
        this.$notify({
          title: '成功',
          message: re.message,
          type: 'success',
          duration: 2000
        })
      })
    },
    handleUpdate(row, index) {
      this.temp = Object.assign({}, row)
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          editClass(tempData).then(response => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = true
            const code = response.code
            if (code === 2000) {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: response.message,
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify({
                title: '失败',
                message: response.message,
                type: 'error',
                duration: 2000
              })
            }
          })
          this.getList()
        }
      })
    },
    handleDetail(row, index) {
      getStudentList(row.id).then(re => {
        this.studentList = re.data
        this.$router.push({ path: '/class/student', params: { list: this.studentList }})
      })
    },
    formatDateTime(row, column, cellValue, index) {
      if (row.createTime === null || row.createTime === '') {
        return 'N/A'
      }
      const date = new Date(row.createTime)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    },
    formatSex(sex) {
      switch (sex) {
        case 1:
          return '男'
        case 0:
          return '女'
      }
    },
    levelFormatter(row, column, cellValue, index) {
      return this.enumFormat(this.levelEnum, cellValue)
    }
  }
}
</script>
