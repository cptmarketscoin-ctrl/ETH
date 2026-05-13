<template>
  <div class="assets-page">
    <header class="a-header"><h2>Assets</h2></header>

    <div class="a-total">
      <span class="a-label">Total Value (USDT)</span>
      <span class="a-value up">{{ totalVal }}</span>
    </div>

    <div class="a-pie" ref="pie"></div>

    <div class="a-list" v-if="balances.length">
      <div v-for="b in balances" :key="b.coin" class="a-row">
        <div class="a-left">
          <img :src="b.icon" class="a-icon" @error="e=>e.target.style.display='none'" />
          <div><span class="a-coin">{{b.coin}}</span><span class="a-sub">Wallet</span></div>
        </div>
        <div class="a-right">
          <span class="a-bal">{{b.balance}}</span>
          <span class="a-usd">≈ ${{b.usdtValue.toFixed(2)}}</span>
        </div>
        <div class="a-acts">
          <el-button size="mini" type="primary" plain @click="showDeposit(b)">Deposit</el-button>
          <el-button size="mini" plain @click="showWithdraw(b)">Withdraw</el-button>
        </div>
      </div>
    </div>

    <el-dialog :title="'Deposit '+depCoin" :visible.sync="depVis" width="360px">
      <p style="font-size:.147rem;color:var(--text-2);margin-bottom:.107rem">Send to this address:</p>
      <div style="background:var(--bg);padding:.107rem;border-radius:.067rem;word-break:break-all;font-size:.133rem">{{depAddr}}</div>
      <el-button size="mini" type="primary" style="margin-top:.107rem" @click="copy(depAddr)">Copy</el-button>
    </el-dialog>

    <el-dialog :title="'Withdraw '+wdCoin" :visible.sync="wdVis" width="360px">
      <el-input v-model="wdAddr" placeholder="Address" size="small" />
      <el-input v-model="wdAmt" placeholder="Amount" size="small" type="number" style="margin-top:.107rem" />
      <el-button type="primary" style="margin-top:.133rem;width:100%" @click="doWd">Confirm</el-button>
    </el-dialog>
  </div>
</template>

<script>
import { coinIcon as cnIcon } from '../api';
let ec=null;try{ec=require('echarts')}catch(e){}

export default {
  name:'AssetsPage',
  data:()=>({balances:[],depVis:false,depCoin:'',depAddr:'',wdVis:false,wdCoin:'',wdAddr:'',wdAmt:'',chart:null}),
  computed:{totalVal(){return'$'+this.balances.reduce((s,b)=>s+(b.usdtValue||0),0).toFixed(2)}},
  methods:{
    init(){
      const coins=['BTC','ETH','BNB','SOL','XRP','DOGE','ADA','AVAX','USDT'];
      const p={BTC:79300,ETH:2250,BNB:668,SOL:91,XRP:1.42,DOGE:.11,ADA:.26,AVAX:9.7,USDT:1};
      const b={BTC:1.5,ETH:10,BNB:50,SOL:200,XRP:10000,DOGE:50000,ADA:30000,AVAX:500,USDT:100000};
      this.balances=coins.map(c=>({coin:c,balance:b[c]||0,price:p[c]||0,usdtValue:(b[c]||0)*(p[c]||0),icon:cnIcon(c)}));
      this.$nextTick(()=>this.renderPie());
    },
    renderPie(){if(!ec||!this.$refs.pie||!this.balances.length)return;if(!this.chart)this.chart=ec.init(this.$refs.pie);this.chart.setOption({tooltip:{trigger:'item',formatter:'{b}: ${c}'},series:[{type:'pie',radius:['55%','80%'],center:['50%','50%'],data:this.balances.filter(b=>b.usdtValue>0).map(b=>({name:b.coin,value:b.usdtValue})),label:{formatter:'{b}\n{d}%'},itemStyle:{borderRadius:4}}]},true)},
    showDeposit(b){this.depCoin=b.coin;this.depAddr='0x'+Array.from({length:40},()=>Math.floor(Math.random()*16).toString(16)).join('');this.depVis=true},
    copy(t){navigator.clipboard?.writeText(t);this.$message.success('Copied')},
    showWithdraw(b){this.wdCoin=b.coin;this.wdAddr='';this.wdAmt='';this.wdVis=true},
    doWd(){if(!this.wdAddr||!this.wdAmt)return this.$message.warning('Fill all fields');const b=this.balances.find(x=>x.coin===this.wdCoin);if(b&&parseFloat(this.wdAmt)>b.balance)return this.$message.error('Insufficient');b.balance-=parseFloat(this.wdAmt);b.usdtValue=b.balance*b.price;this.wdVis=false;this.$message.success('Withdrawal successful')}
  },
  created(){this.init()}
};
</script>

<style scoped>
.assets-page{padding:.133rem .16rem .8rem;min-height:100vh}
.a-header h2{font-size:.213rem;font-weight:700;margin-bottom:.133rem}

.a-total{background:var(--bg-white);border-radius:.107rem;padding:.16rem;margin-bottom:.133rem;border:1px solid var(--border-1);display:flex;flex-direction:column;gap:.053rem}
.a-label{font-size:.133rem;color:var(--text-3)}
.a-value{font-size:.32rem;font-weight:700}

.a-pie{height:2.4rem;background:var(--bg-white);border-radius:.107rem;margin-bottom:.133rem;border:1px solid var(--border-1)}

.a-list{display:flex;flex-direction:column;gap:.107rem}
.a-row{display:flex;align-items:center;gap:.107rem;flex-wrap:wrap;background:var(--bg-white);border-radius:.107rem;padding:.133rem .16rem;border:1px solid var(--border-1)}
.a-left{display:flex;align-items:center;gap:.08rem;flex:1;min-width:1.6rem}
.a-icon{width:.267rem;height:.267rem;border-radius:50%}
.a-coin{font-size:.173rem;font-weight:700;display:block}
.a-sub{font-size:.12rem;color:var(--text-3)}
.a-right{text-align:right;min-width:1.2rem}
.a-bal{font-size:.173rem;font-weight:600;display:block}
.a-usd{font-size:.12rem;color:var(--text-3)}

@media(max-width:480px){.a-row{flex-direction:column;align-items:flex-start}.a-acts{width:100%;justify-content:flex-end;display:flex}}
</style>
