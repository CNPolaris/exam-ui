<template>
  <div class="app-container">
    <div>
      <el-row :gutter="20">

        <el-col :span="6" :xs="24">
          <user-card :user-info="userInfo" />
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs active-name="timeline">
              <el-tab-pane label="时间线" name="timeline">
                <timeline :loginLog="loginLog" />
              </el-tab-pane>
              <el-tab-pane label="账号" name="account">
                <account :userInfo="userInfo" />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'
import Timeline from './components/Timeline'
import Account from './components/Account'
import { getInfo } from '@/api/user'
import { getUserLastLog } from '@/api/log'

export default {
  name: 'Profile',
  components: { UserCard, Timeline, Account },
  data() {
    return {
      userInfo: {
        realName: '',
        phone: '',
        lastActiveTime: '',
        createTime: '',
        role: '1',
        avatar: null
      },
      loginLog: null
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles'
    ])
  },
  created() {
    this.getUser()
    this.getLoginLog()
  },
  methods: {
    getUser() {
      const _this = this
      getInfo().then(response => {
        _this.userInfo = response.data
      })
    },
    getLoginLog() {
      getUserLastLog().then(response => {
        this.loginLog = response.data
      })
    }
  }
}
</script>
