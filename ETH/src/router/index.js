import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Market from '../views/Market.vue';
import Trade from '../views/Trade.vue';
import Earn from '../views/Earn.vue';
import Assets from '../views/Assets.vue';

Vue.use(VueRouter);

const routes = [
  { path: '/', name: 'home', component: Home, meta: { title: 'CPT Exchange', tab: 0 } },
  { path: '/market', name: 'market', component: Market, meta: { title: 'Market', tab: 1 } },
  { path: '/trade', name: 'trade', component: Trade, meta: { title: 'Trade', tab: 2 } },
  { path: '/trade/:pair', name: 'tradePair', component: Trade, meta: { title: 'Trade', tab: 2 } },
  { path: '/earn', name: 'earn', component: Earn, meta: { title: 'Earn', tab: 3 } },
  { path: '/assets', name: 'assets', component: Assets, meta: { title: 'Assets', tab: 4 } },
  { path: '*', redirect: '/' }
];

const router = new VueRouter({ mode: 'hash', base: '/ETH/', routes, scrollBehavior() { return { x: 0, y: 0 }; } });
router.afterEach(to => { document.title = to.meta.title || 'CPT Exchange'; });
export default router;
