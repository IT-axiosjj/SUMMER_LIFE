<template>
  <div class="counterbox">
    <div class="title">
      <p>数据统计</p>
      <img src="../../images/dataScreen-title.png" alt="">
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script  setup lang="ts">
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';
// 引入词云图
// npm install echarts-wordcloud
import 'echarts-wordcloud';

// 获取图形图标的DOM节点
let charts = ref();
const list = [
  {
    value: '50',
    name: '谭孟孟',
    textStyle: {
      shadowBlur: 4,
      shadowColor: '#ECEFFF',
      shadowOffsetY: 14,
      color: '#FF69B4',
    },
  }, // 50
  { value: '30', name: '闭月羞花' },
  { value: '29', name: '沉鱼落雁' },
  { value: '28', name: '国色天香' },
  { value: '27', name: '冰清玉洁' },
  { value: '26', name: '才华横溢' },
  { value: '25', name: '虚怀若谷' },
  { value: '24', name: '楚楚动人' },
  { value: '23', name: '倾国倾城' },
  { value: '22', name: '秀色可餐' },
  { value: '21', name: '善解人意' },
  { value: '20', name: '仙姿玉貌' },
  { value: '16', name: '绰约多姿' },
  { value: '15', name: '天生尤物' },
  { value: '14', name: '窈窕淑女' },
  { value: '13', name: '眉清目秀' },
  { value: '12', name: '绝代佳人' },
  { value: '11', name: '风姿卓越' },
  { value: '10', name: '花容月貌' },
  { value: '9', name: '我爱你' },
]
onMounted(() => {
  let mychart = echarts.init(charts.value);
  let option = {
  tooltip: {
    show: true,
          borderColor: '#fe9a8bb3',
          borderWidth: 1,
          padding: [10, 15, 10, 15],
          confine: true,
          backgroundColor: 'rgba(255, 255, 255, .9)',
          textStyle: {
            color: 'hotpink',
            lineHeight: 22
          },
          extraCssText: 'box-shadow: 0 4px 20px -4px rgba(199, 206, 215, .7);border-radius: 4px;'
  },
  series: [
    {
      type: 'wordCloud',
      // The shape of the "cloud" to draw. Can be any polar equation represented as a
      // callback function, or a keyword present. Available presents are circle (default),
      // cardioid (apple or heart shape curve, the most known polar equation), diamond (
      // alias of square), triangle-forward, triangle, (alias of triangle-upright, pentagon, and star.

      shape: 'pentagon',

      // A silhouette image which the white area will be excluded from drawing texts.
      // The shape option will continue to apply as the shape of the cloud to grow.

      // Folllowing left/top/width/height/right/bottom are used for positioning the word cloud
      // Default to be put in the center and has 75% x 80% size.

      left: 'center',
      top: 'center',
      width: '100%',
      height: '100%',
      right: null,
      bottom: null,

      // Text size range which the value in data will be mapped to.
      // Default to have minimum 12px and maximum 60px size.

      sizeRange: [14, 50],

      // Text rotation range and step in degree. Text will be rotated randomly in range [-90, 90] by rotationStep 45

      rotationRange: [0, 0],
      rotationStep: 0,

      // size of the grid in pixels for marking the availability of the canvas
      // the larger the grid size, the bigger the gap between words.

      gridSize: 25,

      // set to true to allow word being draw partly outside of the canvas.
      // Allow word bigger than the size of the canvas to be drawn
      drawOutOfBound: false,

      // If perform layout animation.
      // NOTE disable it will lead to UI blocking when there is lots of words.
      layoutAnimation: true,

      // Global text style
      textStyle: {
        fontFamily: 'PingFangSC-Semibold',
        fontWeight: 600,
        color: function (_params:any) {
          let colors = ['#fe9a8bb3', '#fe9a8bb3', '#fe9a8b03', '#9E87FFb3', '#9E87FFb3', '#9E87FFb3', '#fe9a8bb3', '#fe9a8bb3', '#fe9a8bb3', '#73DDFF', '#58D5FF']
          return colors[parseInt((Math.random() * 10).toString())];
        },
      },
      emphasis: {
        focus: 'none',
      },

      // Data is an array. Each array item must have name and value property.
      data: list,
    },
  ],
};
  mychart.setOption(option)
})
</script>

<style scoped lang="scss">
.counterbox {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-lb.png) no-repeat;
  background-size: 100% 100%;
  margin-top: 20px;

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