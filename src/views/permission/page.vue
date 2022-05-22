<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :model="param" :inline="true">
        <el-form-item label="名称">
          <el-input v-model="param.name" placeholder="name" style="width: 100px;" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="资源定位符">
          <el-input v-model="param.url" placeholder="url" style="width: 100px;" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="param.status" placeholder="status" clearable style="width: 90px" class="filter-item">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
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
          <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
            添加
          </el-button>
        </el-form-item>
      </el-form>
      <!--      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" :disabled="initialRole==='admin'?false:true" @click="handleDownload">-->
      <!--        导出-->
      <!--      </el-button>-->
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="id" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="categoryName" align="center" label="类别" width="178" />
      <el-table-column align="center" label="名称" width="200">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="资源定位符" width="350">
        <template slot-scope="{row}">
          <span>{{ row.url }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="描述" width="300">
        <template slot-scope="{row}">
          <span>{{ row.description }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建时间" width="190">
        <template slot-scope="{row}">
          <span>{{ row.createTime| formatDateTime }}</span>
        </template>
      </el-table-column>

      <!--      <el-table-column align="center" label="有效状态" width="100">-->
      <!--        <template slot-scope="{row}">-->
      <!--          <span>{{ row.status|statusFormat }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column label="是否启用" width="140" align="center">
        <template slot-scope="{row}">
          <el-switch v-model="row.status" :active-value="1" :inactive-value="0" @change="handleStatusChange(row)" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
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
        <el-form-item label="资源定位符" prop="url" label-width="140">
          <el-input v-model="temp.url" />
        </el-form-item>
        <el-form-item label="权限类别" prop="categoryName">
          <el-select v-model="temp.categoryId">
            <el-option v-for="item in categoryList" :key="item.id" :value="item.id" :label="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description" label-width="140">
          <el-input v-model="temp.description" />
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
          @onConfirm="dialogStatus==='create'?createData():updateData()"
        >
          <el-button slot="reference">
            确认
          </el-button>
        </el-popconfirm>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getPermissionList, deletePermission, addPermission, updatePermission, updatePermissionStatus } from '@/api/permission'
import { getCategoryList } from '@/api/category'
import { formatDate } from '@/utils/date'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
export default {
  name: 'PagePermission',
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
        limit: 15
      },
      param: {
        name: undefined,
        url: undefined,
        description: undefined,
        status: undefined
      },
      searchKeyWord: {
        name: undefined,
        url: undefined,
        status: undefined
      },
      initialRole: '3',
      importanceOptions: [1, 0],
      statusOptions: ['有效', '无效'],
      showReviewer: false,
      temp: {
        name: undefined,
        url: undefined,
        description: undefined,
        categoryId: undefined
      },
      categoryList: [],
      visible: false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getPermissionList(this.listQuery, this.searchKeyWord).then(response => {
        const { data } = response
        this.list = data.data
        this.total = data.total
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 20)
      })
    },
    resetFilter() {
      this.param = Object.assign({})
    },
    handleFilter() {
      this.listQuery.page = 1
      this.searchKeyWord.name = this.param.name
      this.searchKeyWord.url = this.param.url
      if (this.param.status === '有效') {
        this.searchKeyWord.status = 1
      } else {
        this.searchKeyWord.status = 0
      }
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
      deletePermission(row.id).then(response => {
        if (response.code === 2000) {
          this.$notify({
            title: 'Success',
            message: response.message,
            type: 'success',
            duration: 2000
          })
          this.list.splice(index, 1)
        } else {
          this.$notify({
            title: 'UnSuccess',
            message: response.message,
            type: 'error',
            duration: 2000
          })
          this.list.splice(index, 1)
        }
      })
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = 'id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        name: undefined,
        url: undefined,
        description: undefined
      }
    },
    resetParam() {
      this.param = {
        name: undefined,
        url: undefined,
        status: undefined
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      getCategoryList().then(re => {
        this.categoryList = re.data
      })
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addPermission(this.temp).then(response => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = true
            const code = response.code
            if (code === 2000) {
              this.dialogFormVisible = false
              this.$notify({
                title: 'Success',
                message: response.message,
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify({
                title: 'UnSuccess',
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
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      getCategoryList().then(re => {
        this.categoryList = re.data
      })
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updatePermission(tempData).then(response => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = true
            const code = response.code
            if (code === 2000) {
              this.dialogFormVisible = false
              this.$notify({
                title: 'Success',
                message: response.message,
                type: 'success',
                duration: 2000
              })
              this.getList()
            } else {
              this.$notify({
                title: 'UnSuccess',
                message: response.message,
                type: 'error',
                duration: 2000
              })
            }
          })
        }
      })
    },
    handleStatusChange(row) {
      this.$confirm('是否要修改该状态?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updatePermissionStatus(row.id, { status: row.status }).then(response => {
          this.$notify({
            type: 'success',
            message: '修改成功!'
          })
        })
      }).catch(() => {
        this.$notify({
          type: 'info',
          message: '取消修改'
        })
        this.getList()
      })
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
