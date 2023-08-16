<template>
  <div class="tabbar">
    <!-- 顶部左侧 -->
  <div class="tabbar-left">
    <breadcrumb></breadcrumb>
  </div>
     <!-- 顶部右侧 -->
  <div class="tabbar-right">
    <setting></setting>
  </div>
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
import breadcrumb from './breadcrumb/index.vue';
// @ts-ignore
import setting from './setting/index.vue';

</script>
<script lang="ts">
export default {
  name:'Setting',
}
</script>
<style scoped lang="scss">
.tabbar{
  width: 100%;
  height:100%;
  display: flex;
  justify-content: space-between;
  // 渐变
  // background-image: linear-gradient(to right,white,rgb(212, 208, 208),white);
  background-color: #FFFFFF;
  border-bottom:1px solid rgb(235, 228, 228) ;
  .tabbar-left{
    display: flex;
    align-items: center;
    margin-left: 20px;
  }
  .tabbar-right{
    display: flex;
    align-items: center;

  }
}
</style>