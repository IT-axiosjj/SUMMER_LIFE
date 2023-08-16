<template>
  <div class="tourist-box">
    <div class="top">
      <p class="title">实施游客统计</p>
      <p class="bg"></p>
      <p class="right">可预约总量:<span>999999</span>人</p>
    </div>
    <div class="number">
      <span v-for="(item, index) in people" :key="index">{{ item }}</span>
    </div>
    <!-- echarts展示图形图标的节点 -->
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';
// 水球图拓展插件
import 'echarts-liquidfill';

let people = ref('520521人');
// 获取节点
let charts = ref();


onMounted(() => {
  //获取echarts类的实例
  let mycharts = echarts.init(charts.value);
  //设置实例的配置项
  mycharts.setOption({
    //标题组件
    title: {
      text: '水球图',
      textStyle: {
        //文字颜色
        color: '#FFFFFF',
        //字体风格,'normal','italic','oblique'
        fontStyle: 'normal',
        //字体粗细 'normal','bold','bolder','lighter',100 | 200 | 300 | 400...
        fontWeight: 'bold',
        //字体系列
        fontFamily: 'sans-serif',
        //字体大小
        fontSize: 18
      }
    },
    //x|y轴组件
    xAxis: {
      show: false,
    },
    yAxis: {
      show: false,
    },
    //系列:决定你展示什么样的图形图标
    series: {
      type: 'liquidFill',//系列
      data: [0.8, 0.4, 0.2],//展示的数据
      waveAnimation: true,//动画
      animationDuration: 3,
      animationDurationUpdate: 0,
      radius: '90%',//半径
      outline: {//外层边框颜色设置
        show: true,
        borderDistance: 8,
        itemStyle: {
          color: 'skyblue',
          borderColor: '#294D99',
          borderWidth: 8,
          shadowBlur: 20,
          shadowColor: 'rgba(0, 0, 0, 0.25)'
        }
      },
      color: ['#0000FF', '#1E90FF', '#00BFFF'],//波浪图层级颜色
      center: ['50%', '46%'],//水波图位置 前参为x坐标 后参为y坐标
    },
    //布局组件
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },

  })
})
</script>

<style scoped lang="scss">
.tourist-box {
  background: url(../../images/dataScreen-main-lb.png) no-repeat;
  background-size: 100% 100%;
  margin-top: 10px;
  overflow:hidden;
  .top {
    margin-left: 20px;

    .title {
      color: white;
      font-size: 20px;
    }

    .bg {
      width: 68px;
      height: 7px;
      background: url(../../images/dataScreen-title.png) no-repeat;
      background-size: 100% 100%;
      margin-top: 15px;
    }

    .right {
      float: right;
      color: white;
      font-size: 16px;

      span {
        color: orange;
      }
    }

  }

  .number {
    padding: 10px;
    margin-top: 30px;
    clear: both;
    display: flex;
    // width: 80%;

    span {
      flex: 1;
      height: 40px;
      line-height: 40px;
      text-align: center;
      background: url(../../images/total.png) no-repeat;
      background-size: 100% 100%;
      color: #29fcff;

    }
  }

  .charts {
    width: 100%;
    height: 250px;
    // background-color: antiquewhite;
  }
}
</style>