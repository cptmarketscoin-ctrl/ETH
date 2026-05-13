<template>
<div class="marketIndex" style="padding:12px 16px;min-height:100vh">
  <div class="m-tabs"><span class="m-tab active">Watchlist</span><span class="m-tab">Crypto</span></div>
  <div class="m-title">Select trading pair</div>
  <div class="m-grid" v-if="coins.length">
    <div v-for="(c,i) in coins" :key="c.fromSymbol" class="m-item" :style="{animationDelay:i*.04+'s'}" @click="$router.push('/trade/'+c.fromSymbol)">
      <div class="mi-top"><img :src="c.iconUrl" class="mi-icon" @error="e=>e.target.style.display='none'"/><div><span class="mi-sym">{{c.fromSymbol}}</span><span class="mi-full">{{c.fromSymbol}}</span></div></div>
      <MiniKline v-if="c.klineRespList" :data="c.klineRespList" :isUp="c.isUp" :w="100" :h="28"/>
      <div class="mi-bot"><span class="mi-pr">{{c.lastPrice}}</span><span class="mi-ch" :class="c.isUp?'up':'down'">{{c.rate}}%</span></div>
    </div>
  </div>
  <div class="m-add">+ Add your own</div>
  <div style="height:60px"/>
</div>
</template>

<script>
import { pageHome, coinIcon as ci } from '../api'; import MiniKline from '../components/MiniKline.vue';
export default { name:'MarketPage', components:{MiniKline}, data:()=>({coins:[]}), methods:{ci,async fetch(){try{const r=await pageHome();if(r.code===200)this.coins=(r.content||[]).map(c=>({...c,iconUrl:ci(c.fromSymbol||c.coinName),isUp:parseFloat(c.rate||0)>=0}))}catch(e){}}}, created(){this.fetch()} };
</script>

<style scoped>
.m-tabs{display:flex;margin-bottom:14px;border-radius:8px;overflow:hidden;border:1px solid #31353d}
.m-tab{flex:1;text-align:center;padding:10px;font-size:15px;color:#999;background:#1c1c1e;cursor:pointer}
.m-tab.active{background:#14a1f3;color:#fff}
.m-title{font-size:17px;font-weight:700;color:#fff;margin-bottom:12px}
.m-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.m-item{background:#1c1c1e;border-radius:8px;padding:14px;border:1px solid #31353d;cursor:pointer;animation:cardIn .35s ease both}
@keyframes cardIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
.mi-top{display:flex;align-items:center;gap:8px;margin-bottom:8px}
.mi-icon{width:28px;height:28px;border-radius:50%}
.mi-sym{font-size:15px;font-weight:600;display:block;color:#fff}
.mi-full{font-size:11px;color:#999;display:block}
.mi-bot{display:flex;justify-content:space-between;margin-top:6px}
.mi-pr{font-size:14px;font-family:monospace}
.mi-ch{font-size:12px;font-weight:600}
.up{color:#b9f82d}.down{color:#ff4d4f}
.m-add{text-align:center;padding:16px;margin-top:16px;background:#1c1c1e;border-radius:8px;border:1px dashed #31353d;color:#999;font-size:15px;cursor:pointer}
</style>
