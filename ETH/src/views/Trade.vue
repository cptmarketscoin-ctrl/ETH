<template>
  <div class="trade-page">
    <!-- Pair Selector + Price -->
    <div class="t-header">
      <el-select v-model="pair" size="small" class="t-pair">
        <el-option v-for="p in pairs" :key="p" :label="p" :value="p" />
      </el-select>
      <span class="t-live-price" :class="priceUp ? 'up' : 'down'">{{ currentPrice }}</span>
    </div>

    <!-- Kline -->
    <div ref="kline" class="t-kline"></div>

    <!-- Buy/Sell Panel -->
    <div class="t-panel">
      <div class="t-tabs">
        <span :class="{on:side==='buy'}" @click="side='buy'">Buy</span>
        <span :class="{on:side==='sell'}" @click="side='sell'">Sell</span>
      </div>
      <div class="t-form">
        <div class="t-row"><label>Price (USDT)</label><el-input-number v-model="price" :min="0" :precision="2" size="small" controls-position="right" class="t-inp" /></div>
        <div class="t-row"><label>Amount</label><el-input-number v-model="amount" :min="0" :precision="4" size="small" controls-position="right" class="t-inp" /></div>
        <div class="t-row"><label>Total</label><span class="t-total">{{ (price*(amount||0)).toFixed(2) }} USDT</span></div>
        <el-button :type="side==='buy'?'success':'danger'" class="t-submit" @click="doOrder" :loading="loading">
          {{ side==='buy'?'Buy':'Sell' }} {{ coin }}
        </el-button>
      </div>
    </div>

    <!-- Order Book -->
    <div class="t-book">
      <h4>Order Book</h4>
      <div class="t-book-cols">
        <div class="t-book-side">
          <div v-for="(r,i) in asks" :key="'a'+i" class="t-book-row"><span class="down">{{r.price}}</span><span>{{r.amount}}</span></div>
        </div>
        <div class="t-book-mid up">{{currentPrice}}</div>
        <div class="t-book-side">
          <div v-for="(r,i) in bids" :key="'b'+i" class="t-book-row"><span class="up">{{r.price}}</span><span>{{r.amount}}</span></div>
        </div>
      </div>
    </div>

    <!-- Orders -->
    <div class="t-orders">
      <h4>Open Orders</h4>
      <el-table :data="orders" size="small" empty-text="No orders">
        <el-table-column label="Side" width="50"><template #default="{row}"><span :class="row.side==='buy'?'up':'down'">{{row.side==='buy'?'Buy':'Sell'}}</span></template></el-table-column>
        <el-table-column prop="price" label="Price" />
        <el-table-column prop="amount" label="Amount" />
        <el-table-column prop="total" label="Total" />
        <el-table-column label="Action" width="60"><template #default="{row}"><el-button type="text" size="mini" @click="cancel(row.id)">Cancel</el-button></template></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { pageHome, orderBook, placeOrder, cancelOrder as apiCancel, currentOrders } from '../api';
import { connect } from '../api/ws';
let ec=null;try{ec=require('echarts')}catch(e){}

