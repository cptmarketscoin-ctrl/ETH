<template>
<div class="mobileIndex">
  <!-- 1. Hero -->
  <div class="mobileIndex-title">
    <h6>Trade like a pro</h6>
    <p class="introduceContent"></p>
    <div class="coin-animation"><div class="ca c1"/><div class="ca c2"/><div class="ca c3"/><div class="ca c4"/></div>
  </div>

  <!-- 2. Fast plate -->
  <div class="popularStocks-header index-title"><span>Fast plate</span></div>
  <div class="common-functions2">
    <div class="item"><i class="iconfont">↑</i><span>Deposit</span></div>
    <div class="item"><i class="iconfont">↓</i><span>Withdraw</span></div>
  </div>
  <div class="common-functions">
    <div class="item"><i class="iconfont">◆</i><span>ICO</span></div>
    <div class="item"><i class="iconfont">$</i><span>Loan</span></div>
  </div>

  <!-- 3. Market Index (Popular coins) -->
  <div class="marketIndex" v-if="coins.length">
    <div class="marketIndex-header popularStocks-header">
      <span>Popular</span><span class="more">More</span>
    </div>
    <ul class="marketIndex-list">
      <li v-for="(c,i) in coins.slice(0,5)" :key="c.fromSymbol" :style="{animationDelay:i*.04+'s'}" @click="$router.push('/trade/'+c.fromSymbol)">
        <div class="mi-l">
          <img :src="c.iconUrl" class="mi-icon" @error="e=>e.target.style.display='none'"/>
          <div><span class="mi-sym">{{c.fromSymbol}}</span><span class="mi-pair">/USDT</span></div>
        </div>
        <MiniKline v-if="c.klineRespList" :data="c.klineRespList" :isUp="c.isUp" :w="64" :h="20"/>
        <span class="mi-pr">{{c.lastPrice}}</span>
        <span class="mi-ch" :class="c.isUp?'up':'down'">{{c.rate}}%</span>
      </li>
    </ul>
  </div>

  <!-- 4. Index Tabs (swiper content) -->
  <div class="index-tabs">
    <div class="swiper-wrapper banner-box" v-if="banners.length">
      <div class="banner-swipe" v-for="(b,i) in banners" :key="i">
        <p>{{b.text}}</p>
        <span class="swiper-tag" @click="$router.push(b.link)">{{b.cta}}</span>
      </div>
    </div>
  </div>

  <!-- 5. ICO -->
  <div class="coin-trade">
    <div class="popularStocks-header"><span>ICO</span></div>
    <p class="trade-desc">Invest in newly issued tokens and enjoy potentially high return opportunities</p>
    <div class="home-goTrade">
      <div class="content"><span class="el-button index-btn" @click="$router.push('/earn')">Start your ICO journey</span></div>
    </div>
  </div>

  <!-- 6. News -->
  <div class="news-container">
    <div class="news">
      <div class="newsList-header popularStocks-header"><span>News</span><span class="more">More</span></div>
      <div class="newsCastrate">
        <div v-for="(n,i) in newsList.slice(0,3)" :key="i" class="news-item"><span>{{n.coinName}}</span><span :class="parseFloat(n.change24h)>=0?'up':'down'">{{n.change24h}}%</span></div>
      </div>
    </div>
  </div>

  <!-- 7. Partners -->
  <div class="partners"><div class="popularStocks-header"><span>Partners</span></div></div>

  <div style="height:80px"/>
</div>
</template>

<script>
import { pageHome, getStockList, coinIcon as ci } from '../api'; import { connect } from '../api/ws'; import MiniKline from '../components/MiniKline.vue';
export default { name:'HomePage', components:{MiniKline}, data:()=>({coins:[],newsList:[],banners:[{text:'Invest in newly issued tokens','cta':'Start your ICO journey',link:'/earn'},{text:'Borrow with peace of mind','cta':'Click to view',link:'/earn'}]}), methods:{ci,async fetch(){try{const r=await pageHome();if(r.code===200)this.coins=(r.content||[]).map(c=>({...c,iconUrl:ci(c.fromSymbol||c.coinName),isUp:parseFloat(c.rate||0)>=0}))}catch(e){}try{const r=await getStockList();if(r.code===200)this.newsList=(r.content||[]).slice(0,10)}catch(e){}},onWs(msg){if(msg.type!=='1004')return;const s=(msg.symbol||'').replace('USDT',''),d=msg.optionMakerResponse||{},i=this.coins.findIndex(c=>c.fromSymbol===s);if(i>=0){const c={...this.coins[i]};if(d.lastPrice)c.lastPrice=d.lastPrice;if(d.priceChangePercent!==undefined){c.rate=parseFloat(d.priceChangePercent).toFixed(2);c.isUp=+d.priceChangePercent>=0;c.rate=c.isUp?'+'+c.rate:c.rate}this.$set(this.coins,i,c)}}},created(){this.fetch();this._t=setInterval(()=>this.fetch(),8000)},mounted(){connect(this.onWs)},beforeDestroy(){clearInterval(this._t)}};
</script>

