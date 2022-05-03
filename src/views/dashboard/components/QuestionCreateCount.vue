<template>
  <div :style="{height: height, width: width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from '../../../utils/resize'
import { getQuestionCreateCount } from '@/api/dashboard'
import { formatDate } from '@/utils/date'

export default {
  name: 'QuestionCreateCount',
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      chart: null,
      questionData: {
        date: [],
        count: []
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
    this.timer = setInterval(() => {
      setTimeout(this.initChart, 0)
    }, 1000 * 60 * 10)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    async initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      await getQuestionCreateCount().then(re => {
        for (let i = 0; i < re.data.length; i++) {
          this.questionData.date.push(this.formatDateTime(re.data[i].date))
          this.questionData.count.push(re.data[i].count)
        }
      })
      this.chart.setOption({
        title: {
          text: '题库情况'
        },
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.questionData.date
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: this.questionData.count,
            stack: 'Total',
            type: 'line'
          }
        ]
      })
    },
    formatDateTime(time) {
      if (time == null || time === '') {
        return 'N/A'
      }
      const date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd')
    }
  }
}
</script>
