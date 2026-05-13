<template>
<div class="mobileIndex">
  <!-- Hero -->
  <div class="mobileIndex-title">
    <h6>Trade like a pro</h6>
    <p class="introduceContent"></p>
    <div class="coin-animation">
      <div class="el-icon-right"/><div class="coin-img"/><div class="coin-img"/><div class="coin-img"/><div class="coin-bor"/>
    </div>
  </div>

  <!-- Fast plate header -->
  <div class="popularStocks-header index-title wow show-backInRight"><span>Fast plate</span></div>

  <!-- Actions row 1 -->
  <div class="common-functions2">
    <div class="item"><i class="iconfont icon-a-chongzhi1"/><span>Deposit</span></div>
    <div class="item"><i class="iconfont icon-tixian"/><span>Withdraw</span></div>
  </div>

  <!-- Actions row 2 -->
  <div class="common-functions">
    <div class="item"><i class="iconfont icon-ico"/><span>ICO</span></div>
    <div class="item"><i class="iconfont icon-a-jiedai1"/><span>Loan</span></div>
  </div>

  <!-- Swiper banners -->
  <div class="swiper-container swiper-wrapper banner-box market-banner">
    <div class="swiper-wrapper"><div class="skeleton-line"/></div>
  </div>
  <div class="swiper-box">
    <div class="swiper-container swiper-wrapper banner-box swiper-in swiper-active">
      <div class="swiper-wrapper"/><div class="swiper-pagination1"/><span class="swiper-notification"/>
    </div>
  </div>

  <!-- Market Index (Popular coins from our API) -->
  <div class="marketIndex marketSection" v-if="coins.length">
    <div class="marketIndex-header popularStocks-header index-title">
      <span>Popular</span><span class="more" @click="$router.push('/market')">More</span>
    </div>
    <ul class="marketIndex-list">
      <li v-for="(c,i) in coins.slice(0,5)" :key="c.fromSymbol" :style="{animationDelay:i*0.04+'s'}" @click="$router.push('/trade/'+c.fromSymbol)">
        <div class="mi-left">
          <img :src="c.iconUrl" class="mi-icon" @error="e=>e.target.style.display='none'"/>
          <div><span class="mi-sym">{{c.fromSymbol}}</span><span class="mi-pair">/USDT</span></div>
        </div>
        <MiniKline v-if="c.klineRespList" :data="c.klineRespList" :isUp="c.isUp" :w="64" :h="20"/>
        <span class="mi-pr">{{c.lastPrice}}</span>
        <span class="mi-ch" :class="c.isUp?'up':'down'">{{c.rate}}%</span>
      </li>
    </ul>
  </div>

  <!-- Index Tabs -->
  <div class="index-tabs">
    <div class="tabs-header"><div class="live-c flex flex-col items-center">
      <div class="lc-header"><span>Loan</span></div>
      <h3>Borrow with peace of mind</h3>
      <p>Safe and flexible borrowing to improve fund utilization</p>
      <el-button class="index-btn" size="medium" @click="$router.push('/earn')">Click to view</el-button>
    </div></div>
  </div>

  <!-- ICO section -->
  <div class="coin-trade">
    <div class="popularStocks-header wow show-backInRight"><span>ICO</span></div>
    <p>Invest in newly issued tokens and enjoy potentially high return opportunities</p>
    <div class="home-goTrade"><div class="content">
      <span class="el-button index-btn" @click="$router.push('/earn')">Start your ICO journey</span>
    </div></div>
  </div>

  <!-- News -->
  <div class="news-container"><div class="news">
    <div class="newsList-header popularStocks-header"><span>News</span><span class="more">More</span></div>
    <div class="newsCastrate">
      <div v-for="(n,i) in newsList.slice(0,3)" :key="i" class="news-item">
        <span>{{n.coinName}}</span>
        <span :class="parseFloat(n.change24h)>=0?'up':'down'">{{n.change24h}}%</span>
      </div>
    </div>
  </div></div>

  <!-- Partners -->
  <div class="partners"><div class="popularStocks-header wow show-backInRight"><span>Partners</span></div></div>

  <div style="height:60px"/>
</div>
</template>

<script>
import { pageHome, getStockList, coinIcon as ci } from '../api'; import { connect } from '../api/ws'; import MiniKline from '../components/MiniKline.vue';
export default { name:'HomePage', components:{MiniKline}, data:()=>({coins:[],newsList:[]}), methods:{ci,async fetch(){try{const r=await pageHome();if(r.code===200)this.coins=(r.content||[]).map(c=>({...c,iconUrl:ci(c.fromSymbol||c.coinName),isUp:parseFloat(c.rate||0)>=0}))}catch(e){}try{const r=await getStockList();if(r.code===200)this.newsList=(r.content||[]).slice(0,10)}catch(e){}},onWs(msg){if(msg.type!=='1004')return;const s=(msg.symbol||'').replace('USDT',''),d=msg.optionMakerResponse||{},i=this.coins.findIndex(c=>c.fromSymbol===s);if(i>=0){const c={...this.coins[i]};if(d.lastPrice)c.lastPrice=d.lastPrice;if(d.priceChangePercent!==undefined){c.rate=parseFloat(d.priceChangePercent).toFixed(2);c.isUp=+d.priceChangePercent>=0;c.rate=c.isUp?'+'+c.rate:c.rate}this.$set(this.coins,i,c)}}}, created(){this.fetch();this._t=setInterval(()=>this.fetch(),8000)},mounted(){connect(this.onWs)},beforeDestroy(){clearInterval(this._t)}};
</script>

