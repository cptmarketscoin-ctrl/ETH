<template>
  <div class="home-page page-container">
    <!-- 顶部栏 -->
    <header class="home-header">
      <div class="header-left">
        <h1 class="logo-text">CPT Exchange</h1>
      </div>
      <div class="header-right">
        <el-input
          v-model="searchText"
          placeholder="搜索币种"
          prefix-icon="el-icon-search"
          size="small"
          class="search-input"
          clearable
        />
      </div>
    </header>

    <!-- 市场概览 -->
    <section class="market-overview" v-if="marketStats">
      <div class="stat-item">
        <span class="stat-label">24h 成交量</span>
        <span class="stat-value">{{ fmtVolume(marketStats.totalVolume) }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label" :class="btcChange > 0 ? 'text-up' : 'text-down'">
          BTC {{ fmtChange(btcChange) }}%
        </span>
        <span class="stat-value">{{ btcPrice }}</span>
      </div>
    </section>

    <!-- 币种卡片网格 -->
    <section class="coin-grid" v-if="coins.length > 0">
      <div 
        v-for="coin in filteredCoins" 
        :key="coin.fromSymbol"
        class="coin-card card"
        @click="$router.push(`/trade/${coin.fromSymbol}`)"
      >
        <div class="coin-header">
          <img 
            :src="coin.iconUrl" 
            :alt="coin.fromSymbol"
            class="coin-icon"
            @error="onIconError"
          />
          <div class="coin-info">
            <span class="coin-name">{{ coin.fromSymbol }}</span>
            <span class="coin-pair">/USDT</span>
          </div>
        </div>
        
        <div class="coin-price">
          <span class="price-text lg">{{ coin.lastPrice }}</span>
        </div>
        
        <div class="coin-change" :class="coin.isUp ? 'text-up' : 'text-down'">
          <span>{{ coin.rate }}%</span>
        </div>
        
        <div class="coin-kline">
          <MiniKline :data="coin.klineRespList || []" :isUp="coin.isUp" />
        </div>
        
        <div class="coin-volume">
          <span class="label">24h Vol</span>
          <span>{{ fmtVolume(coin.twentyFourHrResp?.volume || 0) }}</span>
        </div>
      </div>
    </section>

    <!-- 骨架屏 -->
    <section class="coin-grid" v-else>
      <div v-for="i in 8" :key="i" class="coin-card card">
        <div class="skeleton" style="height: 24px; width: 40px; margin-bottom: 12px"></div>
        <div class="skeleton" style="height: 32px; width: 80%; margin-bottom: 8px"></div>
        <div class="skeleton" style="height: 16px; width: 50%"></div>
      </div>
    </section>

    <!-- 新闻 -->
    <section class="news-section" v-if="newsList.length > 0">
      <h3 class="section-title">市场资讯</h3>
      <div class="news-scroll">
        <div v-for="(item, i) in newsList" :key="i" class="news-item">
          <span class="news-coin">{{ item.coinName }}</span>
          <span class="news-price">${{ item.lastPrice }}</span>
          <span class="news-change" :class="parseFloat(item.change24h) >= 0 ? 'text-up' : 'text-down'">
            {{ item.change24h }}%
          </span>
        </div>
      </div>
    </section>
  </div>
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
      searchText: '',
      coins: [],
      newsList: [],
      marketStats: null,
      btcPrice: '$0.00',
      btcChange: 0
    };
  },
  
  computed: {
    filteredCoins() {
      if (!this.searchText) return this.coins;
      const q = this.searchText.toUpperCase();
      return this.coins.filter(c => c.fromSymbol.includes(q));
    }
  },
  
  methods: {
    fmtPrice,
    fmtChange,
    fmtVolume,
    coinIconUrl,
    
    async fetchHome() {
      try {
        const res = await pageHome();
        if (res.code === 200) {
          this.coins = (res.content || res.data || []).map(c => ({
            ...c,
            iconUrl: coinIconUrl(c.fromSymbol || c.coinName)
          }));
          // 更新市场统计
          const btc = this.coins.find(c => c.fromSymbol === 'BTC');
          if (btc) {
            this.btcPrice = '$' + btc.lastPrice;
            this.btcChange = parseFloat(btc.rate || 0);
          }
        }
      } catch (e) {
        console.error('[Home] fetch error:', e);
      }
    },
    
    async fetchNews() {
      try {
        const res = await getStockList();
        if (res.code === 200) {
          this.newsList = (res.content || []).slice(0, 20);
        }
      } catch (e) {
        console.error('[News] fetch error:', e);
      }
    },
    
    onIconError(e) {
      e.target.style.display = 'none';
    },
    
    onWsMessage(msg) {
      if (msg.type === '1004') {
        const { symbol, optionMakerResponse } = msg;
        const fromSymbol = (symbol || '').replace('USDT', '');
        const data = optionMakerResponse || {};
        
        const idx = this.coins.findIndex(c => c.fromSymbol === fromSymbol);
        if (idx >= 0) {
          const coin = { ...this.coins[idx] };
          if (data.lastPrice) coin.lastPrice = data.lastPrice;
          if (data.priceChangePercent !== undefined) {
            coin.rate = parseFloat(data.priceChangePercent).toFixed(2);
            coin.isUp = parseFloat(data.priceChangePercent) >= 0;
            coin.priceChangePercentage = parseFloat(data.priceChangePercent);
            coin.rate = coin.isUp ? '+' + coin.rate : coin.rate;
          }
          if (data.volume) coin.twentyFourHrResp = { ...coin.twentyFourHrResp, volume: data.volume };
          if (data.priceChange) coin.priceChange = data.priceChange;
          this.$set(this.coins, idx, coin);
        }
        // 更新 BTC 统计
        if (fromSymbol === 'BTC') {
          this.btcPrice = '$' + (data.lastPrice || coin.lastPrice);
          this.btcChange = parseFloat(data.priceChangePercent || 0);
        }
      }
    }
  },
  
  created() {
    this.fetchHome();
    this.fetchNews();
    
    // 每 10 秒刷新
    this._timer = setInterval(() => this.fetchHome(), 10000);
  },
  
  mounted() {
    connect(this.onWsMessage);
  },
  
  beforeDestroy() {
    if (this._timer) clearInterval(this._timer);
  }
};
</script>

