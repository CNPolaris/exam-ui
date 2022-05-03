<template>
  <div class="app-container">
    <div class="table-container">
      <el-form :inline="true">
        <el-form-item label="名称">
          <el-input v-model="queryParam.name" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="getList">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" size="small" @click="handleAdd()">添加</el-button>
        </el-form-item>
      </el-form>
      <el-table
        ref="permissionCategoryTable"
        v-loading="listLoading"
        :data="list"
        style="width: 100%"
      >
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="名称" width="340" align="center">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="创建时间" width="400" align="center">
          <template slot-scope="scope">{{ scope.row.createTime|formatDateTime }}</template>
        </el-table-column>
        <el-table-column label="排序" width="340" align="center">
          <template slot-scope="scope">{{ scope.row.sort }}</template>
        </el-table-column>

        <el-table-column label="操作" width="140" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleUpdate(scope.$index, scope.row)">编辑
            </el-button>
            <el-button size="mini" type="text" @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="添加分类"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <el-form
        ref="resourceCategoryForm"
        :model="permissionCategory"
        label-width="150px"
        size="small"
      >
        <el-form-item label="名称：">
          <el-input v-model="permissionCategory.name" style="width: 250px" />
        </el-form-item>
        <el-form-item label="排序：">
          <el-input v-model="permissionCategory.sort" style="width: 250px" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="handleDialogConfirm()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCategoryPage, deleteCategory, updateCategory, createCategory } from '@/api/category'
import { formatDate } from '@/utils/date'
const defaultPermissionCategory = {
  name: null,
  sort: 0
}
export default {
  name: 'Category',
  filters: {
    formatDateTime(time) {
      if (time == null || time === '') {
        return 'N/A'
      }
      const date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: false,
      dialogVisible: false,
      isEdit: false,
      permissionCategory: Object.assign({}, defaultPermissionCategory),
      queryParam: {
        page: 1,
        limit: 10,
        name: null
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getCategoryPage(this.queryParam).then(response => {
        this.listLoading = false
        this.list = response.data.list
        this.total = response.data.total
      })
    },
    handleAdd() {
      this.dialogVisible = true
      this.isEdit = false
      this.permissionCategory = Object.assign({}, defaultPermissionCategory)
    },
    handleUpdate(index, row) {
      this.dialogVisible = true
      this.isEdit = true
      this.permissionCategory = Object.assign({}, row)
    },
    handleDelete(index, row) {
      this.$confirm('是否要删除该分类?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCategory(row.id).then(response => {
          this.$notify({
            title: '成功',
            type: 'success',
            message: '删除成功!'
          })
          this.getList()
        })
      })
    },
    handleDialogConfirm() {
      this.$confirm('是否确认添加该分类?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.isEdit) {
          updateCategory(this.permissionCategory.id, this.permissionCategory).then(response => {
            this.$notify({
              title: '成功',
              message: '修改成功！',
              type: 'success'
            })
            this.dialogVisible = false
            this.isEdit = false
            this.getList()
          })
        } else {
          createCategory(this.permissionCategory).then(response => {
            this.$notify({
              title: '成功',
              message: '添加成功！',
              type: 'success'
            })
            this.dialogVisible = false
            this.getList()
          })
        }
      })
    }
  }
}
</script>
<style scoped>

</style>
