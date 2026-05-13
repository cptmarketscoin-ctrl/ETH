<template>
<div class="login-page">
  <h2 style="font-size:24.96px;font-weight:600;text-align:center;padding:30px 0 20px">Sign in</h2>
  <div style="max-width:340px;margin:0 auto;padding:0 20px">
    <div style="margin-bottom:16px"><label style="font-size:14px;color:rgb(196,196,196);display:block;margin-bottom:6px">UserName</label><el-input v-model="uname" placeholder="Enter username" size="medium"/></div>
    <div style="margin-bottom:16px"><label style="font-size:14px;color:rgb(196,196,196);display:block;margin-bottom:6px">Login password</label><el-input v-model="pass" placeholder="Enter password" type="password" size="medium" show-password/></div>
    <div style="text-align:right;margin-bottom:20px"><span style="font-size:13px;color:#14a1f3;cursor:pointer">Forgot password?</span></div>
    <el-button type="primary" style="width:100%;height:46px;font-size:16px;font-weight:600;border-radius:8px" @click="login" :loading="loading">Sign in</el-button>
    <div style="font-size:12px;color:#999;margin-top:16px;text-align:center;line-height:1.6">Logging in implies agreement <a style="color:#14a1f3">Terms of Service</a>、<a style="color:#14a1f3">Privacy Policy</a>、<a style="color:#14a1f3">Anti-Money Laundering</a></div>
    <div style="text-align:center;margin-top:16px;font-size:14px;color:#999">Don't have an account? <span style="color:#14a1f3;cursor:pointer">Sign up</span></div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:40px 16px">
    <div style="background:#1c1c1e;border-radius:8px;padding:20px 16px;text-align:center;border:1px solid #31353d"><div style="font-size:28px;color:#14a1f3">$</div><h3 style="font-size:18px;font-weight:700;margin:8px 0">Loan</h3><p style="font-size:13px;color:rgb(196,196,196);margin-bottom:12px">Borrow with peace of mind</p><span style="font-size:14px;color:#14a1f3;font-weight:600;cursor:pointer">Click to view</span></div>
    <div style="background:#1c1c1e;border-radius:8px;padding:20px 16px;text-align:center;border:1px solid #31353d"><div style="font-size:28px;color:#14a1f3">◆</div><h3 style="font-size:18px;font-weight:700;margin:8px 0">ICO</h3><p style="font-size:13px;color:rgb(196,196,196);margin-bottom:12px">Invest in newly issued tokens</p><span style="font-size:14px;color:#14a1f3;font-weight:600;cursor:pointer">Start your ICO journey</span></div>
  </div>
  <div style="height:60px"/>
</div>
</template>

<script>
import { login } from '../api';
export default { name:'EarnPage', data:()=>({uname:'',pass:'',loading:false}), methods:{async login(){if(!this.uname||!this.pass)return this.$message.warning('Enter credentials');this.loading=true;try{const r=await login(this.uname,this.pass);if(r.code===200){this.$message.success('Login successful');localStorage.setItem('cpt_token',r.data?.token||'')}else{this.$message.error(r.msg||'Login failed')}}catch(e){this.$message.error(e.message)}this.loading=false}} };
</script>
