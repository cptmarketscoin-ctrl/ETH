<template>
  <div class="home-page">
    <!-- Header -->
    <header class="h-header">
      <div class="h-logo">CPT Exchange</div>
      <div class="h-right">
        <span class="h-connect">Connect</span>
        <i class="el-icon-s-fold h-menu" />
      </div>
    </header>

    <!-- Hero -->
    <section class="h-hero">
      <h1>Trade like a pro</h1>
      <div class="h-hero-anim">
        <div class="h-circles">
          <span class="c1" />
          <span class="c2" />
          <span class="c3" />
        </div>
      </div>
    </section>

    <!-- Fast Plate -->
    <section class="h-plate">
      <h3>Fast plate</h3>
      <div class="h-plate-grid">
        <div class="h-pitem" @click="$router.push('/assets')">
          <i class="el-icon-upload2" />
          <span>Deposit</span>
        </div>
        <div class="h-pitem" @click="$router.push('/assets')">
          <i class="el-icon-download" />
          <span>Withdraw</span>
        </div>
        <div class="h-pitem" @click="$router.push('/earn')">
          <i class="el-icon-s-promotion" />
          <span>ICO</span>
        </div>
        <div class="h-pitem" @click="$router.push('/earn')">
          <i class="el-icon-money" />
          <span>Loan</span>
        </div>
      </div>
    </section>

    <!-- Popular Coins -->
    <section class="h-popular" v-if="coins.length">
      <div class="h-sec-hd">
        <h3>Popular</h3>
        <span class="h-more" @click="$router.push('/market')">More <i class="el-icon-arrow-right" /></span>
      </div>
      <div class="h-coin-list">
        <div v-for="(c,idx) in coins.slice(0,5)" :key="c.fromSymbol" class="h-coin-item" :style="{animationDelay:idx*.05+'s'}">
          <div class="h-coin-l">
            <img :src="c.iconUrl" class="h-cicon" @error="e=>e.target.style.display='none'" />
            <span class="h-csym">{{c.fromSymbol}}</span>
          </div>
          <div class="h-chart">
            <MiniKline v-if="c.klineRespList" :data="c.klineRespList" :isUp="c.isUp" :w="80" :h="32" />
          </div>
          <div class="h-coin-r">
            <span class="h-cprice">{{c.lastPrice}}</span>
            <span class="h-cchange" :class="c.isUp?'up':'down'">{{c.rate}}%</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Loan -->
    <section class="h-loan">
      <div class="h-loan-hd">
        <i class="el-icon-money" />
        <span>Loan</span>
      </div>
      <div class="h-loan-body">
        <h3>Borrow with peace of mind</h3>
        <p>Safe and flexible borrowing to improve fund utilization</p>
        <el-button type="primary" round @click="$router.push('/earn')">Click to view</el-button>
      </div>
    </section>

    <!-- ICO -->
    <section class="h-ico">
      <p>Invest in newly issued tokens and enjoy potentially high return opportunities</p>
      <el-button type="primary" round @click="$router.push('/earn')">Start your ICO journey</el-button>
    </section>

    <!-- News -->
    <section class="h-news">
      <div class="h-sec-hd">
        <h3>News</h3>
        <span class="h-more">More <i class="el-icon-arrow-right" /></span>
      </div>
      <div class="h-news-list">
        <div v-for="(n,i) in newsList.slice(0,3)" :key="i" class="h-news-item">
          <span>{{n.coinName}}</span>
          <span :class="parseFloat(n.change24h)>=0?'up':'down'">{{n.change24h}}%</span>
        </div>
        <div v-if="!newsList.length" class="h-news-loading">Loading...</div>
      </div>
    </section>

    <div style="height:80px"></div>
  </div>
</template>

<script>
import { pageHome, getStockList, coinIcon as cnIcon } from '../api';
import { connect } from '../api/ws';
import MiniKline from '../components/MiniKline.vue';

export default {
  name: 'HomePage',
  components: { MiniKline },
  data: () => ({ coins: [], newsList: [] }),
  methods: {
    cnIcon,
    async fetch() {
      try { const r = await pageHome(); if(r.code===200) this.coins = (r.content||[]).map(c=>({...c, iconUrl:cnIcon(c.fromSymbol||c.coinName), isUp:parseFloat(c.rate||0)>=0})); } catch(e){}
      try { const r = await getStockList(); if(r.code===200) this.newsList = (r.content||[]).slice(0,10); } catch(e){}
    },
    onWs(msg) {
      if(msg.type!=='1004') return;
      const s = (msg.symbol||'').replace('USDT',''), d = msg.optionMakerResponse||{};
      const i = this.coins.findIndex(c=>c.fromSymbol===s);
      if(i>=0) {
        const c = {...this.coins[i]};
        if(d.lastPrice) c.lastPrice = d.lastPrice;
        if(d.priceChangePercent!==undefined) { c.rate = parseFloat(d.priceChangePercent).toFixed(2); c.isUp = parseFloat(d.priceChangePercent)>=0; c.rate = c.isUp ? '+'+c.rate : c.rate; }
        this.$set(this.coins, i, c);
      }
    }
  },
  created() { this.fetch(); this._t = setInterval(()=>this.fetch(), 8000); },
  mounted() { connect(this.onWs); },
  beforeDestroy() { if(this._t) clearInterval(this._t); }
};
</script>

