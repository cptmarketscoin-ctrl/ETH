<template>
<div class="mobileIndex">
  <!-- Hero -->
  <div class="mi-title">
    <h6>Trade like a pro</h6>
    <div class="coin-anim"><div class="ca-c c1"/><div class="ca-c c2"/><div class="ca-c c3"/></div>
  </div>

  <!-- Fast plate -->
  <div class="mi-sec-hd"><span>Fast plate</span></div>
  <div class="mi-func"><div class="mi-item" @click="$router.push('/assets')"><i>↑</i><span>Deposit</span></div><div class="mi-item" @click="$router.push('/assets')"><i>↓</i><span>Withdraw</span></div></div>
  <div class="mi-func"><div class="mi-item" @click="$router.push('/earn')"><i>◆</i><span>ICO</span></div><div class="mi-item" @click="$router.push('/earn')"><i>$</i><span>Loan</span></div></div>

  <!-- Popular -->
  <div class="mi-sec-hd"><span>Popular</span><span class="mi-more" @click="$router.push('/market')">More</span></div>
  <div class="mi-coins" v-if="coins.length">
    <div class="mi-coin" v-for="(c,i) in coins.slice(0,6)" :key="c.fromSymbol" :style="{animationDelay:i*.05+'s'}" @click="$router.push('/trade/'+c.fromSymbol)">
      <div class="mi-coin-l"><img :src="c.iconUrl" class="mi-cicon" @error="e=>e.target.style.display='none'"/><div><span class="mi-cn">{{c.fromSymbol}}</span><span class="mi-cp">/USDT</span></div></div>
      <div class="mi-coin-m"><MiniKline v-if="c.klineRespList" :data="c.klineRespList" :isUp="c.isUp" :w="72" :h="24"/></div>
      <div class="mi-coin-r"><span class="mi-cpr">{{c.lastPrice}}</span><span class="mi-cc" :class="c.isUp?'up':'down'">{{c.rate}}%</span></div>
    </div>
  </div>

  <!-- ICO Banner -->
  <div class="mi-ico" @click="$router.push('/earn')"><p>Invest in newly issued tokens and enjoy potentially high return opportunities</p><span class="mi-cta">Start your ICO journey</span></div>

  <!-- Loan -->
  <div class="mi-loan"><div class="mi-loan-hd"><i>$</i><span>Loan</span></div><div class="mi-loan-bd"><h3>Borrow with peace of mind</h3><p>Safe and flexible borrowing to improve fund utilization</p><span class="mi-cta" @click="$router.push('/earn')">Click to view</span></div></div>

  <!-- News -->
  <div class="mi-sec-hd"><span>News</span><span class="mi-more">More</span></div>
  <div class="mi-news"><div class="mi-news-r" v-for="(n,i) in newsList.slice(0,3)" :key="i"><span class="mi-nl">{{n.coinName}}</span><span class="mi-nr" :class="parseFloat(n.change24h)>=0?'up':'down'">{{n.change24h}}%</span></div></div>

  <div style="height:80px"/>
</div>
</template>

<script>
import { pageHome, getStockList, coinIcon as ci } from '../api'; import { connect } from '../api/ws'; import MiniKline from '../components/MiniKline.vue';
export default { name:'HomePage', components:{MiniKline}, data:()=>({coins:[],newsList:[]}), methods:{ci,async fetch(){try{const r=await pageHome();if(r.code===200)this.coins=(r.content||[]).map(c=>({...c,iconUrl:ci(c.fromSymbol||c.coinName),isUp:parseFloat(c.rate||0)>=0}))}catch(e){}try{const r=await getStockList();if(r.code===200)this.newsList=(r.content||[]).slice(0,10)}catch(e){}},onWs(msg){if(msg.type!=='1004')return;const s=(msg.symbol||'').replace('USDT',''),d=msg.optionMakerResponse||{},i=this.coins.findIndex(c=>c.fromSymbol===s);if(i>=0){const c={...this.coins[i]};if(d.lastPrice)c.lastPrice=d.lastPrice;if(d.priceChangePercent!==undefined){c.rate=parseFloat(d.priceChangePercent).toFixed(2);c.isUp=+d.priceChangePercent>=0;c.rate=c.isUp?'+'+c.rate:c.rate}this.$set(this.coins,i,c)}}},created(){this.fetch();this._t=setInterval(()=>this.fetch(),8000)},mounted(){connect(this.onWs)},beforeDestroy(){clearInterval(this._t)}};
</script>

