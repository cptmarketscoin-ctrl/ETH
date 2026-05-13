import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

// Element UI (桌面端)
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// Vant (移动端)
import Vant from 'vant';
import 'vant/lib/index.css';

// 全局样式
import './assets/styles/variables.scss';
import './assets/styles/global.scss';
import './assets/styles/dark-overrides.css';

Vue.use(ElementUI);
Vue.use(Vant);

Vue.config.productionTip = false;

// 全局 API 代理地址
Vue.prototype.$apiBase = window.__KLAKNA_PROXY__ || 'https://api.cptnexus.sbs';

const app = new Vue({
  router,
  store,
  render: h => h(App)
});

app.$mount('#app');
