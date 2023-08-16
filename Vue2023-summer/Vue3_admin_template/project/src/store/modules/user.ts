// 创建用户相关的小仓库
import { defineStore } from 'pinia'
// 引入接口
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user';
// 引入接口数据类型
import type { loginFormData, loginResponseData, userInfoResponseData } from "@/api/user/type";
// @ts-ignore
import type { UserState } from './types/type'
// 引入操作本地存储的工具方法
import { SET_TOKEN, GET_TOKEN, ROMOVE_TOKEN } from '@/utils/token'
// 引入路由（常量路由-异步路由-任意路由）
import { constantRoute, asyncRoute, anyRoute } from '@/router/routes';
import router from '@/router';
// 引入深拷贝方法
import cloneDeep from 'lodash/cloneDeep';

// 用于过滤当前用户需要展示的异步路由
function filterAsyncRoute(asyncRoute: any, routes: any) {
  // value->封装好的异步路由里的所有子对象
  return asyncRoute.filter((value: any) => {
    // 对比一级路由
    if (routes.includes(value.name)) {
      // 对比二级路由
      if (value.children && value.children.length > 0) {
        // 递归
        value.children = filterAsyncRoute(value.children, routes)
      }
      return true;
    }
  })
}

// 删除动态追加路由
function resetRouter() {
  // 获取所有路由
  router.getRoutes().forEach((route) => {
    // 获取路由name
    const { name } = route
    // 移除所有路由
    router.hasRoute(name as string) && router.removeRoute(name as string)
  });
  // 添加常量路由
  [...constantRoute].forEach((route: any) => {
    router.addRoute(route)
  })
}


// 创建用户小仓库
let useUserStore = defineStore('User', {
  // 小仓库存储数据的地方
  state: () => {
    return {
      token: GET_TOKEN(),//用户唯一标识
      menuRoutes: constantRoute,//仓库存储生成菜单需要数组(路由)
      username: '',
      avatar: '',
      // 当前用户包含的按钮权限
      buttons: [],
    }
  },
  // 异步|逻辑的地方
  actions: {
    // 用户登录的方法
    async userLogin(data: loginFormData) {
      // 登录请求
      let result: loginResponseData = await reqLogin(data);
      console.log(result);
      // 登录请求：成功200->token
      // 登录请求：失败201->登录失败错误的信息
      if (result.code == 200) {
        // pinia仓库存储一下token
        // 由于pinia|vuex存储数据其实利用js对象
        this.token = (result.data as string)
        // 本地存储持久化存储一份
        // localStorage.setItem('TOKEN',(result.data.token as string))
        SET_TOKEN((result.data as string))
        // 能保证当前async函数返回一个成功的promise
        return 'ok'
      } else {
        return Promise.reject(new Error(result.data))
      }
    },
    // 获取用户信息的方法
    async userInfo() {
      // 获取用户信息存储到仓库{头像 名字}
      let result: userInfoResponseData = await reqUserInfo();
      console.log('用户信息',result);
      
      // 如果获取用户信息成功，存储用户信息
      if (result.code == 200) {
        this.username = result.data.name;
        this.avatar = result.data.avatar;
        // @ts-ignore
        this.buttons = result.data.buttons;
        // 对比异步路由--->cloneDeep深拷贝异步路由数据
        let userAsyncRoute = filterAsyncRoute(cloneDeep(asyncRoute), result.data.routes);
        // 菜单的数据，重新赋值路由数据
        this.menuRoutes = [...constantRoute, ...userAsyncRoute, anyRoute];
        // 目前路由器管理的只有常量路由：用户计算完毕异步路由/任意路由动态追加
        [...userAsyncRoute, anyRoute].forEach((route: any) => {
          router.addRoute(route);
        })
    
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
    // 退出登录方法
    async userLoginout() {
      let result: any = await reqLogout();
      if (result.code == 200) {
        // 目前灭有mock接口：退出登录接口（通知服务器本地用户唯一标识失效）
        this.token = '';
        this.username = '';
        this.avatar = '';
        ROMOVE_TOKEN();
        resetRouter();
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }

    }
  },
  getters: {

  }
})
// 对外暴露获取小仓库方法
export default useUserStore;


