<template>
  <div class="home-page">
    <!-- Header -->
    <header class="home-header">
      <div class="h-left">
        <span class="logo">CPT Exchange</span>
      </div>
      <div class="h-right">
        <span class="h-notify">Notification</span>
        <span class="h-user">Sign In</span>
      </div>
    </header>

    <!-- Ticker strip -->
    <div class="ticker-bar" v-if="coins.length">
      <div class="ticker-inner">
        <span v-for="(c,i) in tickerData" :key="i" class="tick" :class="c.up ? 'up' : 'down'">
          {{ c.symbol }} {{ c.price }} <small>{{ c.change }}%</small>
        </span>
        <span v-for="(c,i) in tickerData" :key="'r'+i" class="tick" :class="c.up ? 'up' : 'down'">
          {{ c.symbol }} {{ c.price }} <small>{{ c.change }}%</small>
        </span>
      </div>
    </div>

    <!-- Coin cards -->
    <div class="coin-section" v-if="coins.length">
      <div v-for="(coin, idx) in coins" :key="coin.fromSymbol" class="coin-card" :style="{ animationDelay: idx * 0.05 + 's' }" @click="goTrade(coin.fromSymbol)">
        <div class="card-row1">
          <img :src="coin.iconUrl" class="card-icon" @error="e=>e.target.style.display='none'" />
          <span class="card-symbol">{{ coin.fromSymbol }}</span>
          <span class="card-pair">/USDT</span>
        </div>
        <div class="card-row2">
          <span class="card-price">{{ coin.lastPrice }}</span>
        </div>
        <div class="card-row3">
          <span class="card-change" :class="coin.isUp ? 'up' : 'down'">{{ coin.rate }}%</span>
          <span class="card-vol">Vol {{ coin.twentyFourHrResp?.volume || 0 | fmtVol }}</span>
        </div>
        <div class="card-row4">
          <MiniKline v-if="coin.klineRespList" :data="coin.klineRespList" :isUp="coin.isUp" :w="140" :h="40" />
        </div>
      </div>
    </div>

    <!-- Skeleton -->
    <div class="coin-section" v-else>
      <div v-for="i in 8" :key="i" class="coin-card skel"><div class="skel-bar" v-for="j in 4" :key="j" /></div>
    </div>

    <!-- News -->
    <div class="news-section" v-if="newsList.length">
      <h3 class="news-title">Market News</h3>
      <div v-for="(item,i) in newsList.slice(0,5)" :key="i" class="news-item">
        <span class="news-left">{{ item.coinName }}</span>
        <span class="news-right" :class="parseFloat(item.change24h)>=0?'up':'down'">{{ item.change24h }}%</span>
      </div>
    </div>

    <div style="height:60px"></div>
  </div>
</template>

<script>
import { pageHome, getStockList, coinIcon as cnIcon } from '../api';
import { connect } from '../api/ws';
import MiniKline from '../components/MiniKline.vue';

export default {
  name: 'HomePage',
  components: { MiniKline },
  filters: {
    fmtVol(v) { const n = parseFloat(v)||0; return n>=1e9?(n/1e9).toFixed(1)+'B':n>=1e6?(n/1e6).toFixed(1)+'M':(n/1e3).toFixed(1)+'K'; }
  },
  data: () => ({
    coins: [], newsList: [], tickerData: []
  }),
  methods: {
    cnIcon, goTrade(s) { this.$router.push('/trade/' + s); },
    async fetch() {
      try { const r = await pageHome(); if(r.code===200){ this.coins=(r.content||[]).map(c=>({...c,iconUrl:cnIcon(c.fromSymbol||c.coinName),isUp:parseFloat(c.rate||0)>=0})); this.tickerData=this.coins.map(c=>({symbol:c.fromSymbol,price:c.lastPrice,change:c.rate,up:c.isUp})); } } catch(e){}
      try { const r = await getStockList(); if(r.code===200) this.newsList=(r.content||[]).slice(0,20); } catch(e){}
    },
    onWs(msg) {
      if(msg.type!=='1004') return;
      const s=(msg.symbol||'').replace('USDT',''), d=msg.optionMakerResponse||{};
      const i=this.coins.findIndex(c=>c.fromSymbol===s);
      if(i>=0){ const c={...this.coins[i]}; if(d.lastPrice)c.lastPrice=d.lastPrice; if(d.priceChangePercent!==undefined){c.rate=parseFloat(d.priceChangePercent).toFixed(2);c.isUp=parseFloat(d.priceChangePercent)>=0;c.rate=c.isUp?'+'+c.rate:c.rate;} this.$set(this.coins,i,c); this.tickerData[i]={symbol:s,price:c.lastPrice,change:c.rate,up:c.isUp}; }
    }
  },
  created() { this.fetch(); this._t=setInterval(()=>this.fetch(),8000); },
  mounted() { connect(this.onWs); },
  beforeDestroy() { if(this._t) clearInterval(this._t); }
};
</script>

