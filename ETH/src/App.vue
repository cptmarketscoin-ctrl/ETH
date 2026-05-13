<template>
<div id="app" class="app">
  <!-- Header: klakna.sbs exact structure -->
  <div class="header-container is-fixed is-small w-full flex justify-center max-h mobile-height is-scrolly">
    <header id="header_main" class="header max-h">
      <div class="container-fluid max-h w-100">
        <div class="header__body d-flex justify-content-between max-h">
          <div class="header__left">
            <div class="logo">
              <span class="logo-text">CPT Exchange</span>
            </div>
          </div>
          <div class="header__right">
            <div class="mobile-connect"><span>Connect</span></div>
          </div>
        </div>
      </div>
    </header>
  </div>

  <!-- Content -->
  <div class="h-50px"></div>
  <div class="router-container">
    <router-view />
  </div>

  <!-- Tabbar: klakna.sbs exact structure -->
  <div class="my-tabbar">
    <div class="van-tabbar__placeholder" style="height:54px">
      <div class="van-hairline--top-bottom van-tabbar van-tabbar--fixed">
        <div v-for="(tab,i) in tabs" :key="i" class="van-tabbar-item" :class="{'van-tabbar-item--active':active===i}" :style="{color:active===i?'#fff':'#999'}" @click="go(i,tab.path)">
          <div class="van-tabbar-item__icon"><i :class="tab.icon"></i></div>
          <div class="van-tabbar-item__text"><span>{{tab.name}}</span></div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default { name:'App', data:()=>({active:0, tabs:[{name:'Home',path:'/',icon:'iconfont icon-a-home1'},{name:'Market',path:'/market',icon:'iconfont icon-hangqing'},{name:'Trade',path:'/trade',icon:'iconfont icon-Market'},{name:'Earn',path:'/earn',icon:'iconfont icon-Market'},{name:'Assets',path:'/assets',icon:'iconfont icon-business'}]}), methods:{go(i,path){this.active=i;this.$router.push(path)}}, watch:{$route(to){const m={'/':0,'/market':1,'/trade':2,'/earn':3,'/assets':4};this.active=m[to.path]!==undefined?m[to.path]:this.active}} };
</script>

<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#151517;color:#fff;font-family:-apple-system,BlinkMacSystemFont,"Helvetica Neue",Helvetica,"Segoe UI",Arial,Roboto,"PingFang SC",miui,"Hiragino Sans GB","Microsoft Yahei",sans-serif;-webkit-font-smoothing:antialiased}
.app{min-height:100vh}

/* Header — klakna.sbs exact */
.header-container{position:fixed;top:0;left:0;right:0;z-index:100;background:#161a1e;height:50px;display:flex;align-items:center;padding:0 10px}
.header{width:100%;max-height:50px}
.header__body{display:flex;justify-content:space-between;align-items:center;height:50px}
.logo-text{font-size:18.72px;font-weight:600;color:#fff}
.mobile-connect span{font-size:13.533px;color:rgb(196,196,196);cursor:pointer}
.h-50px{height:50px}

/* Tabbar — klakna.sbs exact */
.van-tabbar--fixed{position:fixed;bottom:0;left:0;right:0;background:#09090b;display:flex;z-index:100}
.van-tabbar-item{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:6px 0;font-size:11px;color:#999;cursor:pointer}
.van-tabbar-item--active{color:#fff}
.van-tabbar-item__icon i{font-size:22px;font-style:normal;margin-bottom:2px}
.van-tabbar-item__text span{font-size:10px}
.van-tabbar__placeholder{height:54px}

/* iconfont simple replacements */
.iconfont::before{content:attr(data-icon)}
.icon-a-home1::before{content:'🏠';font-size:18px}
.icon-hangqing::before{content:'📊';font-size:18px}
.icon-Market::before{content:'💱';font-size:18px}
.icon-business::before{content:'👛';font-size:18px}
</style>
