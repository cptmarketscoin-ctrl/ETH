<template>
<div class="layout">
  <div class="header-container is-fixed is-small w-full flex justify-center max-h is-scrolly">
    <header id="header_main" class="header max-h">
      <div class="container-fluid max-h w-100">
        <div class="header__body d-flex justify-content-between max-h">
          <div class="header__left"><div class="logo"><span class="logo-text">CPT Exchange</span></div></div>
          <div class="header__right">
            <div class="mobile-connect" @click="$router.push('/earn')"><span>Connect</span></div>
          </div>
        </div>
      </div>
    </header>
  </div>
  <div class="h-50px" style="height:50px"></div>
  <div class="router-container"><router-view /></div>
  <div class="my-tabbar">
    <div class="van-tabbar__placeholder" style="height:54px">
      <div class="van-hairline--top-bottom van-tabbar van-tabbar--fixed">
        <div v-for="(t,i) in tabs" :key="i" class="van-tabbar-item" :class="{'van-tabbar-item--active':active===i}" :style="{color:active===i?'rgb(255,255,255)':''}" @click="go(i,t.path)">
          <div class="van-tabbar-item__icon"><i :class="t.icon"/></div>
          <div class="van-tabbar-item__text"><span>{{t.name}}</span></div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default { name:'App', data:()=>({active:0, tabs:[{name:'Home',path:'/',icon:'iconfont icon-a-home1'},{name:'Market',path:'/market',icon:'iconfont icon-hangqing'},{name:'Trade',path:'/trade',icon:'iconfont icon-Market'},{name:'Earn',path:'/earn',icon:'iconfont icon-Market'},{name:'Assets',path:'/assets',icon:'iconfont icon-business'}]}), methods:{go(i,p){this.active=i;this.$router.push(p)}}, watch:{'$route'(to){const m={'/':0,'/market':1,'/trade':2,'/earn':3,'/assets':4};this.active=m[to.path]!=null?m[to.path]:this.active}} };
</script>
