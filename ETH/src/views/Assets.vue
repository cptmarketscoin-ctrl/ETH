<template>
<div style="padding:12px 16px 80px;min-height:100vh">
  <div style="background:#1c1c1e;border-radius:8px;padding:16px;margin-bottom:12px;border:1px solid #31353d">
    <span style="font-size:13px;color:rgb(196,196,196)">Total Value (USDT)</span>
    <span style="font-size:28px;font-weight:700;color:#b9f82d;display:block;margin-top:4px">{{total}}</span>
  </div>
  <div ref="pie" style="height:220px;background:#1c1c1e;border-radius:8px;margin-bottom:12px;border:1px solid #31353d"></div>
  <div v-for="b in balances" :key="b.coin" style="background:#1c1c1e;border-radius:8px;padding:12px 16px;margin-bottom:8px;border:1px solid #31353d;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px">
    <div style="display:flex;align-items:center;gap:8px;flex:1">
      <img :src="b.icon" style="width:28px;height:28px;border-radius:50%" @error="e=>e.target.style.display='none'"/>
      <div><span style="font-size:15px;font-weight:600;display:block;color:#fff">{{b.coin}}</span><span style="font-size:11px;color:#999">Wallet</span></div>
    </div>
    <div style="text-align:right">
      <span style="font-size:15px;font-weight:600;display:block">{{b.balance}}</span>
      <span style="font-size:12px;color:#999">≈ ${{b.usdtValue.toFixed(2)}}</span>
    </div>
    <div style="display:flex;gap:6px">
      <el-button size="mini" type="primary" plain @click="dep(b)">Deposit</el-button>
      <el-button size="mini" plain @click="wd(b)">Withdraw</el-button>
    </div>
  </div>
</div>
</template>

<script>
import { coinIcon as ci } from '../api';
let ec=null;try{ec=require('echarts')}catch(e){}
export default { name:'AssetsPage', data:()=>({balances:[],chart:null}), computed:{total(){return'$'+this.balances.reduce((s,b)=>s+(b.usdtValue||0),0).toFixed(2)}},
methods:{
  init(){const coins=['BTC','ETH','BNB','SOL','XRP','DOGE','ADA','AVAX','USDT'];const p={BTC:79300,ETH:2250,BNB:668,SOL:91,XRP:1.42,DOGE:.11,ADA:.26,AVAX:9.7,USDT:1};const b={BTC:1.5,ETH:10,BNB:50,SOL:200,XRP:10000,DOGE:50000,ADA:30000,AVAX:500,USDT:100000};this.balances=coins.map(c=>({coin:c,balance:b[c]||0,price:p[c]||0,usdtValue:(b[c]||0)*(p[c]||0),icon:ci(c)}));this.$nextTick(()=>this.rp())},
  rp(){if(!ec||!this.$refs.pie||!this.balances.length)return;if(!this.chart)this.chart=ec.init(this.$refs.pie);this.chart.setOption({series:[{type:'pie',radius:['55%','80%'],data:this.balances.filter(b=>b.usdtValue>0).map(b=>({name:b.coin,value:b.usdtValue})),label:{formatter:'{b}\n{d}%'},itemStyle:{borderRadius:4}}]},true)},
  dep(b){this.$message.info('Deposit address for '+b.coin)},
  wd(b){this.$message.info('Withdraw '+b.coin)}
}, created(){this.init()} };
</script>
