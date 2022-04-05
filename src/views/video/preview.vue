<template>
  <div class="app-container">
    <el-form>
      <el-form-item>
        <el-button type="primary" @click="$router.push('/video/list')">退出</el-button>
      </el-form-item>
      <el-form-item>
        <video controls :src="url" width="400" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { selectVideo } from '@/api/video'

export default {
  name: 'PreviewVideo',
  data() {
    return {
      url: null,
      path: null
    }
  },
  created() {
    const id = this.$route.query.id
    if (id && parseInt(id) !== 0) {
      selectVideo(id).then(re => {
        this.url = re.data.url
        this.path = re.data.path
      })
    }
  }
}
</script>

<style scoped>
video {
  width: 100%;
  height: 500px;
}
</style>
