<template>
  <div class="mobileIndex">
    <!-- Hero -->
    <div class="mobileIndex-title">
      <h6>Trade like a pro</h6>
      <p class="introduceContent"></p>
      <div class="coin-animation">
        <div class="el-icon-right" />
        <div class="coin-img" />
        <div class="coin-img" />
        <div class="coin-img" />
        <div class="coin-bor" />
      </div>
    </div>

    <!-- Fast plate -->
    <div class="popularStocks-header index-title wow show-backInRight">
      <span>Fast plate</span>
    </div>
    <div class="common-functions2">
      <div class="item" @click="$router.push('/assets')">
        <i class="iconfont icon-a-chongzhi1">↑</i>
        <span>Deposit</span>
      </div>
      <div class="item" @click="$router.push('/assets')">
        <i class="iconfont icon-tixian">↓</i>
        <span>Withdraw</span>
      </div>
    </div>
    <div class="common-functions">
      <div class="item" @click="$router.push('/earn')">
        <i class="iconfont icon-ico">◆</i>
        <span>ICO</span>
      </div>
      <div class="item" @click="$router.push('/earn')">
        <i class="iconfont icon-a-jiedai1">$</i>
        <span>Loan</span>
      </div>
    </div>

    <!-- Banner swiper placeholder -->
    <div class="swiper-container swiper-wrapper banner-box market-banner" v-if="topBanner">
      <div class="swiper-wrapper">
        <div class="banner-item">
          <p>Invest in newly issued tokens and enjoy potentially high return opportunities</p>
          <span class="swiper-tag" @click="$router.push('/earn')">Start your ICO journey</span>
        </div>
      </div>
    </div>

    <!-- Popular Stocks -->
    <div class="popularStocks-header index-title">
      <span>Popular</span>
      <span class="more" @click="$router.push('/market')">More</span>
    </div>
    <div class="marketIndex" v-if="coins.length">
      <div class="marketIndex-list">
        <div class="market-item" v-for="(c,idx) in coins.slice(0,5)" :key="c.fromSymbol" :style="{animationDelay:idx*.06+'s'}">
          <div class="market-item-l">
            <img :src="c.iconUrl" class="coin-img" @error="e=>e.target.style.display='none'" />
            <div>
              <span class="coin-name">{{c.fromSymbol}}</span>
              <span class="coin-pair">/USDT</span>
            </div>
          </div>
          <div class="market-item-m">
            <MiniKline v-if="c.klineRespList" :data="c.klineRespList" :isUp="c.isUp" :w="72" :h="28" />
          </div>
          <div class="market-item-r">
            <span class="coin-price">{{c.lastPrice}}</span>
            <span class="coin-change" :class="c.isUp?'up':'down'">{{c.rate}}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Loan -->
    <div class="live-c flex flex-col items-center">
      <div class="lc-icon"><i class="iconfont icon-Flex">$</i></div>
      <h3>Borrow with peace of mind</h3>
      <p>Safe and flexible borrowing to improve fund utilization</p>
      <el-button class="index-btn" size="medium" @click="$router.push('/earn')">Click to view</el-button>
    </div>

    <!-- News -->
    <div class="popularStocks-header index-title">
      <span>News</span>
      <span class="more">More</span>
    </div>
    <div class="news-list">
      <div class="news-item" v-for="(n,i) in newsList.slice(0,3)" :key="i">
        <div>
          <span class="news-title">{{n.coinName}}</span>
          <span class="news-sub">market update</span>
        </div>
        <span class="news-change" :class="parseFloat(n.change24h)>=0?'up':'down'">{{n.change24h}}%</span>
      </div>
      <div v-if="!newsList.length" class="news-loading">Loading...</div>
    </div>

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
  data: () => ({ coins: [], newsList: [], topBanner: true }),
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
      if(i>=0){const c={...this.coins[i]};if(d.lastPrice)c.lastPrice=d.lastPrice;if(d.priceChangePercent!==undefined){c.rate=parseFloat(d.priceChangePercent).toFixed(2);c.isUp=+d.priceChangePercent>=0;c.rate=c.isUp?'+'+c.rate:c.rate;}this.$set(this.coins,i,c);}
    }
  },
  created() { this.fetch(); this._t = setInterval(()=>this.fetch(), 8000); },
  mounted() { connect(this.onWs); },
  beforeDestroy() { if(this._t) clearInterval(this._t); }
};
</script>

<style scoped>
.mobileIndex { min-height: 100vh; }