<style scoped>
.home-page { min-height: 100vh; }

/* Header */
.h-header { display: flex; justify-content: space-between; align-items: center; padding: .133rem .16rem; }
.h-logo { font-size: .213rem; font-weight: 700; }
.h-right { display: flex; align-items: center; gap: .133rem; }
.h-connect { font-size: .16rem; color: var(--text-2); }
.h-menu { font-size: .24rem; color: var(--text-1); }

/* Hero */
.h-hero { padding: 0 .16rem .267rem; position: relative; }
.h-hero h1 { font-size: .32rem; font-weight: 700; margin-bottom: .133rem; }
.h-hero-anim { height: 2rem; position: relative; }
.h-circles { position: absolute; width: 100%; height: 100%; }
.h-circles span { position: absolute; border-radius: 50%; border: 1px solid var(--border-1); }
.c1 { width: 1.5rem; height: 1.5rem; top: .2rem; right: .5rem; opacity: .3; animation: pulse 3s ease infinite; }
.c2 { width: 1rem; height: 1rem; top: .5rem; right: 1rem; opacity: .2; animation: pulse 3s ease .5s infinite; }
.c3 { width: .6rem; height: .6rem; top: .8rem; right: 1.5rem; opacity: .1; animation: pulse 3s ease 1s infinite; }
@keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.1)} }

/* Fast Plate */
.h-plate { padding: 0 .16rem .267rem; }
.h-plate h3 { font-size: .187rem; margin-bottom: .133rem; }
.h-plate-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: .107rem; }
.h-pitem { display: flex; flex-direction: column; align-items: center; gap: .08rem; padding: .16rem; background: var(--bg-white); border-radius: .107rem; border: 1px solid var(--border-1); }
.h-pitem i { font-size: .32rem; color: var(--primary); }
.h-pitem span { font-size: .133rem; }

/* Popular */
.h-popular { padding: 0 .16rem .267rem; }
.h-sec-hd { display: flex; justify-content: space-between; align-items: center; margin-bottom: .133rem; }
.h-sec-hd h3 { font-size: .187rem; }
.h-more { font-size: .133rem; color: var(--text-3); }
.h-coin-list { display: flex; flex-direction: column; gap: .053rem; }
.h-coin-item { display: flex; align-items: center; justify-content: space-between; padding: .107rem .133rem; background: var(--bg-white); border-radius: .107rem; border: 1px solid var(--border-1); animation: itemIn .4s ease both; }
@keyframes itemIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
.h-coin-l { display: flex; align-items: center; gap: .08rem; }
.h-cicon { width: .32rem; height: .32rem; border-radius: 50%; }
.h-csym { font-size: .16rem; font-weight: 600; }
.h-cprice { font-size: .16rem; font-family: var(--font-mono); display: block; text-align: right; }
.h-cchange { font-size: .133rem; display: block; text-align: right; }
.up { color: var(--up); } .down { color: var(--down); }

/* Loan */
.h-loan { margin: 0 .16rem .267rem; background: var(--bg-white); border-radius: .107rem; border: 1px solid var(--border-1); overflow: hidden; }
.h-loan-hd { display: flex; align-items: center; gap: .08rem; padding: .133rem; border-bottom: 1px solid var(--border-1); }
.h-loan-hd i { font-size: .24rem; color: var(--primary); }
.h-loan-body { padding: .213rem; text-align: center; }
.h-loan-body h3 { font-size: .2rem; margin-bottom: .08rem; }
.h-loan-body p { font-size: .133rem; color: var(--text-3); margin-bottom: .133rem; }

/* ICO */
.h-ico { margin: 0 .16rem .267rem; padding: .213rem; background: linear-gradient(135deg, var(--bg-card) 0%, var(--bg-white) 100%); border-radius: .107rem; border: 1px solid var(--border-1); text-align: center; }
.h-ico p { font-size: .133rem; color: var(--text-2); margin-bottom: .133rem; }

/* News */
.h-news { padding: 0 .16rem; }
.h-news-list { display: flex; flex-direction: column; gap: .053rem; }
.h-news-item { display: flex; justify-content: space-between; padding: .107rem .133rem; background: var(--bg-white); border-radius: .053rem; border: 1px solid var(--border-1); font-size: .133rem; }
.h-news-loading { text-align: center; padding: .133rem; color: var(--text-3); font-size: .133rem; }
</style>
