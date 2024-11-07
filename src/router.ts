import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router';

declare module 'vue-router' {
  interface RouteMeta extends Record<PropertyKey, unknown> {
    // 是否在路由列表中展示
    showInList?: boolean,
    // 页面标题
    title?: string,
    // 开发模式主动传递给页面的query
    query?: import('vue-router').LocationQueryRaw,
  }
}

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: '导航页',
    meta: {
      showInList: false
    },
    component: () => import('./ViewSelector.vue')
  },
  {
    path: '/ls-css-demo',
    name: 'ls系列css',
    component: () => import('./demo/ls-css-demo.vue'),
  },
  {
    path: '/VerifyDemo',
    name: '验证装饰器',
    component: () => import('./library/verify/VerifyDemo.vue'),
  },
  {
    path: '/HeavyTaskBreakdown',
    name: '重任务分解',
    component: () => import('./demo/HeavyTaskBreakdown.vue'),
  },
];

const router = createRouter({
  routes,
  history: createWebHashHistory()
});

router.push({
  params: {
    showInList: 'false'
  }
})

router.beforeEach((to, _from, next) => {
  if (typeof to.meta.title === 'string')
    document.title = to.meta.title;
  else if (typeof to.name === 'string')
    document.title = to.name;
  next();
});


export default router;
