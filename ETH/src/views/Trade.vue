<template>
<div style="padding:12px 16px 80px;min-height:100vh">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
    <span style="font-size:22px;font-weight:700">BTC/USDT</span>
    <div style="display:flex;gap:6px"><span class="t-sub on">Spot</span><span class="t-sub">Contract</span><span class="t-sub">Option</span></div>
  </div>
  <div style="display:flex;align-items:baseline;gap:8px;margin-bottom:12px">
    <span class="t-big">{{currentPrice}}</span><span class="t-diff" :class="priceUp?'up':'down'">{{diff}}%</span>
  </div>
  <div ref="kline" class="t-kline"></div>
  <div class="t-bs-bar">
    <span :class="['t-bs',side==='buy'?'active-buy':'']" @click="side='buy';show=true">Buy</span>
    <span :class="['t-bs',side==='sell'?'active-sell':'']" @click="side='sell';show=true">Sell</span>
  </div>
  <div class="t-form" v-if="show">
    <div class="tf-row"><label>Price($)</label><el-input-number v-model="price" :min="0" :precision="2" size="small" class="tf-inp" controls-position="right"/></div>
    <div class="tf-row"><label>Amount</label><el-input-number v-model="amount" :min="0" :precision="4" size="small" class="tf-inp" controls-position="right"/></div>
    <div class="tf-row"><label>Total</label><span>{{((price||0)*(amount||0)).toFixed(2)}} USDT</span></div>
    <div class="tf-btns"><span @click="show=false" style="flex:1;text-align:center;padding:8px;border-radius:6px;border:1px solid #31353d;font-size:14px;color:#ccc;cursor:pointer">Cancel</span><el-button :type="side==='buy'?'success':'danger'" size="small" style="flex:1" @click="doOrder" :loading="loading">{{side==='buy'?'Buy':'Sell'}}</el-button></div>
  </div>
  <div class="t-book">
    <div class="tb-hd"><span>Price($)</span><span>Amount</span><span>Total</span></div>
    <div class="tb-asks"><div v-for="(r,i) in asks" :key="'a'+i" class="tb-row"><span class="down">{{r.price}}</span><span>{{r.amount}}</span><span>{{(r.price*r.amount).toFixed(2)}}</span></div></div>
    <div class="tb-spread"><span class="up">{{currentPrice}}</span></div>
    <div class="tb-bids"><div v-for="(r,i) in bids" :key="'b'+i" class="tb-row"><span class="up">{{r.price}}</span><span>{{r.amount}}</span><span>{{(r.price*r.amount).toFixed(2)}}</span></div></div>
  </div>
</div>
</template>

