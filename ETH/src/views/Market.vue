<template>
  <div class="market-page page-container">
    <header class="page-header">
      <h2>行情</h2>
      <el-input
        v-model="searchText"
        placeholder="搜索币种"
        prefix-icon="el-icon-search"
        size="small"
        class="search-input"
        clearable
      />
    </header>

    <!-- 排序标签 -->
    <div class="sort-tabs">
      <span 
        v-for="tab in sortTabs" 
        :key="tab.key"
        class="sort-tab"
        :class="{ active: sortKey === tab.key }"
        @click="sortBy(tab.key)"
      >
        {{ tab.label }}
        <i v-if="sortKey === tab.key" :class="sortAsc ? 'el-icon-caret-top' : 'el-icon-caret-bottom'" />
      </span>
    </div>

    <!-- 币种列表 -->
    <div class="coin-list" v-if="coins.length > 0">
      <div 
        v-for="coin in sortedCoins" 
        :key="coin.fromSymbol"
        class="coin-row"
        @click="$router.push(`/trade/${coin.fromSymbol}`)"
      >
        <div class="coin-left">
          <img :src="coin.iconUrl" :alt="coin.fromSymbol" class="coin-icon" @error="e => e.target.style.display='none'" />
          <div class="coin-info">
            <span class="coin-name">{{ coin.fromSymbol }}</span>
            <span class="coin-pair">/USDT</span>
          </div>
        </div>
        <div class="coin-price price-text md">{{ coin.lastPrice }}</div>
        <div class="coin-change" :class="coin.isUp ? 'text-up' : 'text-down'">
          {{ coin.rate }}%
        </div>
        <div class="coin-volume hide-mobile">{{ coin.twentyFourHrResp?.volume || 0 | fmtVol }}</div>
      </div>
    </div>

    <!-- 骨架屏 -->
    <div class="coin-list" v-else>
      <div v-for="i in 15" :key="i" class="coin-row">
        <div class="skeleton" style="height: 20px; width: 100%" />
      </div>
    </div>
  </div>
</template>

<script>
import { pageHome, coinIcon as coinIconUrl } from '../api';
import { connect } from '../api/ws';
import { fmtPrice } from '../utils/price';

export default {
  name: 'MarketPage',
  
  data() {
    return {
      searchText: '',
      coins: [],
      sortKey: 'volume',
      sortAsc: false,
      sortTabs: [
        { key: 'name', label: '名称' },
        { key: 'price', label: '最新价' },
        { key: 'change', label: '涨跌幅' },
        { key: 'volume', label: '成交量' }
      ]
    };
  },
  
  filters: {
    fmtVol(v) {
      const n = parseFloat(v) || 0;
      if (n >= 1e9) return (n/1e9).toFixed(2)+'B';
      if (n >= 1e6) return (n/1e6).toFixed(2)+'M';
      return (n/1e3).toFixed(2)+'K';
    }
  },
  
  computed: {
    filteredCoins() {
      if (!this.searchText) return this.coins;
      const q = this.searchText.toUpperCase();
      return this.coins.filter(c => c.fromSymbol.includes(q));
    },
    sortedCoins() {
      const arr = [...this.filteredCoins];
      const k = this.sortKey;
      return arr.sort((a, b) => {
        let va, vb;
        switch (k) {
          case 'name': va = a.fromSymbol; vb = b.fromSymbol; break;
          case 'price': va = parseFloat(a.lastPrice||0); vb = parseFloat(b.lastPrice||0); break;
          case 'change': va = parseFloat(a.rate||0); vb = parseFloat(b.rate||0); break;
          case 'volume': va = a.twentyFourHrResp?.volume||0; vb = b.twentyFourHrResp?.volume||0; break;
          default: return 0;
        }
        const cmp = va < vb ? -1 : va > vb ? 1 : 0;
        return this.sortAsc ? cmp : -cmp;
      });
    }
  },
  
  methods: {
    fmtPrice,
    sortBy(key) {
      if (this.sortKey === key) {
        this.sortAsc = !this.sortAsc;
      } else {
        this.sortKey = key;
        this.sortAsc = false;
      }
    },
    
    async fetchData() {
      try {
        const res = await pageHome();
        if (res.code === 200) {
          this.coins = (res.content || []).map(c => ({
            ...c,
            iconUrl: coinIconUrl(c.fromSymbol || c.coinName)
          }));
        }
      } catch(e) {}
    },
    
    onWsMessage(msg) {
      if (msg.type === '1004') {
        const data = msg.optionMakerResponse || {};
        const symbol = (msg.symbol || '').replace('USDT', '');
        const idx = this.coins.findIndex(c => c.fromSymbol === symbol);
        if (idx >= 0) {
          this.$set(this.coins, idx, {
            ...this.coins[idx],
            lastPrice: data.lastPrice,
            rate: parseFloat(data.priceChangePercent || 0).toFixed(2)
          });
        }
      }
    }
  },
  
  created() { this.fetchData(); },
  mounted() { connect(this.onWsMessage); }
};
</script>

<style lang="scss" scoped>
.page-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: var(--sp-lg);
  h2 { font-size: var(--fs-xl); }
  .search-input { width: 200px; }
}

.sort-tabs {
  display: flex; gap: var(--sp-lg); margin-bottom: var(--sp-md);
  .sort-tab {
    font-size: var(--fs-sm); color: var(--text-3); cursor: pointer;
    &.active { color: var(--primary); font-weight: 600; }
    i { font-size: var(--fs-xs); }
  }
}

.coin-list {
  .coin-row {
    display: flex; align-items: center; padding: var(--sp-md);
    background: var(--bg-white); border-bottom: 1px solid var(--border-3); cursor: pointer;
    transition: background var(--transition-fast);
    &:hover { background: var(--bg-hover); }
    
    .coin-left {
      display: flex; align-items: center; gap: var(--sp-sm); flex: 1;
      .coin-icon { width: 24px; height: 24px; border-radius: 50%; }
      .coin-name { font-weight: 600; }
      .coin-pair { font-size: var(--fs-xs); color: var(--text-3); margin-left: var(--sp-xs); }
    }
    .coin-price { flex: 1; text-align: right; }
    .coin-change { flex: 0 0 80px; text-align: right; font-weight: 600; font-size: var(--fs-sm); }
    .coin-volume { flex: 0 0 80px; text-align: right; font-size: var(--fs-sm); color: var(--text-3); }
  }
}

@media (max-width: 480px) {
  .coin-volume { display: none; }
  .coin-change { flex: 0 0 60px; }
}
</style>
