<template>
  <div class="market-page">
    <header class="m-header">
      <h2>Markets</h2>
      <el-input v-model="search" placeholder="Search" prefix-icon="el-icon-search" size="small" class="m-search" clearable />
    </header>

    <div class="m-tabs">
      <span v-for="t in tabs" :key="t" class="m-tab" :class="{on:active===t}" @click="active=t">{{t}}</span>
    </div>

    <div class="m-table-hdr">
      <span class="th th-star" @click="sort('fav')"><i :class="sk==='fav'?'el-icon-star-on':'el-icon-star-off'" :style="{color:sk==='fav'?'var(--up)':'var(--text-4)'}" /></span>
      <span class="th th-name" @click="sort('name')">Name <i v-if="sk==='name'" :class="sa?'el-icon-caret-top':'el-icon-caret-bottom'" /></span>
      <span class="th th-price" @click="sort('price')">Price <i v-if="sk==='price'" :class="sa?'el-icon-caret-top':'el-icon-caret-bottom'" /></span>
      <span class="th th-change" @click="sort('change')">24h <i v-if="sk==='change'" :class="sa?'el-icon-caret-top':'el-icon-caret-bottom'" /></span>
    </div>

    <transition-group name="row" tag="div" class="m-rows" v-if="coins.length">
      <div v-for="(c,i) in sorted" :key="c.fromSymbol" class="m-row" :style="{animationDelay:i*.03+'s'}">
        <span class="td td-star" @click.stop="fav(c.fromSymbol)"><i :class="isFav(c.fromSymbol)?'el-icon-star-on':'el-icon-star-off'" :style="{color:isFav(c.fromSymbol)?'var(--up)':'var(--text-4)'}" /></span>
        <span class="td td-name" @click="$router.push('/trade/'+c.fromSymbol)">
          <img :src="c.iconUrl" class="r-icon" @error="e=>e.target.style.display='none'" />
          <span class="r-sym">{{c.fromSymbol}}<small>/USDT</small></span>
        </span>
        <span class="td td-price">{{c.lastPrice}}</span>
        <span class="td td-change" :class="c.isUp?'up':'down'">{{c.rate}}%</span>
      </div>
    </transition-group>

    <div class="m-rows" v-else>
      <div v-for="i in 12" :key="i" class="m-row skel"><div class="skel-ln" /></div>
    </div>
  </div>
</template>

<script>
import { pageHome, coinIcon as cnIcon } from '../api';
import { connect } from '../api/ws';

export default {
  name: 'MarketPage',
  data: () => ({
    search:'', sk:'volume', sa:false, active:'All',
    tabs:['All','Main','DeFi','Layer 2','Meme'],
    coins:[], favs:JSON.parse(localStorage.getItem('cpt_favs')||'[]')
  }),
  computed: {
    filtered(){ return this.search?this.coins.filter(c=>c.fromSymbol.toUpperCase().includes(this.search.toUpperCase())):this.coins; },
    sorted(){
      let a=[...this.filtered];
      if(this.sk==='fav') return a.sort((x,y)=>(this.favs.includes(x.fromSymbol)?0:1)-(this.favs.includes(y.fromSymbol)?0:1));
      return a.sort((x,y)=>{
        let vx,vy;
        switch(this.sk){case'name':vx=x.fromSymbol;vy=y.fromSymbol;break;case'price':vx=parseFloat(x.lastPrice||0);vy=parseFloat(y.lastPrice||0);break;case'change':vx=parseFloat(x.rate||0);vy=parseFloat(y.rate||0);break;case'volume':vx=x.twentyFourHrResp?.volume||0;vy=y.twentyFourHrResp?.volume||0;break;default:return 0;}
        return this.sa?(vx<vy?-1:vx>vy?1:0):(vx<vy?1:vx>vy?-1:0);
      });
    }
  },
  methods: {
    cnIcon, isFav(s){return this.favs.includes(s);},
    fav(s){const i=this.favs.indexOf(s);i>=0?this.favs.splice(i,1):this.favs.push(s);localStorage.setItem('cpt_favs',JSON.stringify(this.favs));},
    sort(k){if(this.sk===k)this.sa=!this.sa;else{this.sk=k;this.sa=false;}},
    async fetch(){try{const r=await pageHome();if(r.code===200)this.coins=(r.content||[]).map(c=>({...c,iconUrl:cnIcon(c.fromSymbol||c.coinName),isUp:parseFloat(c.rate||0)>=0}));}catch(e){}},
    onWs(msg){if(msg.type!=='1004')return;const s=(msg.symbol||'').replace('USDT',''),d=msg.optionMakerResponse||{};const i=this.coins.findIndex(c=>c.fromSymbol===s);if(i>=0){const c={...this.coins[i]};if(d.lastPrice)c.lastPrice=d.lastPrice;if(d.priceChangePercent!==undefined){c.rate=parseFloat(d.priceChangePercent).toFixed(2);c.isUp=parseFloat(d.priceChangePercent)>=0;c.rate=c.isUp?'+'+c.rate:c.rate;}this.$set(this.coins,i,c);}}
  },
  created(){this.fetch();},
  mounted(){connect(this.onWs);}
};
</script>

