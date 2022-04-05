<template>
  <div class="block">
    <span>登录记录</span>
    <el-timeline>
      <el-timeline-item
        v-for="(activity, index) in loginLog"
        :key="index"
        :timestamp="activity.loginTime"
      >
        {{ activity.address }}
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
export default {
  props: ['loginLog']
}
</script>
