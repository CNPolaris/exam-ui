<template>
  <el-card class="form-container" shadow="never">
    <div v-for="(cate,index) in allPermissionCate" :key="'cate'+cate.id" :class="index===0?'top-line':null">
      <el-row class="table-layout" style="background: #F2F6FC;">
        <el-checkbox v-model="cate.checked" :indeterminate="isIndeterminate(cate.id)" @change="handleCheckAllChange(cate)">
          {{ cate.name }}
        </el-checkbox>
      </el-row>
      <el-row class="table-layout">
        <el-col v-for="permission in getPermissionByCate(cate.id)" :key="permission.id" :span="8" style="padding: 4px 0">
          <el-checkbox v-model="permission.checked" @change="handleCheckChange(permission)">
            {{ permission.name }}
          </el-checkbox>
        </el-col>
      </el-row>
    </div>
    <div style="margin-top: 20px" align="center">
      <el-button type="primary" @click="handleSave()">保存</el-button>
      <el-button @click="handleClear()">清空</el-button>
    </div>
  </el-card>
</template>

<script>
import { allPermissionList, selectPermissionByRoleId, allocatePermission, selectPermissionByCategory } from '@/api/permission'
import { getCategoryList } from '@/api/category'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
export default {
  name: 'AllocatePermission',
  directives: { waves },
  data() {
    return {
      roleId: null,
      allPermission: null,
      allPermissionCate: null,
      param: {
        roleId: undefined,
        permissionIds: undefined
      }
    }
  },
  created() {
    this.roleId = this.$route.query.roleId
    this.getAllPermissionCateList()
  },
  methods: {
    getAllPermission() {
      allPermissionList().then(response => {
        this.allPermission = response.data
        for (let i = 0; i < this.allPermission.length; i++) {
          this.allPermission[i].checked = false
        }
        this.getPermissionByRole(this.roleId)
      })
    },
    getAllPermissionCateList() {
      getCategoryList().then(response => {
        this.allPermissionCate = response.data
        for (let i = 0; i < this.allPermissionCate.length; i++) {
          this.allPermissionCate[i].checked = false
        }
        this.getAllPermission()
      })
    },
    getPermissionByCate(categoryId) {
      const catePermission = []
      if (this.allPermission === null) return null
      for (let i = 0; i < this.allPermission.length; i++) {
        const permission = this.allPermission[i]
        if (permission.categoryId === categoryId) {
          catePermission.push(permission)
        }
      }
      return catePermission
    },
    getPermissionByRole(roleId) {
      selectPermissionByRoleId(roleId).then(response => {
        const allocPermission = response.data
        this.allPermission.forEach(item => {
          item.checked = this.getPermissionChecked(item.id, allocPermission)
        })
        this.allPermissionCate.forEach(item => {
          item.checked = this.isAllChecked(item.id)
        })
        this.$forceUpdate()
      })
    },
    getPermissionChecked(permissionId, allocatedPermission) {
      if (allocatedPermission === null || allocatedPermission.length === 0) return false
      for (let i = 0; i < allocatedPermission.length; i++) {
        if (allocatedPermission[i].id === permissionId) {
          return true
        }
      }
      return false
    },
    isIndeterminate(categoryId) {
      const catePermission = this.getPermissionByCate(categoryId)
      if (catePermission === null) return false
      let checkedCount = 0
      for (let i = 0; i < catePermission.length; i++) {
        if (catePermission[i].checked === true) {
          checkedCount++
        }
      }
      return !(checkedCount === 0 || checkedCount === catePermission.length)
    },
    isAllChecked(categoryId) {
      const catePermission = this.getPermissionByCate(categoryId)
      if (catePermission === null) return false
      let checkedCount = 0
      for (let i = 0; i < catePermission.length; i++) {
        if (catePermission[i].checked === true) {
          checkedCount++
        }
      }
      if (checkedCount === 0) {
        return false
      }
      return checkedCount === catePermission.length
    },
    handleSave() {
      this.$confirm('是否分配资源？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const checkedPermissionIds = new Set()
        if (this.allPermission != null && this.allPermission.length > 0) {
          this.allPermission.forEach(item => {
            if (item.checked) {
              checkedPermissionIds.add(item.id)
            }
          })
        }
        this.param.roleId = this.roleId
        this.param.permissionIds = Array.from(checkedPermissionIds)
        allocatePermission(this.param).then(response => {
          this.$notify({
            message: '分配成功',
            type: 'success',
            duration: 1000
          })
          this.$router.back()
        })
      })
    },
    handleClear() {
      this.allPermissionCate.forEach(item => {
        item.checked = false
      })
      this.allPermission.forEach(item => {
        item.checked = false
      })
      this.$forceUpdate()
    },
    handleCheckAllChange(cate) {
      const catePermission = this.getPermissionByCate(cate.id)
      for (let i = 0; i < catePermission.length; i++) {
        catePermission[i].checked = cate.checked
      }
      this.$forceUpdate()
    },
    handleCheckChange(permission) {
      this.allPermissionCate.forEach(item => {
        if (item.id === permission.categoryId) {
          item.checked = this.isAllChecked(permission.categoryId)
        }
      })
      this.$forceUpdate()
    }
  }
}

</script>

<style lang="scss" scoped>
.app-container {
  ::v-deep .permission-alert {
    width: 320px;
    margin-top: 15px;
    background-color: #f0f9eb;
    color: #67c23a;
    padding: 8px 16px;
    border-radius: 4px;
    display: inline-block;
  }
  ::v-deep .permission-sourceCode {
    margin-left: 15px;
  }
  ::v-deep .permission-tag {
    background-color: #ecf5ff;
  }
}
</style>

