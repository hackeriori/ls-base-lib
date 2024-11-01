import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router';

export type RouteRecordRawLike = RouteRecordRaw & { meta?: any };

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

export default router;