/* Hero */
.mobileIndex-title { padding: .32rem .16rem .4rem; text-align: center; position: relative; overflow: hidden; }
.mobileIndex-title h6 { font-size: .427rem; font-weight: 700; color: #fff; margin-bottom: .08rem; }
.introduceContent { font-size: .173rem; color: rgba(255,255,255,.6); min-height: .24rem; }

.coin-animation { position: relative; height: 1.6rem; margin-top: .133rem; }
.el-icon-right { width: .533rem; height: .533rem; border-radius: 50%; background: linear-gradient(135deg, #14a1f3, #03ddfe); position: absolute; left: 50%; top: 50%; transform: translate(-50%,-50%); animation: coinPulse 2s ease infinite; }
.coin-img { width: .4rem; height: .4rem; border-radius: 50%; border: 2px solid rgba(255,255,255,.2); position: absolute; }
.coin-img:nth-child(2) { left: 20%; top: 30%; animation: coinFloat 3s ease infinite; }
.coin-img:nth-child(3) { right: 20%; top: 40%; animation: coinFloat 3s ease .5s infinite; }
.coin-img:nth-child(4) { left: 30%; top: 60%; animation: coinFloat 3s ease 1s infinite; }
.coin-bor { width: .267rem; height: .267rem; border-radius: 50%; border: 1px solid rgba(255,255,255,.15); position: absolute; left: 60%; top: 20%; }
@keyframes coinPulse { 0%,100%{ transform: translate(-50%,-50%) scale(1); opacity: .8 } 50%{ transform: translate(-50%,-50%) scale(1.15); opacity: .4 } }
@keyframes coinFloat { 0%,100%{ transform: translateY(0) } 50%{ transform: translateY(-10px) } }

/* Section Headers */
.popularStocks-header.index-title { display: flex; justify-content: space-between; align-items: center; padding: .213rem .16rem .133rem; }
.popularStocks-header span:first-child { font-size: .213rem; font-weight: 700; }
.more { font-size: .16rem; color: var(--text-3); cursor: pointer; }

/* Fast Plate */
.common-functions, .common-functions2 { display: grid; grid-template-columns: repeat(2,1fr); gap: .107rem; padding: 0 .16rem; }
.common-functions { margin-top: .107rem; margin-bottom: .213rem; }
.item { display: flex; flex-direction: column; align-items: center; gap: .08rem; padding: .16rem; background: var(--bg-white); border-radius: .107rem; border: 1px solid var(--border-1); cursor: pointer; }
.item i { font-size: .32rem; color: var(--primary); font-style: normal; }
.item span { font-size: .16rem; }

/* Banner */
.banner-box { margin: 0 .16rem .213rem; padding: .213rem; background: linear-gradient(135deg,rgba(20,161,243,.1) 0%,rgba(3,221,254,.05) 100%); border-radius: .107rem; border: 1px solid var(--border-1); }
.banner-item p { font-size: .147rem; color: var(--text-2); margin-bottom: .107rem; }
.swiper-tag { font-size: .16rem; color: var(--primary); cursor: pointer; font-weight: 600; }

/* Popular Coins */
.marketIndex { padding: 0 .16rem; }
.marketIndex-list { display: flex; flex-direction: column; gap: 1px; }
.market-item { display: flex; align-items: center; justify-content: space-between; padding: .107rem .133rem; background: var(--bg-white); border-radius: .067rem; border: 1px solid var(--border-1); animation: mItemIn .4s ease both; }
@keyframes mItemIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
.market-item-l { display: flex; align-items: center; gap: .08rem; }
.coin-img { width: .32rem; height: .32rem; border-radius: 50%; animation: none; border: none; position: static; }
.coin-name { font-size: .173rem; font-weight: 600; display: block; }
.coin-pair { font-size: .12rem; color: var(--text-4); }
.coin-price { font-size: .16rem; font-family: var(--font-mono); display: block; text-align: right; }
.coin-change { font-size: .133rem; display: block; text-align: right; }
.up { color: var(--up); } .down { color: var(--down); }

/* Loan */
.live-c { margin: .267rem .16rem; padding: .32rem .213rem; background: var(--bg-white); border-radius: .107rem; border: 1px solid var(--border-1); text-align: center; }
.lc-icon i { font-size: .4rem; color: var(--primary); font-style: normal; }
.live-c h3 { font-size: .213rem; margin: .107rem 0 .08rem; }
.live-c p { font-size: .133rem; color: var(--text-3); margin-bottom: .16rem; }

/* News */
.news-list { padding: 0 .16rem; }
.news-item { display: flex; justify-content: space-between; align-items: center; padding: .107rem .133rem; background: var(--bg-white); border-radius: .067rem; border: 1px solid var(--border-1); margin-bottom: .053rem; }
.news-title { font-size: .16rem; font-weight: 500; display: block; }
.news-sub { font-size: .12rem; color: var(--text-4); }
.news-change { font-size: .16rem; font-weight: 600; }
.news-loading { text-align: center; padding: .133rem; color: var(--text-3); font-size: .133rem; }
</style>
