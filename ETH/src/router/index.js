import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue'),
    meta: { title: 'CPT Exchange', tab: 0 }
  },
  {
    path: '/market',
    name: 'market',
    component: () => import(/* webpackChunkName: "market" */ '../views/Market.vue'),
    meta: { title: '行情', tab: 1 }
  },
  {
    path: '/trade',
    name: 'trade',
    component: () => import(/* webpackChunkName: "trade" */ '../views/Trade.vue'),
    meta: { title: '交易', tab: 2 }
  },
  {
    path: '/trade/:pair',
    name: 'tradePair',
    component: () => import(/* webpackChunkName: "trade" */ '../views/Trade.vue'),
    meta: { title: '交易', tab: 2 }
  },
  {
    path: '/assets',
    name: 'assets',
    component: () => import(/* webpackChunkName: "assets" */ '../views/Assets.vue'),
    meta: { title: '资产', tab: 3 }
  },
  {
    path: '*',
    redirect: '/'
  }
];

const router = new VueRouter({
  mode: 'hash',
  base: '/ETH/',
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 };
  }
});

router.afterEach((to) => {
  document.title = to.meta.title || 'CPT Exchange';
});

export default router;
