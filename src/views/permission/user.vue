<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :model="keyWord" :inline="true">
        <el-form-item label="用户名">
          <el-input v-model="keyWord.userName" placeholder="用户名" style="width: 100px;" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="年级">
          <el-input v-model="keyWord.userLevel" placeholder="年级" style="width: 100px;" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="keyWord.phone" placeholder="电话" style="width: 100px;" class="filter-item" @keyup.enter.native="handleFilter" />
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
      <el-table-column label="id" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="用户名" width="140">
        <template slot-scope="{row}">
          <span>{{ row.userName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="真实姓名" width="140">
        <template slot-scope="{row}">
          <span>{{ row.realName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="性别" width="80">
        <template slot-scope="{row}">
          <span>{{ row.sex|formatSex }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="电话" width="200">
        <template slot-scope="{row}">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="角色" width="140">
        <template slot-scope="{row}">
          <span>{{ row.roleId|formatRole }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="注册时间" width="180">
        <template slot-scope="{row}">
          <span>{{ row.createTime|formatDateTime }}</span>
        </template>
      </el-table-column>

      <!--      <el-table-column align="center" label="更新时间" width="180">-->
      <!--        <template slot-scope="{row}">-->
      <!--          <span>{{ row.modifyTime|formatDateTime }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->

      <el-table-column align="center" label="最后一次登录时间" width="180">
        <template slot-scope="{row}">
          <span>{{ row.lastActiveTime|formatDateTime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="是否启用" width="100" align="center">
        <template slot-scope="{row}">
          <el-switch v-model="row.status" :active-value="1" :inactive-value="0" @change="handleStatusChange(row)" />
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="410" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="small" @click="handleDetail(row)">
            详情
          </el-button>
          <el-button type="primary" size="small" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="success" size="small" @click="handleUpdatePassword(row.id)">修改密码</el-button>
          <el-popconfirm
            v-model="visible"
            placement="top"
            width="160"
            title="是否确定要删除该项数据"
            @onConfirm="handleDelete(row, $index)"
          >
            <el-button slot="reference" size="small" type="danger">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="pageQuery.page" :limit.sync="pageQuery.limit" style="text-align: center" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="用户名" prop="userName" label-width="140">
          <el-input v-model="temp.userName" />
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName" label-width="140">
          <el-input v-model="temp.realName" />
        </el-form-item>
        <el-form-item label="电话" prop="phone" label-width="140">
          <el-input v-model="temp.phone" />
        </el-form-item>
        <el-form-item label="年级" prop="userLevel" label-width="140">
          <el-input v-model="temp.userLevel" />
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="temp.sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="分配角色">
          <el-radio-group v-model="temp.roleId">
            <el-radio :label="1">超级管理员</el-radio>
            <el-radio :label="2">教师</el-radio>
            <el-radio :label="3">学生</el-radio>
          </el-radio-group>
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

    <el-dialog title="用户详情" :visible.sync="userDetailDialogVisible">
      <el-form ref="userDetail" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="用户名" label-width="140px">
          <span>{{ temp.userName }}</span>
        </el-form-item>
        <el-form-item label="真实姓名" label-width="140px">
          <span>
            {{ temp.realName }}
          </span>
        </el-form-item>
        <el-form-item label="头像" label-width="140px">
          <el-image style="width: 60px; height: 60px" :src="temp.avatar" />
        </el-form-item>
        <el-form-item label="角色" label-width="140px">
          <span>
            {{ temp.roleId|formatRole }}
          </span>
        </el-form-item>
        <el-form-item label="性别" label-width="140px">
          <span>
            {{ temp.sex|formatSex }}
          </span>
        </el-form-item>
        <el-form-item label="年龄" label-width="140px">
          <span>
            {{ temp.age }}
          </span>
        </el-form-item>
        <el-form-item label="年级" label-width="140px">
          <span>
            {{ temp.userLevel|formatLevel }}
          </span>
        </el-form-item>
        <el-form-item label="创建时间" label-width="140px">
          <span>
            {{ temp.createTime|formatDateTime }}
          </span>
        </el-form-item>
        <el-form-item label="更新时间" label-width="140px">
          <span>
            {{ temp.modifyTime|formatDateTime }}
          </span>
        </el-form-item>
        <el-form-item label="最后一次登录时间" label-width="140px">
          <span>
            {{ temp.lastActiveTime|formatDateTime }}
          </span>
        </el-form-item>
        <el-form-item label="用户状态" label-width="140px">
          <span>
            {{ temp.status|statusFormat }}
          </span>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog :title="'修改密码'" :visible.sync="passwordEditVisible">
      <el-form :model="temp" :inline="true" label-position="left" style="width: 400px; margin-left:50px;">
        <el-form-item label="密码(不低于六位)">
          <el-input v-model="temp.password" placeholder="请输入新密码" style="width: 200px" />
        </el-form-item>
        <el-form-item>
          <el-button @click="updatePassword">确认</el-button>
          <el-button @click="passwordEditVisible = false">取消</el-button>
        </el-form-item>

      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getUserList, deleteUser, updateUser, createUser, updateUserStatus, updateUserPassword } from '@/api/user'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import { formatDate } from '@/utils/date'

export default {
  name: 'UserList',
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
        case 1:
          return '男'
        case 0:
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
      pageQuery: {
        page: 1,
        limit: 15
      },
      queryParam: {
        userName: undefined,
        realName: undefined,
        age: undefined,
        sex: undefined,
        userLevel: undefined,
        phone: undefined,
        roleId: undefined,
        status: undefined
      },
      keyWord: {
        userName: undefined,
        userLevel: undefined,
        phone: undefined
      },
      statusOptions: ['有效', '无效'],
      temp: {
        userName: undefined,
        passWord: undefined,
        realName: undefined,
        age: undefined,
        sex: undefined,
        userLevel: undefined,
        phone: undefined,
        roleId: undefined,
        password: null,
        id: null
      },
      visible: false,
      dialogFormVisible: false,
      dialogStatus: '',
      passwordEditVisible: false,
      userDetailDialogVisible: false,
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
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
      getUserList(this.pageQuery, this.keyWord).then(response => {
        const { data } = response
        this.list = data.data
        this.total = data.total
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 20)
      })
    },
    resetFilter() {
      this.keyWord = Object.assign({})
    },
    resetTemp() {
      this.temp = Object.assign({})
    },
    resetParam() {
      this.queryParam = Object.assign({})
    },
    handleFilter() {
      this.pageQuery.page = 1
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
      deleteUser(row.id).then(response => {
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
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          createUser(tempData).then(response => {
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
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateUser(tempData.id, tempData).then(response => {
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
    handleUpdatePassword(id) {
      this.passwordEditVisible = true
      this.temp.id = id
    },
    updatePassword() {
      if (this.temp.password !== null && this.temp.password.length >= 6) {
        updateUserPassword(this.temp.id, this.temp).then(re => {
          if (re.code === 2000) {
            this.passwordEditVisible = false
            this.$notify({
              type: 'success',
              message: '修改成功!'
            })
          } else {
            this.$notify({
              type: 'error',
              message: re.message
            })
          }
        })
      } else {
        this.$notify({
          type: 'error',
          message: '新密码不足六位！'
        })
      }
    },
    handleStatusChange(row) {
      this.$confirm('是否要修改该状态?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateUserStatus(row.id, { status: row.status }).then(response => {
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
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    getSortClass: function(key) {
      const sort = this.pageQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>

<style scoped>

</style>