<style scoped>
.mobileIndex{min-height:100vh;font-size:8.307px;font-weight:400}

/* 1. Hero y=44-329, 285px */
.mobileIndex-title{padding:32px 16px 16px;text-align:center;background:linear-gradient(180deg,rgba(20,161,243,.06)0%,transparent 100%)}
.mobileIndex-title h6{font-size:34.32px;font-weight:700;color:#fff;line-height:1.5;padding-bottom:16px}
.introduceContent{font-size:14px;color:rgba(255,255,255,.4)}
.coin-animation{position:relative;height:156px;margin-top:20px}
.ca{position:absolute;border-radius:50%}
.c1{width:55px;height:55px;right:30px;top:20px;background:linear-gradient(135deg,#14a1f3,#03ddfe);animation:pulse 2.5s ease infinite}
.c2{width:20px;height:20px;left:40px;top:100px;border:2px solid rgba(255,255,255,.15);animation:float 3s ease .5s infinite}
.c3{width:16px;height:16px;right:80px;top:110px;border:2px solid rgba(255,255,255,.1);animation:float 2.8s ease 1s infinite}
.c4{width:12px;height:12px;left:120px;top:30px;border:2px solid rgba(255,255,255,.08);animation:float 3.2s ease 1.5s infinite}
@keyframes pulse{0%,100%{transform:scale(1);opacity:.8}50%{transform:scale(1.15);opacity:.4}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}

/* Section headers: y=345, y=611, y=1679, y=2166, y=2307 */
.popularStocks-header{display:flex;justify-content:space-between;align-items:center;padding:16px 16px 12px}
.popularStocks-header span:first-child{font-size:20.787px;font-weight:700;color:#fff}
.popularStocks-header .more{font-size:14px;color:#999}

/* 2. Fast Plate y=392-549 */
.common-functions2{display:grid;grid-template-columns:1fr 1fr;gap:11px;padding:0 16px}
.common-functions{display:grid;grid-template-columns:1fr 1fr;gap:11px;padding:0 16px;margin-top:8px;margin-bottom:16px}
.common-functions .item{flex-direction:row;justify-content:center;gap:8px}
.item{display:flex;flex-direction:column;align-items:center;gap:8px;padding:16px;background:#32353c;border-radius:8px;border:1px solid #31353d;cursor:pointer}
.item i{font-size:27px;color:#14a1f3;font-style:normal}
.item span{font-size:13.533px;color:rgb(196,196,196)}

/* 3. Market Index y=611-1050 */
.marketIndex-header{padding:16px}
.marketIndex-list{list-style:none;padding:0 16px}
.marketIndex-list li{display:flex;align-items:center;gap:12px;padding:10px 12px;background:#32353c;border-radius:6px;border:1px solid #31353d;margin-bottom:6px;cursor:pointer;animation:rowIn .35s ease both}
@keyframes rowIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
.mi-l{display:flex;align-items:center;gap:8px;flex:1}
.mi-icon{width:26px;height:26px;border-radius:50%}
.mi-sym{font-size:15px;font-weight:600;display:block;color:#fff}
.mi-pair{font-size:11px;color:#999;display:block}
.mi-pr{font-size:14px;font-family:var(--font-mono)}
.mi-ch{font-size:12px;font-weight:600;min-width:56px;text-align:right}
.up{color:#b9f82d}.down{color:#ff4d4f}

/* 4. Index Tabs y=1097-1632 */
.index-tabs{margin:16px}
.banner-box{border-radius:8px;overflow:hidden}
.banner-swipe{padding:24px 20px;background:linear-gradient(135deg,rgba(20,161,243,.08),rgba(3,221,254,.04));border-radius:8px;border:1px solid rgba(20,161,243,.15)}
.banner-swipe p{font-size:14px;color:rgb(196,196,196);margin-bottom:12px}
.swiper-tag{font-size:14.547px;color:#14a1f3;font-weight:700}

/* 5. ICO y=1679-2135 */
.coin-trade{padding:0 16px}
.trade-desc{font-size:16.653px;color:#fff;padding:0 16px 16px}
.home-goTrade{margin:0 16px;text-align:center}
.el-button.index-btn{display:inline-block;width:351px;height:46px;line-height:46px;text-align:center;background:#14a1f3;color:#fff;font-size:14.547px;font-weight:700;border-radius:8px;cursor:pointer}

/* 6. News y=2166-2276 */
.news-container{margin:16px}
.newsList-header{padding:16px}
.newsCastrate{padding:0 16px}
.news-item{display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:#32353c;border-radius:6px;border:1px solid #31353d;margin-bottom:4px;font-size:14px}
.news-item span:last-child{font-weight:600}

/* 7. Partners y=2307 */
.partners{margin-bottom:16px}
.partners .popularStocks-header{padding:16px}
</style>
