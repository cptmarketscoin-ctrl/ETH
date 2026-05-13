<template>
  <div class="market-page">
    <!-- Tabs -->
    <div class="m-tabs">
      <span class="m-tab active">Watchlist</span>
      <span class="m-tab">Crypto</span>
    </div>

    <!-- Trading Pairs -->
    <div class="m-title">Select trading pair</div>
    
    <div class="m-pair-grid">
      <div v-for="(c,i) in coins" :key="c.fromSymbol" class="m-pair-item" :style="{animationDelay:i*.04+'s'}" @click="$router.push('/trade/'+c.fromSymbol)">
        <div class="m-pair-l">
          <img :src="c.iconUrl" class="m-pair-icon" @error="e=>e.target.style.display='none'" />
          <div>
            <span class="m-pair-name">{{c.fromSymbol}}</span>
            <span class="m-pair-full">{{c.fromSymbol}}</span>
          </div>
        </div>
        <div class="m-pair-chart">
          <MiniKline v-if="c.klineRespList" :data="c.klineRespList" :isUp="c.isUp" :w="64" :h="28" />
        </div>
        <div class="m-pair-r">
          <span class="m-pair-price">{{c.lastPrice}}</span>
          <span class="m-pair-change" :class="c.isUp?'up':'down'">{{c.rate}}%</span>
        </div>
      </div>
    </div>

    <div class="m-add" @click="$router.push('/market')">
      <span>+</span> Add your own
    </div>
  </div>
</template>

<script>
import { pageHome, coinIcon as cnIcon } from '../api';
import MiniKline from '../components/MiniKline.vue';

export default {
  name: 'MarketPage',
  components: { MiniKline },
  data: () => ({ coins: [], activeTab: 'watchlist' }),
  methods: {
    cnIcon,
    async fetch() {
      try { const r = await pageHome(); if(r.code===200) this.coins = (r.content||[]).map(c=>({...c, iconUrl:cnIcon(c.fromSymbol||c.coinName), isUp:parseFloat(c.rate||0)>=0})); } catch(e){}
    }
  },
  created() { this.fetch(); }
};
</script>

<style scoped>
.market-page { padding: .133rem .16rem .8rem; min-height: 100vh; }

.m-tabs { display: flex; gap: 0; margin-bottom: .213rem; border-radius: .107rem; overflow: hidden; border: 1px solid var(--border-1); }
.m-tab { flex: 1; text-align: center; padding: .107rem; font-size: .173rem; color: var(--text-3); cursor: pointer; background: var(--bg-card); }
.m-tab.active { background: var(--primary); color: #fff; }

.m-title { font-size: .187rem; font-weight: 700; margin-bottom: .16rem; }

.m-pair-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: .107rem; margin-bottom: .213rem; }
.m-pair-item { background: var(--bg-white); border-radius: .107rem; padding: .16rem .133rem; border: 1px solid var(--border-1); cursor: pointer; animation: pairIn .35s ease both; display: flex; flex-direction: column; gap: .08rem; }
@keyframes pairIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
.m-pair-l { display: flex; align-items: center; gap: .08rem; }
.m-pair-icon { width: .267rem; height: .267rem; border-radius: 50%; }
.m-pair-name { font-size: .173rem; font-weight: 700; display: block; }
.m-pair-full { font-size: .12rem; color: var(--text-4); }
.m-pair-price { font-size: .173rem; font-family: var(--font-mono); }
.m-pair-change { font-size: .133rem; }
.up { color: var(--up); } .down { color: var(--down); }

.m-add { text-align: center; padding: .16rem; background: var(--bg-white); border-radius: .107rem; border: 1px dashed var(--border-1); font-size: .16rem; color: var(--text-3); cursor: pointer; }
</style>