<style scoped>
.mobileIndex{min-height:100vh}
.mi-title{padding:32px 16px 16px;text-align:center;background:linear-gradient(180deg,rgba(20,161,243,.08)0%,transparent 100%)}
.mi-title h6{font-size:34.32px;font-weight:700;color:#fff;line-height:1.5;padding-bottom:16px}
.coin-anim{position:relative;height:120px}
.ca-c{position:absolute;border-radius:50%}
.c1{width:24px;height:24px;left:50%;top:40%;background:linear-gradient(135deg,#14a1f3,#03ddfe);animation:pulse 2.5s ease infinite}
.c2{width:18px;height:18px;left:30%;top:50%;border:2px solid rgba(255,255,255,.15);animation:float 3s ease .5s infinite}
.c3{width:14px;height:14px;right:25%;top:35%;border:2px solid rgba(255,255,255,.1);animation:float 3.5s ease 1s infinite}
@keyframes pulse{0%,100%{transform:translate(-50%,-50%)scale(1);opacity:.8}50%{transform:translate(-50%,-50%)scale(1.2);opacity:.4}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}

.mi-sec-hd{display:flex;justify-content:space-between;align-items:center;padding:16px 16px 12px}
.mi-sec-hd span:first-child{font-size:20.787px;font-weight:700;color:#fff}
.mi-more{font-size:14px;color:#999;cursor:pointer}

.mi-func{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;padding:0 16px}
.mi-func+.mi-func{margin-top:8px;margin-bottom:16px}
.mi-item{display:flex;flex-direction:column;align-items:center;gap:8px;padding:16px;background:var(--bg-card);border-radius:8px;border:1px solid var(--border);cursor:pointer}
.mi-item i{font-size:24px;color:var(--primary);font-style:normal}
.mi-item span{font-size:13.533px;color:rgb(196,196,196)}

.mi-coins{padding:0 16px;display:flex;flex-direction:column;gap:4px}
.mi-coin{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;background:var(--bg-card);border-radius:6px;border:1px solid var(--border);animation:rowIn .35s ease both;cursor:pointer}
@keyframes rowIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
.mi-coin-l{display:flex;align-items:center;gap:8px}
.mi-cicon{width:28px;height:28px;border-radius:50%}
.mi-cn{font-size:15px;font-weight:600;display:block;color:#fff}
.mi-cp{font-size:11px;color:#999}
.mi-cpr{font-size:14px;font-family:var(--font-mono);display:block;text-align:right}
.mi-cc{font-size:12px;display:block;text-align:right}
.up{color:var(--up)}.down{color:var(--down)}

.mi-ico{margin:20px 16px;padding:20px;background:linear-gradient(135deg,rgba(20,161,243,.08),rgba(3,221,254,.04));border-radius:8px;border:1px solid rgba(20,161,243,.15);text-align:center;cursor:pointer}
.mi-ico p{font-size:13px;color:rgb(196,196,196);margin-bottom:12px}
.mi-cta{font-size:15px;color:var(--primary);font-weight:600;cursor:pointer}

.mi-loan{margin:0 16px 20px;background:var(--bg-card);border-radius:8px;border:1px solid var(--border);overflow:hidden}
.mi-loan-hd{display:flex;align-items:center;gap:8px;padding:12px 16px;border-bottom:1px solid var(--border)}
.mi-loan-hd i{font-size:20px;color:var(--primary);font-style:normal}
.mi-loan-hd span{font-size:16.653px;font-weight:700;color:#fff}
.mi-loan-bd{padding:24px 20px;text-align:center}
.mi-loan-bd h3{font-size:18px;font-weight:700;color:#fff;margin-bottom:8px}
.mi-loan-bd p{font-size:13px;color:rgb(196,196,196);margin-bottom:16px}

.mi-news{padding:0 16px}
.mi-news-r{display:flex;justify-content:space-between;align-items:center;padding:10px 12px;background:var(--bg-card);border-radius:6px;border:1px solid var(--border);margin-bottom:4px;font-size:14px}
.mi-nr{font-weight:600}
</style>
