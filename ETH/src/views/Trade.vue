<template>
  <div class="trade-page">
    <!-- Pair + Sub Tabs -->
    <div class="t-pair-bar">
      <span class="t-pair-name">{{pair}}</span>
      <div class="t-sub-tabs">
        <span :class="{on:subTab==='spot'}" @click="subTab='spot'">Spot</span>
        <span :class="{on:subTab==='contract'}" @click="subTab='contract'">Contract</span>
        <span :class="{on:subTab==='option'}" @click="subTab='option'">Option</span>
      </div>
    </div>

    <!-- Kline -->
    <div ref="kline" class="t-kline"></div>

    <!-- Price display -->
    <div class="t-price-display">
      <span class="t-big-price" :class="priceUp ? 'up' : 'down'">{{currentPrice}}</span>
      <span class="t-change" :class="priceUp ? 'up' : 'down'">{{priceChange}}%</span>
    </div>

    <!-- Buy/Sell buttons -->
    <div class="t-bs-bar">
      <span class="t-buy-btn" :class="{active:side==='buy'}" @click="side='buy';showPanel=true">Buy</span>
      <span class="t-sell-btn" :class="{active:side==='sell'}" @click="side='sell';showPanel=true">Sell</span>
    </div>

    <!-- Order Panel -->
    <div class="t-order-panel" v-if="showPanel">
      <div class="t-op-row">
        <label>Price($)</label>
        <el-input-number v-model="price" :min="0" :precision="2" size="small" controls-position="right" class="t-inp" />
      </div>
      <div class="t-op-row">
        <label>Amount</label>
        <el-input-number v-model="amount" :min="0" :precision="4" size="small" controls-position="right" class="t-inp" />
      </div>
      <div class="t-op-row"><label>Total</label><span>{{(price*amount||0).toFixed(2)}} USDT</span></div>
      <div class="t-op-btns">
        <span class="t-cancel" @click="showPanel=false">Cancel</span>
        <el-button :type="side==='buy'?'success':'danger'" size="small" class="t-confirm" @click="doOrder" :loading="loading">{{side==='buy'?'Buy':'Sell'}}</el-button>
      </div>
    </div>

    <!-- Order Book -->
    <div class="t-book">
      <div class="t-book-hd">
        <span>Price($)</span>
        <span>Amount</span>
        <span>Total</span>
      </div>
      <div class="t-book-asks">
        <div v-for="(r,i) in asks" :key="'a'+i" class="t-book-row">
          <span class="down">{{r.price}}</span>
          <span>{{r.amount}}</span>
          <span>{{(r.price*r.amount).toFixed(2)}}</span>
        </div>
      </div>
      <div class="t-book-spread">
        <span class="up">{{currentPrice}}</span>
      </div>
      <div class="t-book-bids">
        <div v-for="(r,i) in bids" :key="'b'+i" class="t-book-row">
          <span class="up">{{r.price}}</span>
          <span>{{r.amount}}</span>
          <span>{{(r.price*r.amount).toFixed(2)}}</span>
        </div>
      </div>
    </div>

    <div style="height:80px"></div>
  </div>
</template>

<script>
import { pageHome, orderBook, placeOrder } from '../api';
import { connect } from '../api/ws';
let ec=null;try{ec=require('echarts')}catch(e){}

