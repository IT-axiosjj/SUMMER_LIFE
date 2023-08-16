
// l路由鉴权：项目当中路由能不能被访问的权限的设置（某一个路由什么条件下可以访问/什么条件下不可以访问）
import router from "./router";
//@ts-ignore 
import nprogress from 'nprogress';
// 引入进度条样式
import 'nprogress/nprogress.css';
nprogress.configure({showSpinner:false});
// 获取用户相关的小仓库内部的token数据，判断用户是否登录成功
import useUserStore from "./store/modules/user";
import pinia from "./store";
import setting from "./setting";
let useStore = useUserStore(pinia);
// 全局守卫：项目中任意路由切换都会触发的钩子
// 全局前置守卫
router.beforeEach(async (to: any, _from: any, next: any) => {
  // to:将要访问哪个路由
  // from:从哪个路由而来
  // next:路由放行函数
  //  访问某一路由之前的守卫
  nprogress.start();
  // 获取token，判断用户登录状态
  let token = useStore.token;
  // 获取用户名字
  let username = useStore.username;
  // 用户登录判断
  if (token) {
    //登录成功，访问login，不能访问，指向首页
    if (to.path == '/login') {
      next({ path: '/' })
    } else {
      // 登录成功访问跳转路由路径
      // 有用户信息
      if (username) {
        next()
      } else {
        // 没有用户信息，在守卫这里发请求获取到用户信息再放行
        try {
          // 获取用户信息
          await useStore.userInfo()
          //放行
          // 异步组件加载完毕再放行
          next({...to,replace:true})
        } catch (error) {
          // token过期：获取不到用户信息
          // 用户手动修改本地存储token
          // 退出登录->用户数据清空
         await useStore.userLoginout();
          next({ path: '/login', query: { redirect: to.path } })
        }
      }
    }
  } else {
    // 用户未登录判断
    if (to.path == '/login') {
      next()
    } else {
      next({ path: '/login', query: { redirect: to.path } })
    }
  }
});

// 全局后置守卫
router.afterEach((to: any, _from: any) => {
  nprogress.done();
  document.title = setting.title + '-'+ to.meta.title
});

// 任意路由切换实现进度业务 --nprogress
// 路由鉴权（路由组件访问权限的设置）

// 用户未登录：可以访问login，其余路由不能直接访问
// 用户登录成功：login不能直接访问，其余路由可以访问