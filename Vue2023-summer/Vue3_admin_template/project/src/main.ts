import { createApp } from 'vue';
import App from './App.vue';
// 引入element-plus插件与样式
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
// 配置element-plus国际化
// @ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
// svg插件需要的配置代码
import 'virtual:svg-icons-register';
// 引入自定义插件对象：注册整个项目全局组件
import gloalComponent from '@/components';
// 引入模板的全局的样式
import '@/styles/index.scss';
// 引入路由
import router from './router';
// 引入仓库
import pinia from './store';
// 引入路由鉴权组件
import './permisstion';
// 引入自定义指令
import {isHasButton} from './directive/index.ts';
// 获取应用实例对象
const app = createApp(App)
// 安装element-plus插件
app.use(ElementPlus, {
  locale: zhCn//element-plus国际化配置
})
// 安装自定义插件
app.use(gloalComponent)
// 注册路由模板
app.use(router)
// 安装仓库
app.use(pinia)
// 使用自定义指令
isHasButton(app);
// 将应用挂在到挂载点
app.mount('#app')
// console.log(import.meta.env);

