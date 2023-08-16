<template>
  <div class="yearbox">
    <div class="title">
      <p>年度游客量</p>
      <img src="../../images/dataScreen-title.png" alt="">
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script  setup lang="ts">
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';

// 获取图形图标的DOM节点
let charts = ref();

onMounted(() => {
  let mychart = echarts.init(charts.value);
  mychart.setOption({
    // 设置配置项
    title:{
      text:'散点图',
      left:"center",
      textStyle:{
        color:'white',
        fontSize:'15px',
      
      }
    },
    xAxis:{
      // 均匀分布
      type:'category',
    },
    yAxis:{},
    grid:{
      left:40,
      right:20,
      top:50,
      bottom:50,
    },
    series:{
      type:'scatter',
      data:[1,3,5,7,9,11,13,12,10,8,6,4,2,0],
      // 图形散点样式
      symbol:'pin',
      // 图形散点大小
      symbolSize:14,
      // 图文标签
      label:{
        show:false,
      },
      // 图表散点样式
      itemStyle:{
        color:' aquamarine',
      }

    }
  })
})
</script>

<style scoped lang="scss">
.yearbox {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-lb.png) no-repeat;
  background-size: 100% 100%;


  .title {
    margin-left: 20px;

    p {
      color: white;
      font-size: 20px;
    }
  }

  .charts {
    height: calc(100% - 30px);
    // background-color: aqua;
  }
}
</style>