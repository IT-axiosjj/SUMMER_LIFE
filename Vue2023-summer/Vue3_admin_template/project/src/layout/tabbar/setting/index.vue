<template>
  <el-button type="primary" size="small" :icon="Refresh" circle color="white" @click="updateRefsh"></el-button>
  <el-button type="primary" size="small" :icon="FullScreen" circle color="white" @click="fullScreen"></el-button>
  <!-- 弹出框--主题设置 -->
  <el-popover placement="bottom" title="主题设置" :width="300" trigger="hover">
    <!-- 表单元素 -->
    <el-form>
      <el-form-item label="主题颜色">
        <el-color-picker @change="colorChange" v-model="color" size="lagre" show-alpha :predefine="predefineColors" />
      </el-form-item>
      <el-form-item label="暗黑模式">
        <el-switch @change="darkChange" v-model="dark" size="lagre" active-icon="MoonNight" inactive-icon="Sunny"
          class="mt-2" style="margin-left: 24px" inline-prompt />
      </el-form-item>
    </el-form>
    <template #reference>
      <el-button type="primary" size="small" :icon="Setting" circle color="white"></el-button>
    </template>
  </el-popover>

  <img :src="userStore.avatar" style="width: 24px;height: 24px;margin: 0px 10px; border-radius: 50%;">
  <!-- 下拉菜单 -->
  <el-dropdown>
    <span class="el-dropdown-link">
      {{ userStore.username }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="loginout">退出登录</el-dropdown-item>

      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
// 暗黑模式需要的样式
import 'element-plus/theme-chalk/dark/css-vars.css'
import { useRouter, useRoute } from 'vue-router';
import { FullScreen, Refresh, Setting } from '@element-plus/icons-vue';
// 获取骨架小仓库
import useLayOutSettingStore from '@/store/modules/setting';
// 获取用户相关的小仓库
import useUserStore from '@/store/modules/user';
import { ref } from 'vue';
let userStore = useUserStore();
let $router = useRouter()
let $route = useRoute()
let layOutSettingStore = useLayOutSettingStore();
//收集暗黑模式开关数据
let dark = ref<boolean>(false);
//刷新按钮方法
const updateRefsh = () => {
  layOutSettingStore.refsh = !layOutSettingStore.refsh
}
// 全屏按钮方法
const fullScreen = () => {
  // DOM对象的一个属性：可以用来判断当前是不是全屏模式{全屏:true,不是全屏：false}
  let full = document.fullscreenElement;
  // 切换全屏模式
  if (!full) {
    // 利用文档根节点的方法requestFullscreen，实现全屏模式
    console.log('进入全屏');

    document.documentElement.requestFullscreen();
  } else {
    // 退出全屏模式
    console.log('退出全屏')
    document.exitFullscreen();

  }
}
// 退出登录方法
const loginout = async () => {
  // 第一步：需要向服务器发请求{退出登录接口}
  // 第二步：仓库当中关于用户相关的数据清空{token|username|avatar
  await userStore.userLoginout();
  // 跳转到登录页面
  $router.push({ path: '/login', query: { redirect: $route.path } })

}

// 主题颜色数据
const color = ref('rgba(255, 69, 0, 0.68)')
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])

// switch开关change事件进行暗黑模式的切换
const darkChange = () => {
  // 获取HTML根节点
  let html = document.documentElement;
  // 判断HTML标签是否有类名Dark
  dark.value ? html.className = 'dark' : html.className = '';
}

// 主题颜色change事件的回调
const colorChange = () =>{
  // 通知js修改根节点的样式对象的属性与属性值
  let html = document.documentElement;
  html.style.setProperty('--el-color-primary', color.value)
}
</script>

<style scoped></style>