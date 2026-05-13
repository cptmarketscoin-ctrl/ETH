<template>
  <div class="market-page">
    
    <!-- Header -->
    <header class="page-header">
      <h2 class="page-title">Markets</h2>
      <div class="header-actions">
        <el-input v-model="searchText" placeholder="Search coin" prefix-icon="el-icon-search" size="medium" class="search-input" clearable />
      </div>
    </header>

    <!-- Stats Bar -->
    <div class="stats-bar" v-if="coins.length > 0">
      <div class="stat-item">
        <span class="stat-label">24h Volume</span>
        <span class="stat-value">$2.8B</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Active Pairs</span>
        <span class="stat-value">{{ coins.length }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">BTC Dominance</span>
        <span class="stat-value text-up">52.4%</span>
      </div>
    </div>

    <!-- Category Filters -->
    <div class="category-row">
      <span v-for="cat in categories" :key="cat.key" class="cat-chip" :class="{ active: activeCat === cat.key }" @click="activeCat = cat.key">
        {{ cat.label }}
      </span>
    </div>

    <!-- Table Header -->
    <div class="table-header">
      <div class="th th-star" @click="sortBy('fav')"><i :class="sortKey==='fav' ? 'el-icon-star-on' : 'el-icon-star-off'" :style="{color: sortKey==='fav' ? 'var(--up)' : 'var(--text-4)'}" /></div>
      <div class="th th-name" @click="sortBy('name')">Name <i v-if="sortKey==='name'" :class="sortAsc ? 'el-icon-caret-top' : 'el-icon-caret-bottom'" /></div>
      <div class="th th-price" @click="sortBy('price')">Price <i v-if="sortKey==='price'" :class="sortAsc ? 'el-icon-caret-top' : 'el-icon-caret-bottom'" /></div>
      <div class="th th-change" @click="sortBy('change')">24h Change <i v-if="sortKey==='change'" :class="sortAsc ? 'el-icon-caret-top' : 'el-icon-caret-bottom'" /></div>
      <div class="th th-volume" @click="sortBy('volume')">24h Volume</div>
      <div class="th th-chart">Chart</div>
      <div class="th th-trade">Trade</div>
    </div>

    <!-- Coin Rows -->
    <transition-group name="row-fade" tag="div" class="coin-rows" v-if="coins.length > 0">
      <div v-for="(coin, idx) in sortedCoins" :key="coin.fromSymbol" class="coin-row" :style="{ animationDelay: idx * 0.03 + 's' }">
        
        <div class="td td-star" @click.stop="toggleFav(coin.fromSymbol)">
          <i :class="isFav(coin.fromSymbol) ? 'el-icon-star-on' : 'el-icon-star-off'" :style="{color: isFav(coin.fromSymbol) ? 'var(--up)' : 'var(--text-4)'}" />
        </div>

        <div class="td td-name" @click="$router.push(`/trade/${coin.fromSymbol}`)">
          <img :src="coin.iconUrl" :alt="coin.fromSymbol" class="row-icon" @error="e => e.target.style.display='none'" />
          <div class="name-info">
            <span class="name-symbol">{{ coin.fromSymbol }}</span>
            <span class="name-full">{{ coin.fromSymbol }}</span>
          </div>
        </div>

        <div class="td td-price">
          <span class="price-value" ref="price-{{coin.fromSymbol}}">{{ coin.lastPrice }}</span>
        </div>

        <div class="td td-change">
          <span class="change-badge" :class="coin.isUp ? 'badge-up' : 'badge-down'">
            {{ coin.rate }}%
          </span>
        </div>

        <div class="td td-volume">
          <span class="vol-value">${{ fmtVolume(coin.twentyFourHrResp?.volume || coin.marketCap || 0) }}</span>
        </div>

        <div class="td td-chart">
          <MiniKline v-if="coin.klineRespList && coin.klineRespList.length" :data="coin.klineRespList" :isUp="coin.isUp" :w="90" :h="36" />
        </div>

        <div class="td td-trade" @click="$router.push(`/trade/${coin.fromSymbol}`)">
          <span class="trade-btn">Trade</span>
        </div>

      </div>
    </transition-group>

    <!-- Loading Skeleton -->
    <div class="coin-rows" v-else>
      <div v-for="i in 15" :key="i" class="coin-row skeleton-row">
        <div class="skeleton" style="height:16px;width:60%" />
      </div>
    </div>

  </div>
</template>

<script>
import { pageHome, coinIcon as coinIconUrl } from '../api';
import { connect } from '../api/ws';
import { fmtPrice, fmtVolume } from '../utils/price';
import MiniKline from '../components/MiniKline.vue';

export default {
  name: 'MarketPage',
  components: { MiniKline },
  
  data() {
    return {
      searchText: '', sortKey: 'volume', sortAsc: false, activeCat: 'all',
      coins: [], favs: JSON.parse(localStorage.getItem('cpt_favs') || '[]'),
      categories: [
        { key: 'all', label: 'All' },
        { key: 'main', label: 'Main' },
        { key: 'defi', label: 'DeFi' },
        { key: 'l2', label: 'Layer 2' },
        { key: 'meme', label: 'Meme' }
      ]
    };
  },
  
  computed: {
    filteredCoins() {
      if (!this.searchText) return this.coins;
      return this.coins.filter(c => c.fromSymbol.toUpperCase().includes(this.searchText.toUpperCase()));
    },
    sortedCoins() {
      let arr = [...this.filteredCoins];
      if (this.sortKey === 'fav') {
        return arr.sort((a, b) => {
          const fa = this.favs.includes(a.fromSymbol) ? 0 : 1;
          const fb = this.favs.includes(b.fromSymbol) ? 0 : 1;
          return fa - fb;
        });
      }
      return arr.sort((a, b) => {
        let va, vb;
        switch(this.sortKey) {
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
    fmtPrice, fmtVolume, coinIconUrl,
    isFav(s) { return this.favs.includes(s); },
    toggleFav(s) {
      const idx = this.favs.indexOf(s);
      if (idx >= 0) this.favs.splice(idx, 1); else this.favs.push(s);
      localStorage.setItem('cpt_favs', JSON.stringify(this.favs));
    },
    sortBy(key) {
      if (this.sortKey === key) this.sortAsc = !this.sortAsc;
      else { this.sortKey = key; this.sortAsc = false; }
    },
    
    async fetchData() {
      try {
        const res = await pageHome();
        if (res.code === 200) {
          this.coins = (res.content || []).map(c => ({
            ...c, iconUrl: coinIconUrl(c.fromSymbol || c.coinName),
            isUp: parseFloat(c.rate || 0) >= 0
          }));
        }
      } catch(e) {}
    },
    
    onWsMessage(msg) {
      if (msg.type === '1004') {
        const symbol = (msg.symbol || '').replace('USDT', '');
        const data = msg.optionMakerResponse || {};
        const idx = this.coins.findIndex(c => c.fromSymbol === symbol);
        if (idx >= 0) {
          const c = { ...this.coins[idx] };
          if (data.lastPrice) c.lastPrice = data.lastPrice;
          if (data.priceChangePercent !== undefined) { c.rate = parseFloat(data.priceChangePercent).toFixed(2); c.isUp = parseFloat(data.priceChangePercent) >= 0; c.rate = c.isUp ? '+' + c.rate : c.rate; }
          this.$set(this.coins, idx, c);
        }
      }
    }
  },
  
  created() { this.fetchData(); },
  mounted() { connect(this.onWsMessage); }
};
</script>

<style lang="scss" scoped>
.market-page { padding: 12px 0 80px 0; min-height: 100vh; }

// === Header ===
.page-header {
  display: flex; align-items: center; justify-content: space-between; padding: 0 4px 12px 4px;
  .page-title { font-size: 22px; font-weight: 700; }
  .search-input { width: 200px;
    .el-input__inner { background: var(--bg-white) !important; border-color: var(--border-1) !important; border-radius: 8px !important; }
  }
}

// === Stats ===
.stats-bar {
  display: flex; gap: 16px; margin-bottom: 12px;
  .stat-item { display: flex; flex-direction: column; gap: 2px; padding: 10px 14px; background: var(--bg-white); border-radius: 8px; border: 1px solid var(--border-1); flex: 1; }
  .stat-label { font-size: 11px; color: var(--text-4); }
  .stat-value { font-size: 15px; font-weight: 700; }
}

// === Categories ===
.category-row { display: flex; gap: 8px; margin-bottom: 14px; overflow-x: auto; }
.cat-chip { padding: 5px 14px; border-radius: 20px; font-size: 12px; color: var(--text-3); cursor: pointer; white-space: nowrap; background: var(--bg-white); border: 1px solid var(--border-1); transition: all .2s; }
.cat-chip.active { background: var(--primary); color: #fff; border-color: var(--primary); }

// === Table Header ===
.table-header {
  display: flex; align-items: center; padding: 10px 12px; font-size: 11px; color: var(--text-4); font-weight: 500; text-transform: uppercase; letter-spacing: .5px; background: var(--bg-white); border-radius: 8px 8px 0 0; border: 1px solid var(--border-1); border-bottom: none;
  .th { cursor: pointer; display: flex; align-items: center; gap: 2px; i { font-size: 10px; } }
  .th-star { flex: 0 0 28px; justify-content: center; font-size: 14px; }
  .th-name { flex: 2; padding-left: 4px; }
  .th-price { flex: 1.5; text-align: right; }
  .th-change { flex: 1.2; text-align: right; }
  .th-volume { flex: 1; text-align: right; }
  .th-chart { flex: 0 0 100px; text-align: center; }
  .th-trade { flex: 0 0 60px; text-align: center; }
}

// === Coin Rows ===
.coin-rows { border: 1px solid var(--border-1); border-top: none; border-radius: 0 0 8px 8px; background: var(--bg-white); overflow: hidden; }

.coin-row {
  display: flex; align-items: center; padding: 12px; border-bottom: 1px solid var(--border-2);
  transition: background .15s; cursor: pointer;
  animation: rowSlideIn .4s ease both;
  &:last-child { border-bottom: none; }
  &:hover { background: var(--bg-hover); }
  
  .td { display: flex; align-items: center; }
  .td-star { flex: 0 0 28px; justify-content: center; font-size: 14px; z-index: 2; }
  .td-name { flex: 2; gap: 10px; padding-left: 4px; }
  .td-price { flex: 1.5; justify-content: flex-end; }
  .td-change { flex: 1.2; justify-content: flex-end; }
  .td-volume { flex: 1; justify-content: flex-end; }
  .td-chart { flex: 0 0 100px; justify-content: center; }
  .td-trade { flex: 0 0 60px; justify-content: center; }
}

@keyframes rowSlideIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.row-icon { width: 26px; height: 26px; border-radius: 50%; }
.name-info { display: flex; flex-direction: column; gap: 1px; }
.name-symbol { font-size: 14px; font-weight: 700; }
.name-full { font-size: 11px; color: var(--text-4); }

.price-value { font-size: 14px; font-weight: 600; font-family: var(--font-mono); }

.change-badge { padding: 3px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; }
.badge-up { background: rgba(185,248,45,0.12); color: var(--up); }
.badge-down { background: rgba(255,77,79,0.12); color: var(--down); }

.vol-value { font-size: 12px; color: var(--text-3); }

.trade-btn { padding: 4px 12px; border-radius: 6px; background: var(--primary); color: #fff; font-size: 11px; font-weight: 600; white-space: nowrap; transition: opacity .15s; &:hover { opacity: .85; } }

.skeleton-row { animation: none !important; padding: 16px 12px; }

@media (max-width: 640px) {
  .th-chart, .th-volume, .th-price { display: none; }
  .td-chart, .td-volume, .td-price { display: none; }
  .th-name { flex: 3; }
  .td-name { flex: 3; }
}
</style>
