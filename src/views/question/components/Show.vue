<template>
  <div style="line-height:1.8">
    <div v-if="qType===1" v-loading="qLoading">
      <div class="q-title" v-html="question.title" />
      <div class="q-content">
        <!--        <span v-for="item in question.items" :key="item.id" class="q-item-contain">-->
        <!--          <span class="q-item-prefix">{{ item.prefix }}</span>-->
        <!--          <span class="q-item-content" v-html="item.content" />-->
        <!--        </span>-->

        <span v-for="item in question.items" :key="item.id" class="q-item-contain">
          <el-tag>{{ item.prefix }}</el-tag>
          <span class="q-item-content" v-html="item.content" />
          <br>
        </span>
      </div>
    </div>
    <div v-else-if="qType===2" v-loading="qLoading">
      <div class="q-title" v-html="question.title" />
      <div class="q-content">
        <span v-for="item in question.items" :key="item.id" class="q-item-contain">
          <!--          <span class="q-item-prefix">{{ item.prefix }}</span>-->
          <!--          <span class="q-item-content" v-html="item.content" />-->
          <el-tag>{{ item.prefix }}</el-tag>
          <span class="q-item-content" v-html="item.content" />
          <br>
        </span>
      </div>
    </div>
    <div v-else-if="qType===3" v-loading="qLoading">
      <div class="q-title" style="display: inline;margin-right: 10px" v-html="question.title" />
      <!--      <span>（</span>-->
      <!--      <span v-for="item in question.items" :key="item.id">-->
      <!--        <span class="q-item-content" v-html="item.content" />-->
      <!--      </span>-->
      <!--      <span>）</span>-->
      <br>
      <span v-for="item in question.items" :key="item.id">
        <el-tag>{{ item.prefix }}</el-tag><span class="q-item-content" v-html="item.content" />
        <br>
      </span>
    </div>
    <div v-else-if="qType===4" v-loading="qLoading">
      <div class="q-title" v-html="question.title" />
    </div>
    <div v-else-if="qType===5" v-loading="qLoading">
      <div class="q-title" v-html="question.title" />
      <el-input type="textarea" />
    </div>
    <div v-else />
  </div>

</template>

<script>
export default {
  name: 'QuestionShow',
  props: {
    question: {
      type: Object,
      default: function() {
        return {}
      }
    },
    qLoading: {
      type: Boolean,
      default: false
    },
    qType: {
      type: Number,
      default: 0
    }
  },
  methods: {}
}
</script>