<style scoped>
.market-page { padding: .133rem .16rem .8rem; min-height:100vh; }

.m-header { display:flex; justify-content:space-between; align-items:center; padding: .08rem 0 .133rem; }
.m-header h2 { font-size: .213rem; font-weight:700; }
.m-search { width: 1.6rem; }

.m-tabs { display:flex; gap:.08rem; margin-bottom:.133rem; overflow-x:auto; }
.m-tab { padding: .053rem .133rem; border-radius:.267rem; font-size:.133rem; color:var(--text-3); cursor:pointer; white-space:nowrap; background:var(--bg-white); border:1px solid var(--border-1); }
.m-tab.on { background:var(--primary); color:#fff; border-color:var(--primary); }

.m-table-hdr { display:flex; align-items:center; padding: .107rem .133rem; font-size:.133rem; color:var(--text-4); background:var(--bg-white); border-radius:.107rem .107rem 0 0; border:1px solid var(--border-1); border-bottom:none; }
.th { cursor:pointer; display:flex; align-items:center; gap:.027rem; }
.th-star { flex:0 0 .267rem; justify-content:center; font-size:.16rem; }
.th-name { flex:2; padding-left:.053rem; }
.th-price { flex:1.5; justify-content:flex-end; }
.th-change { flex:1; justify-content:flex-end; }

.m-rows { border:1px solid var(--border-1); border-top:none; border-radius:0 0 .107rem .107rem; background:var(--bg-white); overflow:hidden; }
.m-row { display:flex; align-items:center; padding:.107rem .133rem; border-bottom:1px solid var(--border-2); cursor:pointer; animation:rowIn .35s ease both; transition:background .15s; }
.m-row:hover { background:var(--bg-hover); }
.m-row:last-child { border-bottom:none; }
@keyframes rowIn { from{opacity:0;transform:translateY(.08rem)} to{opacity:1;transform:translateY(0)} }

.td { display:flex; align-items:center; }
.td-star { flex:0 0 .267rem; justify-content:center; font-size:.16rem; }
.td-name { flex:2; gap:.08rem; padding-left:.053rem; }
.td-price { flex:1.5; justify-content:flex-end; font-family:var(--font-mono); font-size:.16rem; font-weight:600; }
.td-change { flex:1; justify-content:flex-end; font-size:.147rem; font-weight:600; }
.up { color:var(--up); } .down { color:var(--down); }

.r-icon { width:.267rem; height:.267rem; border-radius:50%; }
.r-sym { font-size:.16rem; font-weight:600; }
.r-sym small { font-size:.12rem; color:var(--text-4); margin-left:.04rem; }

.skel { animation:none; } .skel-ln { height:.16rem; background:var(--border-2); border-radius:.027rem; width:70%; }

@media(max-width:640px){.th-price,.td-price{display:none}.th-name{flex:3}.td-name{flex:3}}
</style>
