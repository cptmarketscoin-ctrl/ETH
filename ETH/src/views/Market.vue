<template>
<div class="market-page">
  <!-- Tabs -->
  <div class="m-tabs">
    <span class="m-tab active">Watchlist</span>
    <span class="m-tab">Crypto</span>
  </div>

  <!-- Title -->
  <div class="m-title">Select trading pair</div>

  <!-- Pairs Grid: 2 cols -->
  <div class="m-grid" v-if="coins.length">
    <div v-for="(c,i) in coins" :key="c.fromSymbol" class="m-card" :style="{animationDelay:i*.04+'s'}" @click="$router.push('/trade/'+c.fromSymbol)">
      <div class="mc-top">
        <img :src="c.iconUrl" class="mc-icon" @error="e=>e.target.style.display='none'"/>
        <div>
          <span class="mc-sym">{{c.fromSymbol}}</span>
          <span class="mc-full">{{c.fromSymbol}}</span>
        </div>
      </div>
      <MiniKline v-if="c.klineRespList" :data="c.klineRespList" :isUp="c.isUp" :w="100" :h="28"/>
      <div class="mc-bot">
        <span class="mc-pr">{{c.lastPrice}}</span>
        <span class="mc-ch" :class="c.isUp?'up':'down'">{{c.rate}}%</span>
      </div>
    </div>
  </div>

  <!-- Add your own -->
  <div class="m-add" @click="$router.push('/market')">
    <span>+</span> Add your own
  </div>
  <div style="height:80px"/>
</div>
</template>

<script>
import { pageHome, coinIcon as ci } from '../api'; import MiniKline from '../components/MiniKline.vue';
export default { name:'MarketPage', components:{MiniKline}, data:()=>({coins:[]}), methods:{ci,async fetch(){try{const r=await pageHome();if(r.code===200)this.coins=(r.content||[]).map(c=>({...c,iconUrl:ci(c.fromSymbol||c.coinName),isUp:parseFloat(c.rate||0)>=0}))}catch(e){}}}, created(){this.fetch()} };
</script>

<style scoped>
.market-page{padding:12px 16px 80px;min-height:100vh}
.m-tabs{display:flex;margin-bottom:16px;border-radius:8px;overflow:hidden;border:1px solid #31353d}
.m-tab{flex:1;text-align:center;padding:10px;font-size:15px;color:#999;background:#32353c;cursor:pointer}
.m-tab.active{background:#14a1f3;color:#fff}
.m-title{font-size:17px;font-weight:700;color:#fff;margin-bottom:14px}
.m-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.m-card{background:#32353c;border-radius:8px;padding:14px;border:1px solid #31353d;cursor:pointer;animation:cardIn .35s ease both}
@keyframes cardIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
.mc-top{display:flex;align-items:center;gap:8px;margin-bottom:8px}
.mc-icon{width:28px;height:28px;border-radius:50%}
.mc-sym{font-size:15px;font-weight:600;display:block;color:#fff}
.mc-full{font-size:11px;color:#999;display:block}
.mc-bot{display:flex;justify-content:space-between;margin-top:6px}
.mc-pr{font-size:14px;font-family:var(--font-mono)}
.mc-ch{font-size:12px;font-weight:600}
.up{color:#b9f82d}.down{color:#ff4d4f}
.m-add{text-align:center;padding:16px;margin-top:16px;background:#32353c;border-radius:8px;border:1px dashed #31353d;color:#999;font-size:15px;cursor:pointer}
</style>