<style scoped>
/* 全部CSS直接取自klakna克隆页 */
.mobileIndex{background:#151517;min-height:100vh;overflow:hidden}
.mobileIndex-title{text-align:center;padding:30px 20px;position:relative}
.mobileIndex-title h6{font-size:34.32px;font-weight:700;color:#fff;line-height:1.5;margin-bottom:8px}
.introduceContent{font-size:14px;color:rgba(255,255,255,.6)}
.coin-animation{position:relative;height:150px;margin-top:20px}
.el-icon-right{width:55px;height:55px;border-radius:50%;background:linear-gradient(135deg,#14a1f3,#03ddfe);position:absolute;left:50%;top:40%;transform:translate(-50%,-50%);animation:pulse 2.5s ease infinite}
.coin-img{position:absolute;border-radius:50%;border:2px solid rgba(255,255,255,.15)}
.coin-img:nth-child(2){width:18px;height:18px;left:25%;top:50%;animation:float 3s ease .5s infinite}
.coin-img:nth-child(3){width:14px;height:14px;right:20%;top:35%;animation:float 3.5s ease 1s infinite}
.coin-img:nth-child(4){width:12px;height:12px;left:30%;top:60%;animation:float 3s ease 1.5s infinite}
.coin-bor{position:absolute;width:28px;height:28px;border-radius:50%;border:1px solid rgba(255,255,255,.1);right:35%;top:25%}
@keyframes pulse{0%,100%{transform:translate(-50%,-50%)scale(1);opacity:.8}50%{transform:translate(-50%,-50%)scale(1.15);opacity:.4}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}

.popularStocks-header{display:flex;justify-content:space-between;align-items:center;padding:16px 16px 10px}
.popularStocks-header span:first-child{font-size:20.787px;font-weight:700;color:#fff}
.more{font-size:14px;color:#999;cursor:pointer}
.common-functions2,.common-functions{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:0 16px}
.common-functions{margin-top:10px;margin-bottom:16px}
.item{display:flex;align-items:center;justify-content:center;gap:8px;padding:16px;background:#1c1c1e;border-radius:8px;border:1px solid #31353d;cursor:pointer}
.item i{font-size:24px;color:#14a1f3;font-style:normal}
.item span{font-size:13.533px;color:rgb(196,196,196)}
.banner-box{margin:12px 16px;border-radius:8px;background:linear-gradient(135deg,rgba(20,161,243,.08),transparent)}
.skeleton-line{height:60px;background:rgba(255,255,255,.03);border-radius:6px;margin:12px}
.swiper-box{margin:0 16px 12px}

.marketIndex-header,.newsList-header{padding:6px 16px}
.marketIndex{padding:0 16px}
.marketIndex-list{list-style:none;margin:0;padding:0}
.marketIndex-list li{display:flex;align-items:center;gap:8px;padding:10px 12px;background:#1c1c1e;border-radius:6px;border:1px solid #31353d;margin-bottom:6px;cursor:pointer;animation:rowIn .35s ease both}
@keyframes rowIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
.mi-left{flex:1;display:flex;align-items:center;gap:8px}
.mi-icon{width:26px;height:26px;border-radius:50%}
.mi-sym{font-size:15px;font-weight:600;display:block;color:#fff}
.mi-pair{font-size:11px;color:#999;display:block}
.mi-pr{font-size:14px;font-family:monospace}
.mi-ch{font-size:12px;font-weight:600;min-width:56px;text-align:right}
.up{color:#b9f82d}.down{color:#ff4d4f}

.index-tabs{margin:16px}
.live-c{text-align:center;padding:24px 20px;background:#1c1c1e;border-radius:8px;border:1px solid #31353d}
.lc-header{color:#14a1f3;font-size:18px;font-weight:700;margin-bottom:8px}
.live-c h3{font-size:18px;font-weight:700;color:#fff;margin:8px 0}
.live-c p{font-size:13px;color:rgb(196,196,196);margin-bottom:12px}
.index-btn{border-radius:26px!important;padding:10px 40px!important;font-size:14.547px!important;font-weight:700!important;background:#fff!important;color:#000!important;border:none!important}

.coin-trade{padding:16px}
.coin-trade p{font-size:16.653px;color:#fff;margin:10px 0 16px}
.home-goTrade{text-align:center}
.home-goTrade .el-button{background:#fff;color:#000;border-radius:26px;padding:10px 40px;font-weight:700;font-size:15px}

.news-container{padding:0 16px}
.news-item{display:flex;justify-content:space-between;padding:8px 12px;background:#1c1c1e;border-radius:6px;border:1px solid #31353d;margin-bottom:4px;font-size:14px}
.partners{padding:0 16px 30px}
</style>