export default {
  name:'TradePage',
  data:()=>({
    pair:'BTC/USDT', showPanel:false, side:'buy', subTab:'spot',
    price:0, amount:0, loading:false,
    currentPrice:'0.00', priceUp:true, priceChange:'-1.32',
    asks:[], bids:[], chart:null
  }),
  computed:{coin(){return this.pair.split('/')[0]}},
  watch:{pair(){this.fetchData();this.$nextTick(()=>this.renderKline())}},
  methods:{
    genBook(){
      const b=parseFloat(this.currentPrice)||80000;
      this.asks=[]; this.bids=[];
      for(let i=1;i<=8;i++){
        this.asks.push({price:(b*(1+i*.0004)).toFixed(2),amount:(Math.random()*2).toFixed(4)});
        this.bids.push({price:(b*(1-i*.0004)).toFixed(2),amount:(Math.random()*2).toFixed(4)});
      }
    },
    renderKline(){
      if(!ec||!this.$refs.kline)return;
      if(!this.chart)this.chart=ec.init(this.$refs.kline);
      const b=parseFloat(this.currentPrice)||80000,ds=[],vs=[];
      for(let i=30;i>=0;i--){const t=new Date(Date.now()-i*36e5);ds.push(t.getHours()+':'+String(t.getMinutes()).padStart(2,'0'));const o=b*(1+(Math.random()-.5)*.02),c=o*(1+(Math.random()-.5)*.015);vs.push([o,Math.max(o,c)*(1+Math.random()*.005),Math.min(o,c)*(1-Math.random()*.005),c])}
      this.chart.setOption({grid:{left:50,right:8,top:8,bottom:20},xAxis:{type:'category',data:ds,axisLabel:{fontSize:10,color:'#999'}},yAxis:{type:'value',scale:true,axisLabel:{fontSize:10,color:'#999'}},series:[{type:'candlestick',data:vs,itemStyle:{color:'#b9f82d',color0:'#ff4d4f',borderColor:'#b9f82d',borderColor0:'#ff4d4f'}}]},true);
    },
    async fetchData(){
      try{const r=await orderBook(this.pair.replace('/',''));if(r.code===200&&r.data){this.asks=r.data.asks||[];this.bids=r.data.bids||[];}}catch(e){}this.genBook();
    },
    async doOrder(){
      if(!this.amount)return this.$message.warning('Enter amount');
      this.loading=true;
      try{const r=await placeOrder({symbol:this.pair.replace('/',''),side:this.side,price:this.price||parseFloat(this.currentPrice),amount:this.amount});if(r.code===200){this.$message.success('Order filled');this.showPanel=false}}catch(e){this.$message.error(e.message)}
      this.loading=false;
    },
    onWs(msg){
      if(msg.type==='1004'){const d=msg.optionMakerResponse||{};if((msg.symbol||'').replace('USDT','')===this.coin){this.currentPrice=d.lastPrice||this.currentPrice;this.priceUp=parseFloat(d.rate||0)>=0;this.priceChange=(parseFloat(d.priceChangePercent||0)||0).toFixed(2);this.genBook()}}
      if(msg.type==='1005'&&(msg.symbol||'').replace('USDT','')===this.coin){this.asks=msg.asks||[];this.bids=msg.bids||[]}
    }
  },
  created(){
    pageHome().then(r=>{if(r.code===200){(r.content||[]).forEach(c=>{if(c.fromSymbol===this.coin)this.currentPrice=c.lastPrice||'0.00'})}});
    this.fetchData();
  },
  mounted(){connect(this.onWs);this.$nextTick(()=>this.renderKline())},
  beforeDestroy(){if(this.chart)this.chart.dispose()}
};
</script>

<style scoped>
.trade-page { padding: .133rem .16rem .8rem; min-height: 100vh; }

.t-pair-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: .133rem; }
.t-pair-name { font-size: .24rem; font-weight: 700; }
.t-sub-tabs { display: flex; gap: .08rem; }
.t-sub-tabs span { font-size: .133rem; color: var(--text-3); padding: .04rem .107rem; border-radius: .053rem; cursor: pointer; }
.t-sub-tabs span.on { color: var(--primary); background: rgba(20,161,243,.1); }

.t-kline { height: 2.67rem; background: var(--bg-white); border-radius: .107rem; margin-bottom: .133rem; border: 1px solid var(--border-1); }

.t-price-display { display: flex; align-items: baseline; gap: .107rem; margin-bottom: .16rem; }
.t-big-price { font-size: .32rem; font-weight: 700; font-family: var(--font-mono); }
.t-change { font-size: .173rem; font-weight: 600; }

.t-bs-bar { display: flex; gap: .107rem; margin-bottom: .16rem; }
.t-buy-btn, .t-sell-btn { flex: 1; text-align: center; padding: .107rem; border-radius: .067rem; font-size: .173rem; font-weight: 600; cursor: pointer; }
.t-buy-btn { color: var(--up); border: 1px solid var(--up); }
.t-buy-btn.active { background: var(--up); color: #1b1c20; }
.t-sell-btn { color: var(--down); border: 1px solid var(--down); }
.t-sell-btn.active { background: var(--down); color: #fff; }

.t-order-panel { background: var(--bg-white); border-radius: .107rem; padding: .16rem; margin-bottom: .16rem; border: 1px solid var(--border-1); }
.t-op-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: .107rem; }
.t-op-row label { font-size: .147rem; color: var(--text-2); }
.t-inp { width: 1.6rem; }
.t-op-btns { display: flex; gap: .107rem; margin-top: .133rem; }
.t-cancel { flex: 1; text-align: center; padding: .08rem; border-radius: .067rem; border: 1px solid var(--border-1); font-size: .16rem; cursor: pointer; }
.t-confirm { flex: 1; }

.t-book { background: var(--bg-white); border-radius: .107rem; border: 1px solid var(--border-1); overflow: hidden; }
.t-book-hd { display: flex; justify-content: space-between; padding: .08rem .133rem; font-size: .12rem; color: var(--text-4); border-bottom: 1px solid var(--border-1); }
.t-book-hd span { flex: 1; }
.t-book-row { display: flex; justify-content: space-between; padding: .04rem .133rem; font-size: .133rem; font-family: var(--font-mono); }
.t-book-row span { flex: 1; }
.t-book-row span:last-child { color: var(--text-3); }
.t-book-spread { text-align: center; padding: .08rem; font-size: .213rem; font-weight: 700; font-family: var(--font-mono); border-top: 1px solid var(--border-1); border-bottom: 1px solid var(--border-1); }

.up { color: var(--up); } .down { color: var(--down); }
</style>
