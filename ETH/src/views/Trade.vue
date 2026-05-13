<template>
  <div class="trade-page">
    <!-- 交易对选择 -->
    <header class="trade-header">
      <el-select v-model="activePair" placeholder="选择交易对" size="small" class="pair-select">
        <el-option 
          v-for="p in pairs" :key="p" :label="p" :value="p"
        />
      </el-select>
      <span class="trade-price">
        <span class="price-text lg text-up">{{ currentPrice }}</span>
      </span>
    </header>

    <!-- K线图区域（占位） -->
    <div class="kline-area">
      <div class="kline-placeholder">
        <i class="el-icon-data-line" style="font-size:48px;color:var(--text-4)" />
        <p>K线图区域 — 可接 TradingView</p>
      </div>
    </div>

    <!-- 下单面板 -->
    <div class="trade-panel">
      <div class="panel-tabs">
        <span :class="{ active: side === 'buy' }" @click="side = 'buy'">买入</span>
        <span :class="{ active: side === 'sell' }" @click="side = 'sell'">卖出</span>
      </div>
      
      <div class="panel-form">
        <div class="form-row">
          <label>类型</label>
          <el-radio-group v-model="orderType" size="small">
            <el-radio-button label="limit">限价</el-radio-button>
            <el-radio-button label="market">市价</el-radio-button>
          </el-radio-group>
        </div>
        
        <div class="form-row" v-if="orderType === 'limit'">
          <label>价格 (USDT)</label>
          <el-input-number 
            v-model="orderPrice" 
            :precision="2" :min="0"
            size="small"
            controls-position="right"
          />
        </div>
        
        <div class="form-row">
          <label>数量 ({{ coin }})</label>
          <el-input-number 
            v-model="orderAmount" 
            :precision="4" :min="0"
            size="small"
            controls-position="right"
          />
        </div>
        
        <div class="form-row">
          <label>总额</label>
          <span class="form-value">{{ fmtPrice(orderTotal) }} USDT</span>
        </div>
        
        <el-button 
          :type="side === 'buy' ? 'success' : 'danger'"
          class="submit-btn"
          :class="side === 'buy' ? 'btn-up' : 'btn-down'"
          @click="placeOrder"
          :loading="submitting"
        >
          {{ side === 'buy' ? '买入' : '卖出' }} {{ coin }}
        </el-button>
      </div>
    </div>

    <!-- 订单簿（模拟） -->
    <div class="orderbook">
      <h4>订单簿</h4>
      <div class="book-columns">
        <div class="book-side asks">
          <div v-for="(row, i) in asks" :key="'a'+i" class="book-row">
            <span class="price text-down">{{ row.price }}</span>
            <span class="amount">{{ row.amount }}</span>
          </div>
        </div>
        <div class="book-center">
          <span class="book-spread text-up">{{ currentPrice }}</span>
        </div>
        <div class="book-side bids">
          <div v-for="(row, i) in bids" :key="'b'+i" class="book-row">
            <span class="price text-up">{{ row.price }}</span>
            <span class="amount">{{ row.amount }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 当前委托 -->
    <div class="orders-section">
      <h4>当前委托</h4>
      <el-table :data="orders" size="small" empty-text="暂无委托">
        <el-table-column prop="side" label="方向" width="60">
          <template #default="{ row }">
            <span :class="row.side === 'buy' ? 'text-up' : 'text-down'">
              {{ row.side === 'buy' ? '买' : '卖' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="价格" />
        <el-table-column prop="amount" label="数量" />
        <el-table-column prop="total" label="总额" />
        <el-table-column prop="status" label="状态" />
        <el-table-column label="操作" width="60">
          <template #default="{ row }">
            <el-button type="text" size="mini" @click="cancelOrder(row.id)">撤单</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { pageHome, coinIcon as cnIcon } from '../api';
import { connect } from '../api/ws';
import { fmtPrice } from '../utils/price';

export default {
  name: 'TradePage',
  
  data() {
    return {
      activePair: 'BTCUSDT',
      pairs: ['BTCUSDT','ETHUSDT','BNBUSDT','SOLUSDT','XRPUSDT','DOGEUSDT','ADAUSDT','AVAXUSDT'],
      side: 'buy',
      orderType: 'limit',
      orderPrice: 0,
      orderAmount: 0,
      submitting: false,
      currentPrice: '0.00',
      asks: [],
      bids: [],
      orders: []
    };
  },
  
  computed: {
    coin() { return this.activePair.replace('USDT', ''); },
    orderTotal() {
      return this.orderType === 'market' 
        ? this.orderAmount * parseFloat(this.currentPrice || 0)
        : this.orderAmount * this.orderPrice;
    }
  },
  
  watch: {
    activePair() { this.generateOrderBook(); }
  },
  
  methods: {
    fmtPrice,
    
    generateOrderBook() {
      const base = parseFloat(this.currentPrice) || 100;
      const asks = [], bids = [];
      for (let i = 1; i <= 8; i++) {
        asks.push({ price: fmtPrice(base * (1 + i * 0.001)), amount: (Math.random() * 2).toFixed(4) });
        bids.push({ price: fmtPrice(base * (1 - i * 0.001)), amount: (Math.random() * 2).toFixed(4) });
      }
      this.asks = asks;
      this.bids = bids;
    },
    
    async placeOrder() {
      this.submitting = true;
      setTimeout(() => {
        this.submitting = false;
        this.orders.unshift({
          id: Date.now(),
          side: this.side,
          price: this.orderPrice || this.currentPrice,
          amount: this.orderAmount,
          total: fmtPrice(this.orderTotal),
          status: '成交'
        });
        this.$message.success(`${this.side === 'buy' ? '买入' : '卖出'}成功`);
      }, 800);
    },
    
    cancelOrder(id) {
      this.orders = this.orders.filter(o => o.id !== id);
      this.$message.info('已撤单');
    },
    
    onWsMessage(msg) {
      if (msg.type === '1004') {
        const symbol = msg.symbol;
        if (symbol === this.activePair) {
          const data = msg.optionMakerResponse || {};
          this.currentPrice = data.lastPrice || this.currentPrice;
          this.generateOrderBook();
        }
      }
    }
  },
  
  created() {
    pageHome().then(res => {
      if (res.code === 200) {
        const coins = res.content || [];
        const current = coins.find(c => (c.fromSymbol + 'USDT') === this.activePair);
        if (current) this.currentPrice = current.lastPrice || '0.00';
      }
    });
    this.generateOrderBook();
  },
  
  mounted() { connect(this.onWsMessage); }
};
</script>

<style lang="scss" scoped>
.trade-page { padding: var(--sp-md); max-width: 800px; margin: 0 auto; }

.trade-header {
  display: flex; align-items: center; gap: var(--sp-lg); margin-bottom: var(--sp-md);
  .pair-select { width: 140px; }
}

.kline-area {
  height: 300px; background: var(--bg-white); border-radius: var(--radius-lg);
  margin-bottom: var(--sp-md);
  .kline-placeholder {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    height: 100%; color: var(--text-3); gap: var(--sp-sm);
  }
}

.trade-panel {
  background: var(--bg-white); border-radius: var(--radius-lg); padding: var(--sp-lg);
  margin-bottom: var(--sp-md);
  .panel-tabs {
    display: flex; margin-bottom: var(--sp-lg);
    span { flex: 1; text-align: center; padding: var(--sp-sm); cursor: pointer; border-radius: var(--radius-md); }
    span.active { font-weight: 700; }
    span:first-child.active { background: var(--up-light); color: var(--up); }
    span:last-child.active { background: var(--down-light); color: var(--down); }
  }
  .form-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--sp-md); label { color: var(--text-2); } }
  .submit-btn { width: 100%; margin-top: var(--sp-md); }
}

.orderbook {
  background: var(--bg-white); border-radius: var(--radius-lg); padding: var(--sp-lg);
  margin-bottom: var(--sp-md);
  h4 { margin-bottom: var(--sp-md); }
  .book-columns { display: flex; }
  .book-side { flex: 1; }
  .book-center { display: flex; align-items: center; padding: 0 var(--sp-md); font-size: var(--fs-lg); font-weight: 700; }
  .book-row { display: flex; justify-content: space-between; padding: 2px 0; font-size: var(--fs-sm); .price { font-family: var(--font-mono); } .amount { color: var(--text-3); } }
}

.orders-section { background: var(--bg-white); border-radius: var(--radius-lg); padding: var(--sp-lg); }
</style>
