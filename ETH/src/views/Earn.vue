<template>
  <div class="earn-page">
    <header class="e-header"><h2>Earn</h2></header>

    <!-- Loan -->
    <div class="e-card">
      <div class="e-icon"><i class="el-icon-money" style="font-size:32px;color:var(--primary)" /></div>
      <h3>Loan</h3>
      <p class="e-sub">Borrow with peace of mind</p>
      <p class="e-desc">Safe and flexible borrowing to improve fund utilization</p>
      <el-button type="primary" size="small" round>Borrow Now</el-button>
    </div>

    <!-- ICO -->
    <div class="e-card">
      <div class="e-icon"><i class="el-icon-s-promotion" style="font-size:32px;color:var(--up)" /></div>
      <h3>ICO</h3>
      <p class="e-sub">Invest in newly issued tokens</p>
      <p class="e-desc">Enjoy potentially high return opportunities. Start your ICO journey.</p>
      <el-button type="primary" size="small" round>View ICO Projects</el-button>
    </div>

    <!-- Fast plate actions -->
    <div class="e-actions">
      <div class="e-act"><i class="el-icon-upload2" /><span>Deposit</span></div>
      <div class="e-act"><i class="el-icon-download" /><span>Withdraw</span></div>
      <div class="e-act"><i class="el-icon-s-promotion" /><span>ICO</span></div>
      <div class="e-act"><i class="el-icon-money" /><span>Loan</span></div>
    </div>

    <div style="height:60px"></div>
  </div>
</template>

<script>
export default { name: 'EarnPage' };
</script>

<style scoped>
.earn-page { padding: .133rem .16rem .8rem; min-height: 100vh; }
.e-header h2 { font-size: .213rem; font-weight: 700; margin-bottom: .133rem; }

.e-card { background: var(--bg-white); border-radius: .107rem; padding: .213rem; margin-bottom: .133rem; border: 1px solid var(--border-1); text-align: center; }
.e-card h3 { font-size: .2rem; margin: .08rem 0 .053rem; }
.e-sub { font-size: .16rem; color: var(--text-2); }
.e-desc { font-size: .133rem; color: var(--text-3); margin: .08rem 0 .133rem; }

.e-actions { display: grid; grid-template-columns: repeat(4,1fr); gap: .107rem; margin-top: .133rem; }
.e-act { display: flex; flex-direction: column; align-items: center; gap: .053rem; padding: .16rem; background: var(--bg-white); border-radius: .107rem; border: 1px solid var(--border-1); font-size: .133rem; }
.e-act i { font-size: .267rem; color: var(--primary); }
</style>
