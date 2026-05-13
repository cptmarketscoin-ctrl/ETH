<template>
<div class="mobileIndex">
  <div class="mobileIndex-title"><h6>Trade like a pro</h6><p class="introduceContent"/><div class="coin-animation"><div class="el-icon-right"/><div class="coin-img"/><div class="coin-img"/><div class="coin-img"/><div class="coin-bor"/></div></div>
  <div class="popularStocks-header index-title wow show-backInRight"><span>Fast plate</span></div>
  <div class="common-functions2"><div class="item"><i class="iconfont icon-a-chongzhi1"/><span>Deposit</span></div><div class="item"><i class="iconfont icon-tixian"/><span>Withdraw</span></div></div>
  <div class="common-functions"><div class="item"><i class="iconfont icon-ico"/><span>ICO</span></div><div class="item"><i class="iconfont icon-a-jiedai1"/><span>Loan</span></div></div>
  
  <div v-if="coins.length">
    <div class="popularStocks-header marketIndex-header index-title"><span>Popular</span><span class="more" @click="$router.push('/market')">More</span></div>
    <ul class="marketIndex-list">
      <li v-for="c in coins.slice(0,5)" :key="c.fromSymbol" @click="$router.push('/trade/'+c.fromSymbol)">
        <div class="mi-l"><img :src="c.iconUrl" class="mi-icon" @error="e=>e.target.style.display='none'"/><div><span class="mi-sym">{{c.fromSymbol}}</span><span class="mi-pair">/USDT</span></div></div>
        <MiniKline v-if="c.klineRespList" :data="c.klineRespList" :isUp="c.isUp" :w="64" :h="20"/>
        <span class="mi-pr">{{c.lastPrice}}</span><span class="mi-ch" :class="c.isUp?'up':'down'">{{c.rate}}%</span>
      </li>
    </ul>
  </div>

  <div class="index-tabs" v-if="showLoan">
    <div class="live-c flex flex-col items-center">
      <span class="lc-name">Loan</span>
      <h3>Borrow with peace of mind</h3><p>Safe and flexible borrowing to improve fund utilization</p>
      <span class="index-btn" @click="$router.push('/earn')">Click to view</span>
    </div>
  </div>

  <div class="coin-trade">
    <div class="popularStocks-header wow show-backInRight"><span>ICO</span></div>
    <p>Invest in newly issued tokens and enjoy potentially high return opportunities</p>
    <div class="home-goTrade"><span class="index-btn" @click="$router.push('/earn')">Start your ICO journey</span></div>
  </div>

  <div class="news-container" v-if="newsList.length"><div class="news">
    <div class="newsList-header popularStocks-header"><span>News</span><span class="more">More</span></div>
    <div class="newsCastrate"><div v-for="(n,i) in newsList.slice(0,3)" :key="i" class="news-item"><span>{{n.coinName}}</span><span :class="parseFloat(n.change24h)>=0?'up':'down'">{{n.change24h}}%</span></div></div>
  </div></div>

  <div class="partners"><div class="popularStocks-header wow show-backInRight"><span>Partners</span></div></div>
  <div style="height:60px"/>
</div>
</template>

<script>
import { pageHome, getStockList, coinIcon as ci } from '../api'; import { connect } from '../api/ws'; import MiniKline from '../components/MiniKline.vue';
export default { name:'HomePage', components:{MiniKline}, data:()=>({coins:[],newsList:[],showLoan:true}), methods:{ci,async fetch(){try{const r=await pageHome();if(r.code===200)this.coins=(r.content||[]).map(c=>({...c,iconUrl:ci(c.fromSymbol||c.coinName),isUp:parseFloat(c.rate||0)>=0}))}catch(e){}try{const r=await getStockList();if(r.code===200)this.newsList=(r.content||[]).slice(0,10)}catch(e){}},onWs(msg){if(msg.type!=='1004')return;const s=(msg.symbol||'').replace('USDT',''),d=msg.optionMakerResponse||{};const i=this.coins.findIndex(c=>c.fromSymbol===s);if(i>=0){const c={...this.coins[i]};if(d.lastPrice)c.lastPrice=d.lastPrice;if(d.priceChangePercent!==undefined){c.rate=parseFloat(d.priceChangePercent).toFixed(2);c.isUp=+d.priceChangePercent>=0;c.rate=c.isUp?'+'+c.rate:c.rate}this.$set(this.coins,i,c)}}},created(){this.fetch();this._t=setInterval(()=>this.fetch(),8000)},mounted(){connect(this.onWs)},beforeDestroy(){clearInterval(this._t)}};
</script>
