/**
 * 价格格式化 — 按金额分档小数位
 * 
 * >= $1000 → 2位
 * >= $1    → 3位
 * >= $0.01 → 4位
 * < $0.01  → 6位
 */
export function fmtPrice(p) {
  const n = typeof p === 'string' ? parseFloat(p) : p;
  if (isNaN(n) || n === 0) return '0.00';
  if (n >= 1000) return n.toFixed(2);
  if (n >= 1) return n.toFixed(3);
  if (n >= 0.01) return n.toFixed(4);
  return n.toFixed(6);
}

/**
 * 涨跌幅格式化
 */
export function fmtChange(change) {
  const n = typeof change === 'string' ? parseFloat(change) : change;
  if (isNaN(n)) return '0.00';
  const sign = n > 0 ? '+' : '';
  return sign + n.toFixed(2);
}

/**
 * 成交量格式化 (K/M/B)
 */
export function fmtVolume(vol) {
  const n = typeof vol === 'string' ? parseFloat(vol) : vol;
  if (isNaN(n)) return '0';
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(2) + 'K';
  return n.toFixed(2);
}

/**
 * 金额格式化 (加千分位分隔)
 */
export function fmtCurrency(n) {
  const num = typeof n === 'string' ? parseFloat(n) : n;
  if (isNaN(num)) return '0.00';
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
