<template>
  <div class="app-container">
    <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
    <el-popconfirm
      v-model="visible"
      placement="top"
      width="160"
      title="是否确定要批量上传用户"
      @onConfirm="submit_form"
    >
      <el-button slot="reference" size="mini" type="danger">
        上传用户
      </el-button>
    </el-popconfirm>

    <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
      <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />
    </el-table>
  </div>
</template>

<script>
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
const { mapState } = require('vuex')
import { uploadUser } from '@/api/user'
import { formatDate } from '@/utils/date'

export default {
  name: 'UploadUser',
  components: { UploadExcelComponent },
  data() {
    return {
      tableData: [],
      tableHeader: [],
      form: [],
      showVisible: true,
      visible: false
    }
  },
  methods: {
    submit_form() {
      this.dealExcel()
      uploadUser(this.form).then(re => {
        if (re.code === 2000) {
          this.$notify({
            title: '成功',
            message: re.message,
            type: 'success',
            duration: 2000
          })
        }
      })
    },
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 5

      if (isLt1M) {
        return true
      }

      this.$notify({
        message: '请上传5M以内数据',
        type: 'warning'
      })
      return false
    },
    handleSuccess({ results, header }) {
      this.tableData = results
      this.tableHeader = header
      this.showVisible = false
    },
    dealExcel() {
      for (const item of this.tableData) {
        const temp = {}
        temp.userName = item['用户名']
        temp.realName = item['姓名']
        temp.password = item['初始密码']
        temp.roleId = this.dealRole(item['角色'])
        if (temp.roleId === 1) {
          break
        }
        temp.userLevel = this.dealLevel(item['年级'])
        temp.sex = this.dealSex(item['性别'])
        temp.age = item['年龄']
        temp.classId = item['班级']
        temp.phone = item['电话']
        temp.birthDay = this.formatDateTime(item['出生日期'])
        this.form.push(temp)
      }
    },
    formatDateTime(time) {
      if (time === null || time === '') {
        return 'N/A'
      }
      const date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd')
    },
    dealRole(role) {
      for (const item of this.roleEnum) {
        if (item.value === role) {
          return item.key
        }
      }
    },
    dealLevel(level) {
      for (const item of this.levelEnum) {
        if (item.value === level) {
          return item.key
        }
      }
    },
    dealSex(sex) {
      for (const item of this.sexEnum) {
        if (item.value === sex) {
          return item.key
        }
      }
    }
  },
  computed: {
    ...mapState('enumItem', {
      roleEnum: state => state.user.roleEnum,
      levelEnum: state => state.user.levelEnum,
      sexEnum: state => state.user.sexEnum
    })
  }
}
</script>
