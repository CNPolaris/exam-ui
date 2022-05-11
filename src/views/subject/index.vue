<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :model="listQuery" :inline="true">
        <el-form-item label="年级">
          <el-select v-model="listQuery.level">
            <el-option v-for="item in levelOptions" :key="item.value" :label="item.label" :value="item.value" />
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
        <el-form-item>
          <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">
            添加
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;" @sort-change="sortChange">
      <el-table-column label="编号" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="名称" width="267">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="年级" width="353">
        <template slot-scope="{row}">
          <span>{{ row.level|formatLevel }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="序号" width="397">
        <template slot-scope="{row}">
          <span>{{ row.itemOrder }}</span>
        </template>
      </el-table-column>

      <el-table-column label="是否启用" width="297" align="center">
        <template slot-scope="{row}">
          <el-switch v-model="row.status" :active-value="1" :inactive-value="0" @change="handleStatusChange(row)" />
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="273" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
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

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" style="text-align: center" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="名称" prop="name" label-width="140">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="年级" prop="level" label-width="140">
          <el-select v-model="temp.level" placeholder="年级">
            <el-option v-for="item in levelOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="序号" prop="itemOrder" label-width="140">
          <el-input v-model="temp.itemOrder" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-popconfirm
          v-model="visible"
          placement="top"
          width="160"
          title="是否确定要添加该项数据"
          @onConfirm="dialogStatus==='添加'?createData():updateData()"
        >
          <el-button slot="reference">
            确认
          </el-button>
        </el-popconfirm>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import { formatDate } from '@/utils/date'
import { getSubjectList, createSubject, updateSubject, updateSubjectStatus, deleteSubject } from '@/api/subject'
export default {
  name: 'SubjectList',
  components: { Pagination },
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
      listQuery: {
        page: 1,
        limit: 15,
        level: undefined
      },
      temp: {
        name: undefined,
        level: undefined,
        levelName: undefined,
        item_order: undefined
      },
      statusOptions: ['有效', '无效'],
      visible: false,
      dialogFormVisible: false,
      userDetailDialogVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      levelOptions: [
        {
          value: 1,
          label: '一年级'
        },
        {
          value: 2,
          label: '二年级'
        },
        {
          value: 3,
          label: '三年级'
        },
        {
          value: 4,
          label: '四年级'
        },
        {
          value: 5,
          label: '五年级'
        },
        {
          value: 6,
          label: '六年级'
        },
        {
          value: 7,
          label: '初一'
        },
        {
          value: 8,
          label: '初二'
        },
        {
          value: 9,
          label: '初三'
        },
        {
          value: 10,
          label: '高一'
        },
        {
          value: 11,
          label: '高二'
        },
        {
          value: 12,
          label: '高三'
        }
      ],
      subjectOptions: [
        {
          value: '数学'
        }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getSubjectList(this.listQuery).then(response => {
        const { data } = response
        this.list = data.data
        this.total = data.total
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 20)
      })
    },
    resetFilter() {
      this.listQuery = Object.assign({})
    },
    resetTemp() {
      this.temp = Object.assign({})
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$notify({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    handleDelete(row, index) {
      deleteSubject(row.id).then(response => {
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
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = '添加'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          createSubject(tempData).then(response => {
            this.list.unshift(this.temp)
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
    handleDetail(row) {
      this.temp = Object.assign({}, row)
      this.userDetailDialogVisible = true
      this.$nextTick(() => {
        this.$refs['userDetail'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row)
      this.dialogStatus = '编辑'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateSubject(tempData.id, tempData).then(response => {
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
    handleStatusChange(row) {
      this.$confirm('是否要修改该状态?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateSubjectStatus(row.id, { status: row.status }).then(response => {
          if (response.code === 2000) {
            this.$notify({
              title: '成功',
              message: response.message,
              type: 'success',
              duration: 2000
            })
          }
        })
      }).catch(() => {
        this.$notify({
          title: '失败',
          message: '',
          type: 'error',
          duration: 2000
        })
        this.getList()
      })
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