<style lang="scss" scoped>
.home-page {
  padding-bottom: var(--sp-xl);
}

.home-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--sp-lg) 0;
  
  .logo-text {
    font-size: var(--fs-xl);
    font-weight: 700;
    color: var(--text-1);
  }
  
  .search-input {
    width: 240px;
    @media (max-width: 480px) { width: 160px; }
  }
}

.market-overview {
  display: flex;
  gap: var(--sp-lg);
  margin-bottom: var(--sp-xl);
  padding: var(--sp-lg);
  background: var(--bg-white);
  border-radius: var(--radius-lg);
  
  .stat-item {
    display: flex;
    flex-direction: column;
    gap: var(--sp-xs);
    
    .stat-label { font-size: var(--fs-sm); color: var(--text-3); }
    .stat-value { font-size: var(--fs-lg); font-weight: 600; }
  }
}

.coin-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--sp-md);
  
  @media (max-width: 480px) { grid-template-columns: repeat(2, 1fr); gap: var(--sp-sm); }
  @media (min-width: 481px) and (max-width: 768px) { grid-template-columns: repeat(3, 1fr); }
}

.coin-card {
  cursor: pointer;
  transition: transform var(--transition-fast);
  
  &:hover { transform: translateY(-2px); }
  
  .coin-header {
    display: flex;
    align-items: center;
    gap: var(--sp-sm);
    margin-bottom: var(--sp-md);
    
    .coin-icon {
      width: 28px;
      height: 28px;
      border-radius: 50%;
    }
    
    .coin-info {
      display: flex;
      flex-direction: column;
      
      .coin-name { font-weight: 600; font-size: var(--fs-md); }
      .coin-pair { font-size: var(--fs-xs); color: var(--text-3); }
    }
  }
  
  .coin-price {
    margin-bottom: var(--sp-sm);
    .price-text { font-weight: 700; }
  }
  
  .coin-change {
    font-size: var(--fs-sm);
    margin-bottom: var(--sp-sm);
    font-weight: 600;
  }
  
  .coin-volume {
    display: flex;
    justify-content: space-between;
    font-size: var(--fs-xs);
    color: var(--text-3);
  }
}

.news-section {
  margin-top: var(--sp-xl);
  
  .section-title {
    font-size: var(--fs-lg);
    margin-bottom: var(--sp-md);
  }
  
  .news-scroll {
    display: flex;
    gap: var(--sp-md);
    overflow-x: auto;
    padding-bottom: var(--sp-sm);
    
    .news-item {
      display: flex;
      gap: var(--sp-sm);
      padding: var(--sp-sm) var(--sp-md);
      background: var(--bg-white);
      border-radius: var(--radius-round);
      white-space: nowrap;
      font-size: var(--fs-sm);
      flex-shrink: 0;
      
      .news-coin { font-weight: 600; }
      .news-change { font-weight: 600; }
    }
  }
}
</style>
