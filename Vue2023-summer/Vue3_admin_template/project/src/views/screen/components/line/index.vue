<template>
  <div class="linebox">
    <div class="title">
      <p>未来7天游客量趋势图</p>
      <img src="../../images/dataScreen-title.png" alt="">
    </div>
    <div class="charts" ref="line"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';

// 获取DOM节点
let line = ref();
onMounted(() => {
  let mychart = echarts.init(line.value);
  // 设置配置项
  mychart.setOption({
    // 标题
    title: {
      // text: '访问量'

    },
    // x|y轴
    xAxis: {
      type: 'category',
      //两侧不留白
      boundaryGap: false,
      //分割线不要
      splitLine: {
        show: false,
      },
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      //轴线的设置
      axisLine: {
        show: true,
      },
      // 刻度
      axisTick: {
        show: true,
      }
    },
    yAxis: {//分割线不要
      splitLine: {
        show: false,
      },
      //轴线的设置
      axisLine: {
        show: true,
      },
      // 刻度
      axisTick: {
        show: true,
      }
    },
    // 图表位置
    grid: {
      left: 40,
      right: 20,
      top: 20,
      bottom: 20,
      // grid 区域是否包含坐标轴的刻度标签。
      containLabel:false,
    },
    // 系列
    series: [
      {
        type: 'line',
        data: [100, 800, 400, 120, 80, 900, 20, 700],
        // 平滑曲线
        smooth: true,
        // 区域填充样式
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: ' #7C6339' // 0% 处的颜色
            }, {
              offset: 1, color: '#24284C' // 100% 处的颜色
            }],
            global: false // 缺省为 false
          }
        },
        // 折线颜色
        lineStyle: {
          color: '#7C6339'
        },
       

      }
    ]
  })
})
</script>

<style scoped lang="scss">
.linebox {
  width: 95.5%;
  height: 100%;
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  margin: 0px 20px;

  .title {
    margin-left: 10px;

    p {
      color: white;
      font-size: 20px;
    }
  }

  .charts {
    height: calc(100% - 40px);

  }
}
</style>