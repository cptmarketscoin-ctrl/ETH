<template>
  <van-pull-refresh v-model="refreshing" @refresh="onRefresh" class="home-page">
  <div class="page-container">
    
    <!-- 顶部 -->
    <header class="home-header">
      <div class="header-left">
        <span class="logo-icon">◈</span>
        <h1 class="logo-text">CPT Exchange</h1>
        <span class="header-badge">PRO</span>
      </div>
      <div class="header-right">
        <el-button type="primary" size="mini" round>Sign Up</el-button>
      </div>
    </header>

    <!-- 实时行情滚动条 -->
    <div class="ticker-strip" v-if="tickerCoins.length > 0">
      <div class="ticker-track">
        <span v-for="(t, i) in tickerCoins" :key="i" class="ticker-item" :class="parseFloat(t.rate||0) >= 0 ? 'text-up' : 'text-down'">
          {{ t.fromSymbol }} {{ fmtPrice(t.lastPrice) }}
          <small>{{ parseFloat(t.rate||0) >= 0 ? '+' : '' }}{{ t.rate }}%</small>
        </span>
        <span v-for="(t, i) in tickerCoins" :key="'r'+i" class="ticker-item" :class="parseFloat(t.rate||0) >= 0 ? 'text-up' : 'text-down'">
          {{ t.fromSymbol }} {{ fmtPrice(t.lastPrice) }}
          <small>{{ parseFloat(t.rate||0) >= 0 ? '+' : '' }}{{ t.rate }}%</small>
        </span>
      </div>
    </div>

    <!-- 搜索 -->
    <div class="search-section">
      <el-input v-model="searchText" placeholder="Search coins..." prefix-icon="el-icon-search" size="medium" class="search-input" clearable />
    </div>

    <!-- 市场概览卡片 -->
    <div class="market-overview" v-if="coins.length > 0">
      <div class="overview-row">
        <div class="overview-item">
          <span class="overview-label">BTC / USDT</span>
          <span class="overview-value" :class="btcChange >= 0 ? 'text-up' : 'text-down'">{{ btcPrice }}</span>
          <span class="overview-change" :class="btcChange >= 0 ? 'text-up' : 'text-down'">
            {{ btcChange >= 0 ? '+' : '' }}{{ btcChange.toFixed(2) }}%
          </span>
        </div>
        <div class="overview-item">
          <span class="overview-label">24h 成交量</span>
          <span class="overview-value">$2.8B</span>
        </div>
        <div class="overview-item">
          <span class="overview-label">总市值</span>
          <span class="overview-value">$2.4T</span>
        </div>
      </div>
    </div>

    <!-- 分类标签 -->
    <div class="category-tabs">
      <span v-for="cat in categories" :key="cat" class="cat-tab" :class="{ active: activeCat === cat }" @click="activeCat = cat">{{ cat }}</span>
    </div>

    <!-- 币种卡片网格 -->
    <section class="coin-grid" v-if="coins.length > 0">
      <div v-for="(coin, idx) in filteredCoins" :key="coin.fromSymbol" class="coin-card" :style="{ animationDelay: idx * 0.06 + 's' }" @click="$router.push(`/trade/${coin.fromSymbol}`)">
        
        <div class="card-top">
          <div class="card-header">
            <img :src="coin.iconUrl" :alt="coin.fromSymbol" class="coin-icon" @error="onIconError" />
            <div class="coin-info">
              <span class="coin-name">{{ coin.fromSymbol }}</span>
              <span class="coin-pair">/USDT</span>
            </div>
          </div>
          <div class="card-change" :class="coin.isUp ? 'text-up' : 'text-down'">
            <span class="change-badge" :class="coin.isUp ? 'badge-up' : 'badge-down'">
              {{ coin.rate }}%
            </span>
          </div>
        </div>

        <div class="card-price">
          <span class="price-text">{{ coin.lastPrice }}</span>
          <span class="price-usd">≈ ${{ coin.lastPrice }}</span>
        </div>

        <div class="card-kline">
          <MiniKline v-if="coin.klineRespList && coin.klineRespList.length" :data="coin.klineRespList" :isUp="coin.isUp" :w="240" :h="52" />
        </div>

        <div class="card-meta">
          <div class="meta-item">
            <span class="meta-label">24h Vol</span>
            <span class="meta-value">{{ fmtVolume(coin.twentyFourHrResp?.volume || 0) }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">24h High</span>
            <span class="meta-value">{{ coin.twentyFourHrResp?.lastPrice || coin.lastPrice }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">24h Low</span>
            <span class="meta-value">{{ coin.lastPrice }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 骨架 -->
    <section class="coin-grid" v-else>
      <div v-for="i in 8" :key="i" class="coin-card"><div class="skeleton" style="height:120px" /></div>
    </section>

    <!-- 新闻 -->
    <section class="news-section" v-if="newsList.length > 0">
      <div class="section-header">
        <h3>Market News</h3>
        <span class="section-more">More <i class="el-icon-arrow-right" /></span>
      </div>
      <div class="news-list">
        <div v-for="(item, i) in newsList.slice(0, 6)" :key="i" class="news-row">
          <div class="news-left">
            <span class="news-coin">{{ item.coinName }}</span>
            <span class="news-desc">{{ item.coinName }} market update</span>
          </div>
          <div class="news-right" :class="parseFloat(item.change24h) >= 0 ? 'text-up' : 'text-down'">
            {{ item.change24h }}%
          </div>
        </div>
      </div>
    </section>

    <div style="height:60px" />
  </div>
  </van-pull-refresh>
</template>

<script>
import { pageHome, getStockList, coinIcon as coinIconUrl } from '../api';
import { connect } from '../api/ws';
import { fmtPrice, fmtChange, fmtVolume } from '../utils/price';
import MiniKline from '../components/MiniKline.vue';

export default {
  name: 'HomePage',
  components: { MiniKline },
  
  data() {
    return {
      searchText: '', refreshing: false, activeCat: '全部',
      categories: ['All', 'Main', 'DeFi', 'Layer 2', 'Meme'],
      coins: [], tickerCoins: [], newsList: [],
      btcPrice: '0.00', btcChange: 0
    };
  },
  
  computed: {
    filteredCoins() {
      if (!this.searchText) return this.coins;
      return this.coins.filter(c => c.fromSymbol.toUpperCase().includes(this.searchText.toUpperCase()));
    }
  },
  
  methods: {
    fmtPrice, fmtChange, fmtVolume, coinIconUrl,
    
    async fetchHome() {
      try {
        const res = await pageHome();
        if (res.code === 200) {
          this.coins = (res.content || []).map(c => ({
            ...c,
            iconUrl: coinIconUrl(c.fromSymbol || c.coinName),
            isUp: parseFloat(c.rate || 0) >= 0
          }));
          this.tickerCoins = this.coins;
          const btc = this.coins.find(c => c.fromSymbol === 'BTC');
          if (btc) { this.btcPrice = btc.lastPrice; this.btcChange = parseFloat(btc.rate || 0); }
        }
      } catch(e) {}
    },
    
    async fetchNews() {
      try {
        const res = await getStockList();
        if (res.code === 200) this.newsList = (res.content || []).slice(0, 20);
      } catch(e) {}
    },
    
    async onRefresh() { await this.fetchHome(); await this.fetchNews(); this.refreshing = false; },
    onIconError(e) { e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" fill="%2332353c"/></svg>'; },
    
    onWsMessage(msg) {
      if (msg.type === '1004') {
        const symbol = (msg.symbol || '').replace('USDT', '');
        const data = msg.optionMakerResponse || {};
        const idx = this.coins.findIndex(c => c.fromSymbol === symbol);
        if (idx >= 0) {
          const c = { ...this.coins[idx] };
          if (data.lastPrice) c.lastPrice = data.lastPrice;
          if (data.priceChangePercent !== undefined) {
            c.rate = parseFloat(data.priceChangePercent).toFixed(2);
            c.isUp = parseFloat(data.priceChangePercent) >= 0;
            c.rate = c.isUp ? '+' + c.rate : c.rate;
          }
          this.$set(this.coins, idx, c);
        }
      }
    }
  },
  
  created() { this.fetchHome(); this.fetchNews(); this._t = setInterval(() => this.fetchHome(), 10000); },
  mounted() { connect(this.onWsMessage); },
  beforeDestroy() { if (this._t) clearInterval(this._t); }
};
</script>

<style lang="scss" scoped>
.home-page { min-height: 100vh; padding-bottom: 80px; }

// === 顶部 ===
.home-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 4px 12px 4px; margin-bottom: 4px;
  .header-left { display: flex; align-items: center; gap: 8px; }
  .logo-icon { font-size: 22px; color: var(--primary); }
  .logo-text { font-size: 18px; font-weight: 700; }
  .header-badge { font-size: 9px; background: var(--primary); color: #fff; padding: 1px 6px; border-radius: 3px; letter-spacing: 1px; }
}

// === 行情滚动条 ===
.ticker-strip {
  background: var(--bg-white); border-radius: 8px; padding: 8px 0; margin-bottom: 12px;
  overflow: hidden; border: 1px solid var(--border-1);
  .ticker-track { display: flex; gap: 28px; animation: ticker-scroll 25s linear infinite; white-space: nowrap; padding: 0 14px; }
  .ticker-item { font-size: 12px; font-weight: 500; small { margin-left: 4px; } }
}
@keyframes ticker-scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

// === 搜索 ===
.search-section { margin-bottom: 12px; }
.search-section .el-input__inner { background: var(--bg-white) !important; border-color: var(--border-1) !important; border-radius: 8px !important; height: 40px !important; }

// === 概览 ===
.market-overview {
  background: var(--bg-white); border-radius: 8px; padding: 16px; margin-bottom: 12px; border: 1px solid var(--border-1);
  .overview-row { display: flex; gap: 20px; }
  .overview-item { display: flex; flex-direction: column; gap: 2px; }
  .overview-label { font-size: 11px; color: var(--text-3); }
  .overview-value { font-size: 16px; font-weight: 700; }
  .overview-change { font-size: 12px; font-weight: 600; }
}

// === 分类 ===
.category-tabs {
  display: flex; gap: 8px; margin-bottom: 12px; overflow-x: auto;
  .cat-tab { padding: 6px 14px; border-radius: 20px; font-size: 13px; color: var(--text-3); cursor: pointer; white-space: nowrap; background: var(--bg-white); border: 1px solid var(--border-1); }
  .cat-tab.active { background: var(--primary); color: #fff; border-color: var(--primary); }
}

// === 币种卡片 ===
.coin-grid {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;
  @media (min-width: 640px) { grid-template-columns: repeat(3, 1fr); }
  @media (min-width: 1024px) { grid-template-columns: repeat(4, 1fr); }
}

.coin-card {
  background: var(--bg-white); border-radius: 10px; padding: 14px; cursor: pointer;
  border: 1px solid var(--border-1); transition: border-color .2s;
  animation: cardSlideUp .5s ease both;
  &:hover { border-color: var(--primary); }

  .card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
  .card-header { display: flex; align-items: center; gap: 8px; }
  .coin-icon { width: 26px; height: 26px; border-radius: 50%; }
  .coin-name { font-weight: 700; font-size: 14px; }
  .coin-pair { font-size: 11px; color: var(--text-3); }

  .change-badge { padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; }
  .badge-up { background: rgba(185,248,45,0.15); color: var(--up); }
  .badge-down { background: rgba(255,77,79,0.15); color: var(--down); }

  .card-price { display: flex; flex-direction: column; gap: 2px; margin-bottom: 8px; }
  .price-text { font-size: 20px; font-weight: 700; font-family: var(--font-mono); }
  .price-usd { font-size: 11px; color: var(--text-3); }

  .card-kline { margin-bottom: 10px; overflow: hidden; border-radius: 4px; }

  .card-meta { display: flex; justify-content: space-between; }
  .meta-item { display: flex; flex-direction: column; gap: 1px; }
  .meta-label { font-size: 10px; color: var(--text-4); }
  .meta-value { font-size: 11px; color: var(--text-2); }
}

// === 新闻 ===
.news-section { margin-top: 20px; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;
  h3 { font-size: 16px; }
  .section-more { font-size: 12px; color: var(--text-3); cursor: pointer; }
}
.news-list { display: flex; flex-direction: column; gap: 1px; background: var(--bg-white); border-radius: 10px; overflow: hidden; border: 1px solid var(--border-1); }
.news-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 14px; }
.news-left { display: flex; flex-direction: column; gap: 2px; }
.news-coin { font-size: 13px; font-weight: 600; }
.news-desc { font-size: 11px; color: var(--text-3); }
.news-right { font-size: 13px; font-weight: 600; }

@keyframes cardSlideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