export default {
  name:'TradePage',
  data:()=>({pair:'BTCUSDT',pairs:['BTCUSDT','ETHUSDT','BNBUSDT','SOLUSDT','XRPUSDT','DOGEUSDT','ADAUSDT','AVAXUSDT'],side:'buy',price:0,amount:0,loading:false,currentPrice:'0.00',priceUp:true,asks:[],bids:[],orders:[],chart:null}),
  computed:{coin(){return this.pair.replace('USDT','')}},
  watch:{pair(){this.fetchAll();this.$nextTick(()=>this.renderKline())}},
  methods:{
    async fetchAll(){try{const r=await orderBook(this.pair);if(r.code===200&&r.data){this.asks=r.data.asks||[];this.bids=r.data.bids||[];}const o=await currentOrders(this.pair);if(o.code===200)this.orders=(o.data&&o.data.content)||[];}catch(e){}this.genBook()},
    genBook(){const b=parseFloat(this.currentPrice)||100;this.asks=[];this.bids=[];for(let i=1;i<=8;i++){this.asks.push({price:(b*(1+i*.0005)).toFixed(2),amount:(Math.random()*2).toFixed(4)});this.bids.push({price:(b*(1-i*.0005)).toFixed(2),amount:(Math.random()*2).toFixed(4)})}},
    renderKline(){if(!ec||!this.$refs.kline)return;if(!this.chart)this.chart=ec.init(this.$refs.kline);const b=parseFloat(this.currentPrice)||80000,ds=[],vs=[];for(let i=30;i>=0;i--){const t=new Date(Date.now()-i*36e5);ds.push(t.getHours()+':'+String(t.getMinutes()).padStart(2,'0'));const o=b*(1+(Math.random()-.5)*.02),c=o*(1+(Math.random()-.5)*.015);vs.push([o,Math.max(o,c)*(1+Math.random()*.005),Math.min(o,c)*(1-Math.random()*.005),c])}
      this.chart.setOption({grid:{left:50,right:8,top:8,bottom:20},xAxis:{type:'category',data:ds,axisLabel:{fontSize:10,color:'#999'}},yAxis:{type:'value',scale:true,axisLabel:{fontSize:10,color:'#999'}},series:[{type:'candlestick',data:vs,itemStyle:{color:'#b9f82d',color0:'#ff4d4f',borderColor:'#b9f82d',borderColor0:'#ff4d4f'}}]},true)},
    async doOrder(){if(!this.amount)return this.$message.warning('Enter amount');this.loading=true;try{const r=await placeOrder({symbol:this.pair,side:this.side,price:this.price||parseFloat(this.currentPrice),amount:this.amount});if(r.code===200){this.$message.success('Order filled');this.fetchAll()}else{this.$message.error(r.msg||'Failed')}}catch(e){this.$message.error(e.message)}this.loading=false},
    async cancel(id){await apiCancel({orderId:id});this.orders=this.orders.filter(o=>o.id!==id)},
    onWs(msg){if(msg.type==='1004'){const d=msg.optionMakerResponse||{};if(msg.symbol===this.pair){this.currentPrice=d.lastPrice||this.currentPrice;this.priceUp=parseFloat(d.rate||0)>=0}}if(msg.type==='1005'&&msg.symbol===this.pair){this.asks=msg.asks||[];this.bids=msg.bids||[]}}
  },
  created(){pageHome().then(r=>{if(r.code===200){(r.content||[]).forEach(c=>{if((c.fromSymbol+'USDT')===this.pair)this.currentPrice=c.lastPrice||'0.00'})}});this.fetchAll()},
  mounted(){connect(this.onWs);this.$nextTick(()=>this.renderKline())},
  beforeDestroy(){if(this.chart)this.chart.dispose()}
};
</script>

<style scoped>
.trade-page{max-width:800px;margin:0 auto;padding:.133rem .16rem .8rem}
.t-header{display:flex;align-items:center;gap:.133rem;margin-bottom:.133rem}
.t-pair{width:1.2rem}
.t-live-price{font-size:.267rem;font-weight:700;font-family:var(--font-mono)}
.up{color:var(--up)}.down{color:var(--down)}

.t-kline{height:3.2rem;background:var(--bg-white);border-radius:.107rem;margin-bottom:.133rem;border:1px solid var(--border-1)}

.t-panel{background:var(--bg-white);border-radius:.107rem;padding:.16rem;margin-bottom:.133rem;border:1px solid var(--border-1)}
.t-tabs{display:flex;margin-bottom:.133rem}
.t-tabs span{flex:1;text-align:center;padding:.08rem;cursor:pointer;border-radius:.067rem;font-size:.173rem;font-weight:600}
.t-tabs span.on{background:var(--bg-card)}
.t-tabs span:first-child.on{color:var(--up)}
.t-tabs span:last-child.on{color:var(--down)}
.t-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:.107rem}
.t-row label{font-size:.147rem;color:var(--text-2)}
.t-inp{width:1.6rem}
.t-total{font-size:.173rem;font-weight:600}
.t-submit{width:100%;margin-top:.133rem}

.t-book{background:var(--bg-white);border-radius:.107rem;padding:.16rem;margin-bottom:.133rem;border:1px solid var(--border-1)}
.t-book h4{margin-bottom:.107rem;font-size:.173rem}
.t-book-cols{display:flex}
.t-book-side{flex:1}
.t-book-mid{display:flex;align-items:center;padding:0 .107rem;font-size:.2rem;font-weight:700;font-family:var(--font-mono)}
.t-book-row{display:flex;justify-content:space-between;padding:.013rem 0;font-size:.133rem;font-family:var(--font-mono)}
.t-book-row span:last-child{color:var(--text-3)}

.t-orders{background:var(--bg-white);border-radius:.107rem;padding:.16rem;border:1px solid var(--border-1)}
.t-orders h4{margin-bottom:.107rem;font-size:.173rem}
</style>
