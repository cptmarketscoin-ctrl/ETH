import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    prices: {},          // { BTCUSDT: { price, change_24h, ... } }
    userInfo: null,
    balances: {},
    wsConnected: false
  },
  
  mutations: {
    SET_PRICE(state, { symbol, data }) {
      Vue.set(state.prices, symbol, { ...state.prices[symbol], ...data });
    },
    SET_PRICES(state, prices) {
      state.prices = { ...state.prices, ...prices };
    },
    SET_USER(state, user) {
      state.userInfo = user;
    },
    SET_BALANCES(state, balances) {
      state.balances = balances;
    },
    SET_WS_STATUS(state, status) {
      state.wsConnected = status;
    }
  },
  
  actions: {
    updatePrice({ commit }, { symbol, data }) {
      commit('SET_PRICE', { symbol, data });
    }
  },
  
  getters: {
    coinList: (state) => {
      return Object.entries(state.prices).map(([symbol, data]) => ({
        symbol: symbol.replace('USDT', ''),
        pair: symbol,
        ...data
      }));
    },
    topCoins: (state, getters) => {
      const top = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT', 'DOGEUSDT', 'ADAUSDT', 'AVAXUSDT'];
      return top.map(s => state.prices[s]).filter(Boolean);
    }
  }
});
