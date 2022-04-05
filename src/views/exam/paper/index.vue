<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :model="keyQuery" :inline="true">
        <el-form-item label="试卷ID:">
          <el-input v-model="keyQuery.id" placeholder="试卷ID" style="width: 100px;" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="年级" prop="level">
          <el-select v-model="keyQuery.level" placeholder="年级" clearable @change="levelChange">
            <el-option v-for="item in levelEnum" :key="item.key" :value="item.key" :label="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="学科" prop="subjectId">
          <el-select v-model="keyQuery.subjectId" style="width: 100px">
            <el-option v-for="item in subjects" :key="item.id" :label="item.name+' ( '+item.levelName+' )'" :value="item.id" />
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
    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;" @sort-change="sortChange">
      <el-table-column label="编号" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')" />

      <el-table-column prop="name" align="center" label="名称" width="267" />

      <el-table-column prop="level" :formatter="levelFormatter" align="center" label="年级" width="353" />

      <el-table-column prop="subjectId" :formatter="subjectFormatter" align="center" label="学科" width="353" />

      <el-table-column prop="paperType" :formatter="examPaperTypeFormatter" align="center" label="试卷类型" width="397" />

      <el-table-column prop="createUser" align="center" label="创建者" width="353" />

      <el-table-column prop="createTime" :formatter="formatDateTime" align="center" label="创建时间" width="353" />

      <el-table-column label="操作" align="center" width="273" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
<!--          <el-button type="primary" size="mini" @click="handleUpdate(row)">-->
<!--            编辑-->
<!--          </el-button>-->
          <el-button size="mini" @click="$router.push({ path:'/exam/detail', query:{ id:row.id}})">查看</el-button>
          <el-button size="mini" @click="$router.push({ path:'/exam/edit', query:{ id:row.id, isUpdate: 1 }})">编辑</el-button>
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

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!--    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">-->
    <!--      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">-->
    <!--        <el-form-item label="名称" prop="name" label-width="140">-->
    <!--          <el-input v-model="temp.name" />-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="年级" prop="level" label-width="140">-->
    <!--          <el-select v-model="temp.level" placeholder="年级">-->
    <!--            <el-option v-for="item in levelOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>-->
    <!--          </el-select>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="序号" prop="itemOrder" label-width="140">-->
    <!--          <el-input v-model="temp.itemOrder" />-->
    <!--        </el-form-item>-->
    <!--      </el-form>-->
    <!--      <div slot="footer" class="dialog-footer">-->
    <!--        <el-button @click="dialogFormVisible = false">-->
    <!--          取消-->
    <!--        </el-button>-->
    <!--        <el-popconfirm-->
    <!--          v-model="visible"-->
    <!--          placement="top"-->
    <!--          width="160"-->
    <!--          title="是否确定要添加该项数据"-->
    <!--          @onConfirm="dialogStatus==='添加'?createData():updateData()"-->
    <!--        >-->
    <!--          <el-button slot="reference">-->
    <!--            确认-->
    <!--          </el-button>-->
    <!--        </el-popconfirm>-->
    <!--      </div>-->
    <!--    </el-dialog>-->
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import { formatDate } from '@/utils/date'
import { getExamPaperList, updateExamPaperStatus, deleteExamPaper, updateExamPaper } from '@/api/exam'
import { getSubjectName } from '@/api/subject'

const { mapActions, mapGetters, mapState } = require('vuex')

export default {
  name: 'PaperList',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 15
      },
      keyQuery: {
        id: undefined,
        level: undefined,
        subjectId: undefined
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
      subjectFilter: null,
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
    this.initSubject()
    this.subjectFilter = this.subjects
  },
  methods: {
    getList() {
      this.listLoading = true
      getExamPaperList(this.listQuery).then(response => {
        const { data } = response
        this.list = data.data
        this.total = data.total
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getSubjectOptions() {
      getSubjectName().then(response => {
        const { data } = response
        this.subjectOptions = data
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
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    handleDelete(row, index) {
      deleteExamPaper(row.id).then(response => {
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
    // handleCreate() {
    //   this.resetTemp()
    //   this.dialogStatus = '添加'
    //   this.dialogFormVisible = true
    //   this.$nextTick(() => {
    //     this.$refs['dataForm'].clearValidate()
    //   })
    // },
    // createData() {
    //   this.$refs['dataForm'].validate((valid) => {
    //     if (valid) {
    //       const tempData = Object.assign({}, this.temp)
    //       createSubject(tempData).then(response => {
    //         this.list.unshift(this.temp)
    //         this.dialogFormVisible = true
    //         const code = response.code
    //         if (code === 2000) {
    //           this.dialogFormVisible = false
    //           this.$notify({
    //             title: '成功',
    //             message: response.message,
    //             type: 'success',
    //             duration: 2000
    //           })
    //         } else {
    //           this.$notify({
    //             title: '失败',
    //             message: response.message,
    //             type: 'error',
    //             duration: 2000
    //           })
    //         }
    //       })
    //       this.getList()
    //     }
    //   })
    // },
    // handleDetail(row) {
    //   this.temp = Object.assign({}, row)
    //   this.userDetailDialogVisible = true
    //   this.$nextTick(() => {
    //     this.$refs['userDetail'].clearValidate()
    //   })
    // },
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
          updateExamPaper(tempData).then(response => {
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
    handleStatusChange(index, row) {
      this.$confirm('是否要修改该状态?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateExamPaperStatus(row.id, { status: row.status }).then(response => {
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消修改'
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
    levelChange() {
      this.keyQuery.subjectId = null
      this.subjectFilter = this.subjects.filter(data => data.level === this.keyQuery.level)
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },
    subjectFormatter(row, column, cellValue, index) {
      return this.subjectEnumFormat(cellValue)
    },
    levelFormatter(row, column, cellValue, index) {
      return this.enumFormat(this.levelEnum, cellValue)
    },
    examPaperTypeFormatter(row, column, cellValue, index) {
      return this.enumFormat(this.examPaperTypeEnum, cellValue)
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
  // eslint-disable-next-line vue/order-in-components
  computed: {
    ...mapGetters('enumItem', ['enumFormat']),
    ...mapState('enumItem', {
      levelEnum: state => state.user.levelEnum,
      examPaperTypeEnum: state => state.exam.examPaper.paperTypeEnum
    }),
    ...mapGetters('exam', ['subjectEnumFormat']),
    ...mapState('exam', { subjects: state => state.subjects })
  }
}
</script>

<style scoped>

</style>
