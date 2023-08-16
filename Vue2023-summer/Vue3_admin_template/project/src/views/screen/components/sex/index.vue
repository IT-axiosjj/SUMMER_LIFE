<template>
  <div class="sexbox">
    <div class="title">
      <p>男女比例</p>
      <img src="../../images/dataScreen-title.png" alt="">
    </div>
    <div class="sex">
      <div class="man">
        <img src="../../images/man.png" alt="">
      </div>
      <div class="women">
        <img src="../../images/woman.png" alt="">
      </div>
    </div>
    <div class="rate">
      <p>邓豪杰58%</p>
      <p>谭孟孟42%</p>
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
import { ref ,onMounted} from 'vue';
import * as echarts from 'echarts';
// 获取图形图标的DOM节点
let charts = ref();
onMounted(() => {
  //初始化echarts实例
  let mycharts = echarts.init(charts.value);
  //设置配置项
  mycharts.setOption({
    //组件标题
    title: {
      // text: '男女比例',//主标题
      // textStyle: {//主标题颜色
      //   color: 'skyblue'
      // },
      // left: '40%'
    },
    //x|y
    xAxis: {
      show: false,
      min: 0,
      max: 100
    },
    yAxis: {
      show: false,
      type: 'category'
    },
    series: [
      {
        type: 'bar',
        data: [58],
        barWidth: 20,
        z: 100,
        itemStyle: {
          color: '#0076FF',
          borderRadius: 20
        }
      }
      ,
      {
        type: 'bar',
        data: [100],
        barWidth: 20,
        //调整女士柱条位置
        barGap: '-100%',
        itemStyle: {
          color: '#FF5E77',
          borderRadius: 20
        }
      }
    ],
    grid: {
      left: 100,
      top: 0,
      right: 100,
      bottom: 60
    }
  });
})
</script>

<style scoped lang="scss">
.sexbox{
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  margin: 20px 0px;
  overflow:hidden;
  .title{
    margin-left: 20px;
    p{
      color: white;
      font-size: 20px;
    }
  }
  .sex{
    display: flex;
    justify-content: center;
    .man{
      margin-top: 40px;
      margin-bottom: 25px;
      margin-right: 20px;
      width: 111px;
      height: 115px;
      background: url(../../images/man-bg.png);
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .women{
      margin-top: 40px;
      margin-bottom: 25px;
      margin-left: 20px;
      width: 111px;
      height: 115px;
      background: url(../../images/woman-bg.png);
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .rate{
    width: 55%;
    // background-color: aquamarine;
    margin: auto;
    display: flex;
    justify-content: space-between;
    color: #FFFFFF;
    
    p{
      // background-color: red;
      font-size: 13px;
    }
  }
  
  .charts {
    height: 100px;
    // background-color: #FFFFFF;
  }
}

</style>