<style scoped>
/* rem base ≈ 75px, klakna.sbs exact values */
.home-page { padding: .133rem .16rem; min-height: 100vh; }

.home-header { display: flex; justify-content: space-between; align-items: center; padding: .08rem 0 .133rem 0; }
.logo { font-size: .213rem; font-weight: 700; }
.h-notify, .h-user { font-size: .16rem; color: var(--text-3); margin-left: .16rem; cursor: pointer; }

.ticker-bar { height: .32rem; overflow: hidden; margin-bottom: .133rem; background: var(--bg-white); border-radius: .053rem; display: flex; align-items: center; padding: 0 .107rem; }
.ticker-inner { display: flex; gap: .267rem; animation: tick 20s linear infinite; white-space: nowrap; }
.tick { font-size: .133rem; font-weight: 500; }
.tick small { margin-left: .053rem; }
.up { color: var(--up); } .down { color: var(--down); }
@keyframes tick { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

.coin-section { display: grid; grid-template-columns: repeat(2, 1fr); gap: .107rem; }
@media (min-width: 640px) { .coin-section { grid-template-columns: repeat(3, 1fr); } }
@media (min-width: 1024px) { .coin-section { grid-template-columns: repeat(4, 1fr); } }

.coin-card { background: var(--bg-white); border-radius: .107rem; padding: .16rem; cursor: pointer; animation: cardIn .4s ease both; border: 1px solid var(--border-1); transition: border-color .15s; }
.coin-card:hover { border-color: var(--primary); }
@keyframes cardIn { from { opacity: 0; transform: translateY(.133rem); } to { opacity: 1; transform: translateY(0); } }

.card-row1 { display: flex; align-items: center; gap: .08rem; margin-bottom: .107rem; }
.card-icon { width: .267rem; height: .267rem; border-radius: 50%; }
.card-symbol { font-size: .173rem; font-weight: 700; }
.card-pair { font-size: .133rem; color: var(--text-3); }

.card-row2 { margin-bottom: .08rem; }
.card-price { font-size: .24rem; font-weight: 700; font-family: var(--font-mono); }

.card-row3 { display: flex; justify-content: space-between; margin-bottom: .08rem; font-size: .133rem; }
.card-change { font-weight: 600; }
.card-vol { color: var(--text-3); }

.card-row4 { overflow: hidden; border-radius: .053rem; }

.news-section { margin-top: .267rem; }
.news-title { font-size: .187rem; margin-bottom: .133rem; }
.news-item { display: flex; justify-content: space-between; padding: .107rem .133rem; background: var(--bg-white); border-bottom: 1px solid var(--border-2); font-size: .16rem; }
.news-left { font-weight: 500; }
.news-right { font-weight: 600; }

.skel { animation: none; }
.skel-bar { height: .16rem; background: var(--border-2); margin-bottom: .08rem; border-radius: .027rem; width: 80%; }
.skel-bar:first-child { width: 40%; }
</style>
