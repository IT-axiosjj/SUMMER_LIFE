// 对外暴露配置路由(常量路由):全部用户都能访问到的路由
export const constantRoute = [
  {
    // 登录
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    name: 'login',//命名路由
    meta: {
      title: '登录',//菜单标题
      hidden: true,//标题在菜单中的显示与隐藏
      icon: 'Promotion',//菜单图标
    }
  },
  {
    // 首页
    path: '/',
    component: () => import('@/layout/index.vue'),
    name: 'layout',//命名路由
    meta: {
      title: '',//菜单标题
      hidden: false,//标题在菜单中的显示与隐藏
      icon: '',
    },
    redirect: '/home',
    children: [
      {
        path: '/home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '首页',//菜单标题
          hidden: false,//标题在菜单中的显示与隐藏
          icon: 'HomeFilled',
        }
      },

    ]
  },
  {
    path: '/screen',
    component: () => import('@/views/screen/index.vue'),
    name: 'Screen',//命名路由
    meta: {
      title: '数据大屏',//菜单标题
      hidden: false,//标题在菜单中的显示与隐藏
      icon: 'Platform',
    }
  },
  {
    path: '/404',
    component: () => import('@/views/404/index.vue'),
    name: '404',//命名路由
    meta: {
      title: '404',//菜单标题
      hidden: true,//标题在菜单中的显示与隐藏
    }
  },
]

// 异步路由
export const asyncRoute = [
  {
    path: '/acl',
    component: () => import('@/layout/index.vue'),
    name: 'Acl',//命名路由
    meta: {
      title: '权限管理',//菜单标题
      hidden: false,//标题在菜单中的显示与隐藏
      icon: 'Lock',
    },
    redirect: '/acl/user',
    children: [

      {
        path: '/acl/user',
        component: () => import('@/views/acl/user/index.vue'),
        name: 'User',//命名路由
        meta: {
          title: '用户管理',//菜单标题
          hidden: false,//标题在菜单中的显示与隐藏
          icon: 'User',
        }
      },
      {
        path: '/acl/role',
        component: () => import('@/views/acl/role/index.vue'),
        name: 'Role',//命名路由
        meta: {
          title: '角色管理',//菜单标题
          hidden: false,//标题在菜单中的显示与隐藏
          icon: 'UserFilled',
        }
      },
      {
        path: '/acl/permission',
        component: () => import('@/views/acl/permission/index.vue'),
        name: 'Permission',//命名路由
        meta: {
          title: '菜单管理',//菜单标题
          hidden: false,//标题在菜单中的显示与隐藏
          icon: 'Monitor',
        }
      },
    ]
  },
  {
    path: '/product',
    component: () => import('@/layout/index.vue'),
    name: 'Product',//命名路由
    meta: {
      title: '商品管理',//菜单标题
      hidden: false,//标题在菜单中的显示与隐藏
      icon: 'Goods',
    },
    redirect: '/product/trademark',
    children: [

      {
        path: '/product/trademark',
        component: () => import('@/views/product/trademark/index.vue'),
        name: 'Trademark',//命名路由
        meta: {
          title: '品牌管理',//菜单标题
          hidden: false,//标题在菜单中的显示与隐藏
          icon: 'ShoppingCartFull',
        }
      },
      {
        path: '/product/attr',
        component: () => import('@/views/product/attr/index.vue'),
        name: 'Attr',//命名路由
        meta: {
          title: '属性管理',//菜单标题
          hidden: false,//标题在菜单中的显示与隐藏
          icon: 'ChromeFilled',
        }
      },
      {
        path: '/product/spu',
        component: () => import('@/views/product/spu/index.vue'),
        name: 'Spu',//命名路由
        meta: {
          title: 'SPU管理',//菜单标题
          hidden: false,//标题在菜单中的显示与隐藏
          icon: 'Calendar',
        }
      },
      {
        path: '/product/sku',
        component: () => import('@/views/product/sku/index.vue'),
        name: 'Sku',//命名路由
        meta: {
          title: 'SKU管理',//菜单标题
          hidden: false,//标题在菜单中的显示与隐藏
          icon: 'Orange',
        }
      },
    ]
  },
]

// 任意路由
export const anyRoute = {
  path: '/pathMatch(.*)*',
  redirect: '/404',
  name: 'Any',//命名路由
  meta: {
    title: '任意路由',//菜单标题
    hidden: true,//标题在菜单中的显示与隐藏
  }
}
