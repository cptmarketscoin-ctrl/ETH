<template>
<div class="login-page">
  <h2>Sign in</h2>

  <div class="lg-form">
    <div class="lg-field">
      <label>UserName</label>
      <el-input v-model="username" placeholder="Enter username" size="medium"/>
    </div>
    <div class="lg-field">
      <label>Login password</label>
      <el-input v-model="password" placeholder="Enter password" type="password" size="medium" show-password/>
    </div>

    <div class="lg-forgot">
      <span>Forgot password?</span>
    </div>

    <el-button type="primary" class="lg-btn" @click="login" :loading="loading">Sign in</el-button>

    <div class="lg-terms">
      Logging in implies agreement <a>Terms of Service</a> 、 <a>Privacy Policy</a> 、 <a>Anti-Money Laundering</a>
    </div>

    <div class="lg-signup">
      Don't have an account? <span @click="$router.push('/register')">Sign up</span>
    </div>
  </div>

  <!-- Also show Earn content below login -->
  <div class="lg-earn">
    <div class="ei-section">
      <div class="ei-card">
        <div class="ei-icon">$</div>
        <h3>Loan</h3>
        <p>Borrow with peace of mind</p>
        <span class="ei-cta">Click to view</span>
      </div>
      <div class="ei-card">
        <div class="ei-icon">◆</div>
        <h3>ICO</h3>
        <p>Invest in newly issued tokens</p>
        <span class="ei-cta">Start your ICO journey</span>
      </div>
    </div>
  </div>
  <div style="height:80px"/>
</div>
</template>

<script>
import { login } from '../api';
export default { name:'EarnPage', data:()=>({username:'',password:'',loading:false}), methods:{async login(){if(!this.username||!this.password)return this.$message.warning('Enter credentials');this.loading=true;try{const r=await login(this.username,this.password);if(r.code===200){this.$message.success('Login successful');localStorage.setItem('cpt_token',r.data?.token||'');}else{this.$message.error(r.msg||'Login failed')}}catch(e){this.$message.error(e.message)}this.loading=false}} };
</script>

<style scoped>
.login-page{padding:32px 24px;min-height:100vh;text-align:center}
h2{font-size:24.96px;font-weight:600;color:#fff;margin-bottom:32px}
.lg-form{max-width:340px;margin:0 auto}
.lg-field{margin-bottom:16px;text-align:left}
.lg-field label{display:block;font-size:14px;color:rgb(196,196,196);margin-bottom:6px}
.lg-forgot{text-align:right;margin-bottom:24px}
.lg-forgot span{font-size:13px;color:#14a1f3;cursor:pointer}
.lg-btn{width:100%;height:46px;font-size:16px;font-weight:600;border-radius:8px}
.lg-terms{font-size:12px;color:#999;margin-top:20px;line-height:1.6}
.lg-terms a{color:#14a1f3}
.lg-signup{font-size:14px;color:#999;margin-top:16px}
.lg-signup span{color:#14a1f3;cursor:pointer}

.lg-earn{margin-top:40px}
.ei-section{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.ei-card{background:#32353c;border-radius:8px;padding:20px 16px;text-align:center;border:1px solid #31353d}
.ei-icon{font-size:28px;color:#14a1f3;font-style:normal;margin-bottom:8px}
.ei-card h3{font-size:18px;font-weight:700;color:#fff;margin-bottom:6px}
.ei-card p{font-size:13px;color:rgb(196,196,196);margin-bottom:12px}
.ei-cta{font-size:14px;color:#14a1f3;font-weight:600;cursor:pointer}
</style>