<script>
import { pageHome, orderBook, placeOrder } from '../api'; import { connect } from '../api/ws';
let ec=null;try{ec=require('echarts')}catch(e){}
export default { name:'TradePage', data:()=>({side:'buy',show:false,price:0,amount:0,loading:false,currentPrice:'0.00',priceUp:false,diff:'-1.18',asks:[],bids:[],chart:null}),
methods:{gb(){const b=parseFloat(this.currentPrice)||80000;this.asks=[];this.bids=[];for(let i=1;i<=8;i++){this.asks.push({price:(b*(1+i*.0004)).toFixed(2),amount:(Math.random()*2+.1).toFixed(4)});this.bids.push({price:(b*(1-i*.0004)).toFixed(2),amount:(Math.random()*2+.1).toFixed(4)})}},
rk(){if(!ec||!this.$refs.kline)return;if(!this.chart)this.chart=ec.init(this.$refs.kline);const b=parseFloat(this.currentPrice)||80000,ds=[],vs=[];for(let i=30;i>=0;i--){const t=new Date(Date.now()-i*36e5);ds.push(t.getHours()+':'+String(t.getMinutes()).padStart(2,'0'));const o=b*(1+(Math.random()-.5)*.02),c=o*(1+(Math.random()-.5)*.015);vs.push([o,Math.max(o,c)*(1+Math.random()*.005),Math.min(o,c)*(1-Math.random()*.005),c])}this.chart.setOption({grid:{left:50,right:8,top:8,bottom:20},xAxis:{type:'category',data:ds,axisLabel:{fontSize:10,color:'#999'}},yAxis:{type:'value',scale:true,axisLabel:{fontSize:10,color:'#999'}},series:[{type:'candlestick',data:vs,itemStyle:{color:'#b9f82d',color0:'#ff4d4f',borderColor:'#b9f82d',borderColor0:'#ff4d4f'}}]},true)},
async doOrder(){if(!this.amount)return this.$message.warning('Enter amount');this.loading=true;try{const r=await placeOrder({symbol:'BTCUSDT',side:this.side,price:this.price||parseFloat(this.currentPrice),amount:this.amount});if(r.code===200){this.$message.success('Order filled');this.show=false;this.gb()}}catch(e){this.$message.error(e.message)}this.loading=false},
onWs(msg){if(msg.type==='1004'){const d=msg.optionMakerResponse||{};if((msg.symbol||'')==='BTCUSDT'){this.currentPrice=d.lastPrice||this.currentPrice;this.priceUp=parseFloat(d.rate||0)>=0;this.diff=((parseFloat(d.priceChangePercent||0)||0)).toFixed(2);this.gb();this.rk()}}if(msg.type==='1005'&&(msg.symbol||'')==='BTCUSDT'){this.asks=msg.asks||[];this.bids=msg.bids||[]}}},
created(){pageHome().then(r=>{if(r.code===200){const btc=(r.content||[]).find(c=>c.fromSymbol==='BTC');if(btc)this.currentPrice=btc.lastPrice||'0.00'}});this.gb()},
mounted(){connect(this.onWs);this.$nextTick(()=>this.rk())}, beforeDestroy(){if(this.chart)this.chart.dispose()}};
</script>

<style scoped>
.t-sub{font-size:12px;color:#999;padding:4px 10px;border-radius:4px;cursor:pointer}.t-sub.on{color:#14a1f3;background:rgba(20,161,243,.1)}
.t-big{font-size:28px;font-weight:700;font-family:monospace}
.t-diff{font-size:16px;font-weight:600}
.t-kline{height:240px;background:#1c1c1e;border-radius:8px;margin-bottom:12px;border:1px solid #31353d}
.t-bs-bar{display:flex;gap:10px;margin-bottom:12px}
.t-bs{flex:1;text-align:center;padding:10px;border-radius:6px;font-size:16px;font-weight:600;cursor:pointer;color:#b9f82d;border:1px solid #b9f82d}
.t-bs:last-child{color:#ff4d4f;border:1px solid #ff4d4f}
.active-buy{background:#b9f82d;color:#151517!important}
.active-sell{background:#ff4d4f;color:#fff!important}
.t-form{background:#1c1c1e;border-radius:8px;padding:16px;margin-bottom:12px;border:1px solid #31353d}
.tf-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
.tf-row label{font-size:14px;color:rgb(196,196,196);width:80px}
.tf-inp{flex:1}
.tf-btns{display:flex;gap:8px;margin-top:12px}
.t-book{background:#1c1c1e;border-radius:8px;border:1px solid #31353d;overflow:hidden}
.tb-hd{display:flex;justify-content:space-between;padding:8px 12px;font-size:11px;color:#999;border-bottom:1px solid #31353d}
.tb-hd span{flex:1}
.tb-row{display:flex;justify-content:space-between;padding:3px 12px;font-size:13px;font-family:monospace}
.tb-row span{flex:1}.tb-row span:last-child{color:#999}
.tb-spread{text-align:center;padding:8px;font-size:20px;font-weight:700;font-family:monospace;border-top:1px solid #31353d;border-bottom:1px solid #31353d}
.up{color:#b9f82d}.down{color:#ff4d4f}
</style>
