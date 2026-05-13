<template>
  <div class="assets-page page-container">
    <header class="page-header">
      <h2>Assets</h2>
    </header>

    <!-- 总Assets -->
    <div class="total-card card">
      <span class="total-label">总AssetsEst. (USDT)</span>
      <span class="total-value">${{ fmtPrice(totalValue) }}</span>
    </div>

    <!-- AssetsChart -->
    <div ref="assetChart" class="asset-chart"></div>

    <!--  -->
    <div class="asset-list">
      <div v-for="item in balances" :key="item.coin" class="asset-row card">
        <div class="asset-left">
          <img :src="item.icon" :alt="item.coin" class="asset-icon" @error="e => e.target.style.display='none'" />
          <div class="asset-info">
            <span class="asset-coin">{{ item.coin }}</span>
            <span class="asset-fullname">{{ item.coin }} Wallet</span>
          </div>
        </div>
        <div class="asset-right">
          <div class="asset-balance">
            <span class="balance-amount">{{ item.balance }}</span>
            <span class="balance-value">≈ ${{ fmtPrice(item.usdtValue) }}</span>
          </div>
        </div>
        <div class="asset-actions">
          <el-button size="mini" type="primary" plain @click="showDeposit(item)">Deposit</el-button>
          <el-button size="mini" plain @click="showWithdraw(item)">Withdraw</el-button>
        </div>
      </div>
    </div>

    <!--  -->
    <div v-if="loading" class="asset-list">
      <div v-for="i in 5" :key="i" class="asset-row card">
        <div class="skeleton" style="height: 40px; width: 100%" />
      </div>
    </div>

    <!-- Deposit -->
    <el-dialog :title="'Deposit ' + depositCoin" :visible.sync="depositVisible" width="360px">
      <div class="deposit-content">
        <p>Send to this address: {{ depositCoin }}：</p>
        <div class="address-box">
          <code>{{ depositAddress }}</code>
          <el-button size="mini" type="primary" @click="copyAddress">复制</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- Withdraw -->
    <el-dialog :title="'Withdraw ' + withdrawCoin" :visible.sync="withdrawVisible" width="360px">
      <div class="withdraw-form">
        <el-input v-model="withdrawAddress" placeholder="Withdraw地址" size="small" />
        <el-input v-model="withdrawAmount" placeholder="Amount" size="small" type="number" style="margin-top:12px" />
        <el-button type="primary" style="margin-top:16px;width:100%" @click="doWithdraw">确认Withdraw</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { coinIcon as coinIconUrl } from '../api';
import { fmtPrice } from '../utils/price';
let echarts = null; try { echarts = require('echarts'); } catch(e) {}

export default {
  name: 'AssetsPage',
  
  data() {
    return {
      loading: false,
      balances: [],
      depositVisible: false,
      depositCoin: '',
      depositAddress: '',
      withdrawVisible: false,
      withdrawCoin: '',
      withdrawAddress: '',
      withdrawAmount: ''
    };
  },
  
  computed: {
    totalValue() {
      return this.balances.reduce((sum, b) => sum + (b.usdtValue || 0), 0);
    }
  },
  
  methods: {
    fmtPrice,
    
    renderChart() {
      if (!echarts || !this.$refs.assetChart || this.balances.length === 0) return;
      if (!this.chart) this.chart = echarts.init(this.$refs.assetChart);
      const data = this.balances.map(b => ({ name: b.coin, value: b.usdtValue || 0 }));
      this.chart.setOption({
        tooltip: { trigger: 'item', formatter: '{b}: ${c}' },
        series: [{
          type: 'pie', radius: ['50%', '75%'], center: ['50%', '50%'],
          data: data.filter(d => d.value > 0),
          label: { formatter: '{b}\n{d}%' },
          itemStyle: { borderRadius: 4 }
        }]
      }, true);
    },
    
    initBalances() {
      const coins = ['BTC','ETH','BNB','SOL','XRP','DOGE','ADA','AVAX','USDT'];
      const prices = { BTC: 79300, ETH: 2250, BNB: 668, SOL: 91, XRP: 1.42, DOGE: 0.11, ADA: 0.26, AVAX: 9.7, USDT: 1 };
      const balances = { BTC: 1.5, ETH: 10, BNB: 50, SOL: 200, XRP: 10000, DOGE: 50000, ADA: 30000, AVAX: 500, USDT: 100000 };
      
      this.balances = coins.map(c => ({
        coin: c,
        balance: balances[c] || 0,
        price: prices[c] || 0,
        usdtValue: (balances[c] || 0) * (prices[c] || 0),
        icon: coinIconUrl(c)
      }));
    },
    
    showDeposit(item) {
      this.depositCoin = item.coin;
      this.depositAddress = '0x' + Array.from({length:40}, () => Math.floor(Math.random()*16).toString(16)).join('');
      this.depositVisible = true;
    },
    
    copyAddress() {
      navigator.clipboard?.writeText(this.depositAddress);
      this.$message.success('Address copied');
    },
    
    showWithdraw(item) {
      this.withdrawCoin = item.coin;
      this.withdrawAddress = '';
      this.withdrawAmount = '';
      this.withdrawVisible = true;
    },
    
    doWithdraw() {
      if (!this.withdrawAddress || !this.withdrawAmount) {
        this.$message.warning('Fill in all fields');
        return;
      }
      const item = this.balances.find(b => b.coin === this.withdrawCoin);
      if (item && parseFloat(this.withdrawAmount) > item.balance) {
        this.$message.error('Insufficient balance');
        return;
      }
      item.balance -= parseFloat(this.withdrawAmount);
      item.usdtValue = item.balance * item.price;
      this.withdrawVisible = false;
      this.$message.success('Withdraw成功');
    }
  },
  
  created() {
    this.initBalances();
  },
  mounted() {
    this.$nextTick(() => this.renderChart());
  }
};
</script>

<style lang="scss" scoped>
.total-card {
  display: flex; flex-direction: column; gap: var(--sp-sm);
  margin-bottom: var(--sp-lg);
  .total-label { font-size: var(--fs-sm); color: var(--text-3); }
  .total-value { font-size: var(--fs-xxl); font-weight: 700; color: var(--up); }
}

.asset-chart {
  height: 220px; background: var(--bg-white); border-radius: var(--radius-lg);
  margin-bottom: var(--sp-lg);
}

.asset-list { display: flex; flex-direction: column; gap: var(--sp-md); }

.asset-row {
  display: flex; align-items: center; gap: var(--sp-md); flex-wrap: wrap;
  
  .asset-left {
    display: flex; align-items: center; gap: var(--sp-sm); flex: 1; min-width: 150px;
    .asset-icon { width: 32px; height: 32px; border-radius: 50%; }
    .asset-coin { font-weight: 700; }
    .asset-fullname { display: block; font-size: var(--fs-xs); color: var(--text-3); }
  }
  
  .asset-right {
    text-align: right; min-width: 120px;
    .balance-amount { display: block; font-weight: 600; }
    .balance-value { font-size: var(--fs-xs); color: var(--text-3); }
  }
  
  .asset-actions { display: flex; gap: var(--sp-sm); }
}

.address-box {
  background: var(--bg); padding: var(--sp-md); border-radius: var(--radius-md);
  word-break: break-all; margin-top: var(--sp-md);
  code { font-size: var(--fs-xs); }
  .el-button { margin-top: var(--sp-sm); }
}

@media (max-width: 480px) {
  .asset-row { flex-direction: column; align-items: flex-start; }
  .asset-actions { width: 100%; justify-content: flex-end; }
}
</style>
