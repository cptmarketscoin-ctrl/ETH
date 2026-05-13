<template>
  <div id="app" class="app-container">
    <!-- 主内容区 -->
    <div class="app-content" :class="{ 'has-tabbar': showTabBar }">
      <router-view />
    </div>
    
    <!-- 底部导航 (仅移动端显示) -->
    <van-tabbar 
      v-model="active" 
      :fixed="true" 
      :border="true"
      :safe-area-inset-bottom="true"
      class="app-tabbar"
    >
      <van-tabbar-item to="/" icon="home-o">Home</van-tabbar-item>
      <van-tabbar-item to="/market" icon="chart-trending-o">Markets</van-tabbar-item>
      <van-tabbar-item to="/trade" icon="gold-coin-o">Trade</van-tabbar-item>
      <van-tabbar-item to="/assets" icon="balance-o">Assets</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      active: 0
    };
  },
  computed: {
    showTabBar() {
      // 交易详情页不显示 tabbar
      const noTabRoutes = ['/trade/BTC', '/trade/ETH'];
      return !noTabRoutes.includes(this.$route.path);
    }
  },
  watch: {
    $route(to) {
      const map = { '/': 0, '/market': 1, '/trade': 2, '/assets': 3 };
      this.active = map[to.path] !== undefined ? map[to.path] : this.active;
    }
  }
};
</script>

<style lang="scss">
.app-container {
  min-height: 100vh;
  background: var(--bg);
}

.app-content {
  padding-bottom: 60px; /* 给 tabbar 留空间 */
  
  &.has-tabbar {
    padding-bottom: 60px;
  }
}

.app-tabbar {
  --van-tabbar-item-active-color: var(--primary);
}

/* 桌面端隐藏 tabbar，用侧边栏或顶栏 */
@media (min-width: 769px) {
  .app-tabbar {
    display: none;
  }
  .app-content {
    padding-bottom: 0;
  }
}
</style>
