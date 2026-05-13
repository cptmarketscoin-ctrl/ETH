<template>
  <div ref="chart" class="mini-kline" :style="{ width: w + 'px', height: h + 'px' }"></div>
</template>

<script>
let echarts = null;
try { echarts = require('echarts'); } catch(e) {}

export default {
  name: 'MiniKline',
  props: {
    data: { type: Array, default: () => [] },
    w: { type: Number, default: 120 },
    h: { type: Number, default: 48 },
    isUp: { type: Boolean, default: true }
  },
  data() { return { chart: null }; },
  watch: {
    data() { this.render(); }
  },
  methods: {
    render() {
      if (!echarts || !this.data.length) return;
      if (!this.chart) this.chart = echarts.init(this.$refs.chart);
      const values = this.data.map(d => d.close || d.lastPrice || 0);
      const color = this.isUp ? '#07c160' : '#ee0a24';
      const areaColor = this.isUp ? 'rgba(7,193,96,0.08)' : 'rgba(238,10,36,0.08)';
      this.chart.setOption({
        grid: { left: 0, right: 0, top: 2, bottom: 0 },
        xAxis: { show: false, data: values.map((_, i) => i) },
        yAxis: { show: false, min: Math.min(...values) * 0.998, max: Math.max(...values) * 1.002 },
        series: [{
          type: 'line', data: values, smooth: true,
          symbol: 'none', lineStyle: { color, width: 1.5 },
          areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color }, { offset: 1, color: areaColor }
          ]) }
        }]
      }, true);
    }
  },
  mounted() { this.render(); },
  beforeDestroy() { if (this.chart) { this.chart.dispose(); this.chart = null; } }
};
</script>

<style scoped>
.mini-kline { display: inline-block; }
</style>
