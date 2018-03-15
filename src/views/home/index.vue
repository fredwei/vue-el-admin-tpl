<template>
  <div class="dashboard-editor-container">
    <panel-group :totalData="totalData" :activeType="activeType" @handleSetLineChartData="handleSetLineChartData"></panel-group>

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData"></line-chart>
    </el-row>
  </div>
</template>

<script>
// 数据接口
import { fetchData } from '@/api/home'
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'

export default {
  name: 'home',
  components: {
    PanelGroup,
    LineChart
  },
  data() {
    return {
      activeType: '',
      totalData: [],
      lineChartData: {
        expectedData: [],
        actualData: []
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    // 获取统计数据
    getData() {
      fetchData().then(response => {
        this.totalData = response.data
        this.lineChartData = response.data[0]
        this.activeType = response.data[0].dkey
        console.log(response)
      }).catch((error) => {
        console.log(error)
      })
    },
    // 切换数据源
    handleSetLineChartData(type) {
      const that = this
      for (var value of that.totalData) {
        if (value.dkey === type) {
          that.activeType = type
          that.lineChartData = value
        }
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
</style>
