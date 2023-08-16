<template>
  <div class="layout_container">
    <!-- 左侧菜单 -->
    <div class="layout_slider" :class="{ fold: LayOutSettingStore.fold ? true : false }">
      <logo></logo>
      <!-- 展示菜单 -->
      <!-- 滚动组件 -->
      <el-scrollbar class="scrollbar">
        <!-- 菜单组件 -->
        <el-menu :collapse='LayOutSettingStore.fold ? true : false' :default-active="$route.path" background-color="$base_menu_background" text-color="white">
          <!-- 根据路由动态生成菜单 -->
          <menuLeft :menuList="userStore.menuRoutes"></menuLeft>
        </el-menu>
      </el-scrollbar>
    </div>
    <!-- 顶部导航 -->
    <div class="layout_tabbar" :class="{ fold: LayOutSettingStore.fold ? true : false }">
      <tabbar></tabbar>
    </div>
    <!-- 内容展示区域 -->
    <div class="layout_main" :class="{ fold: LayOutSettingStore.fold ? true : false }">
      <mainRight></mainRight>
    </div>
  </div>
</template>

<script setup lang="ts">
// 引入左侧菜单logo子组件
import logo from './logo/index.vue';
// 引入菜单组件
// @ts-ignore
import menuLeft from './menuLeft/index.vue';
// 引入右侧内容展示区域组件
// @ts-ignore
import mainRight from './mainRight/index.vue';
// 引入顶部tabbar组件
// @ts-ignore
import tabbar from './tabbar/index.vue';
// 获取用户相关的小仓库
import useUserStore from '@/store/modules/user';
import { useRoute } from 'vue-router';
import useLayOutSettingStore from '@/store/modules/setting';
// 获取layout配置仓库
let LayOutSettingStore = useLayOutSettingStore();
let userStore = useUserStore();
let $route = useRoute();
</script>
<script lang="ts">
export default {
  name: 'Layout',
}
</script>
<style scoped lang="scss">
.layout_container {
  width: 100%;
  height: 100vh;

  .layout_slider {
    color: white;
    width: $base_menu_width;
    height: 100vh;
    background: $base_menu_background;
    transition: all 0.3s;

    .scrollbar {
      width: 100%;
      height: calc(100vh - $base_menu_logo_height);

      .el-menu {
        border-right: none;
      }
    }

    &.fold {
      width: $base_menu_mine_width;
    }
  }

  .layout_tabbar {
    position: fixed;
    width: calc(100% - $base_menu_width);
    height: $base_tabbar_height ;
    // background: green;
    top: 0px;
    left: $base_menu_width;
    transition: all 0.3s;

    &.fold {
      width: calc(100vw - $base_menu_mine_width);
      left: 50px;
    }
  }

  .layout_main {
    position: absolute;
    width: calc(100% - $base_menu_width);
    height: calc(100vh - $base_tabbar_height);
    // background: skyblue;
    left: $base_menu_width;
    top: $base_tabbar_height ;
    padding: 20px;
    overflow: auto;
    transition: all 0.3s;
    &.fold{
      width: calc(100vw - $base_menu_mine_width);
      left: 50px;
    }
  }
}</style>