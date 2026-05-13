import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  { path: '/', name: 'home', component: () => import('../views/Home.vue'), meta: { title: 'Klakna', tab: 0 } },
  { path: '/market', name: 'market', component: () => import('../views/Market.vue'), meta: { title: 'Market', tab: 1 } },
  { path: '/trade', name: 'trade', component: () => import('../views/Trade.vue'), meta: { title: 'Trade', tab: 2 } },
  { path: '/trade/:pair', name: 'tradePair', component: () => import('../views/Trade.vue'), meta: { title: 'Trade', tab: 2 } },
  { path: '/earn', name: 'earn', component: () => import('../views/Earn.vue'), meta: { title: 'Earn', tab: 3 } },
  { path: '/assets', name: 'assets', component: () => import('../views/Assets.vue'), meta: { title: 'Assets', tab: 4 } },
  { path: '*', redirect: '/' }
];

const router = new VueRouter({ mode: 'hash', base: '/ETH/', routes, scrollBehavior() { return { x: 0, y: 0 }; } });
router.afterEach(to => { document.title = to.meta.title || 'CPT Exchange'; });
export default router;
