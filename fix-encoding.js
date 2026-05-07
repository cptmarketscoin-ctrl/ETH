const fs = require('fs');
const path = require('path');

const file = process.argv[2] || 'public/admin-app.js';

// 读取文件的二进制内容
let buf = fs.readFileSync(file);

// 检查并移除 UTF-8 BOM (EF BB BF)
if (buf[0] === 0xEF && buf[1] === 0xBB && buf[2] === 0xBF) {
  console.log('[Fix] Removing UTF-8 BOM');
  buf = buf.slice(3);
}

// 转换为字符串，替换可能导致问题的特殊字符
let content = buf.toString('utf8');

// 替换所有非 ASCII 的 icon 字符为 ASCII 替代
// 这些特殊字符可能导致解析问题
const iconMap = {
  '◈': 'â',
  'â': 'â',
  'ï¼': 'â',
  'ð': 'â',
  'ï¿': 'âµ',
  'â': 'â',
  'â': 'â',
  'ð': 'â±',
  'ð': 'â¨',
  'ð': 'â',
  'â¦': 'â¦',
  'â': 'â',
  'â': 'â',
  'â®': 'â®',
  'ð': 'â',
  'â': 'â',
  'â ': 'â ',
  'â ': 'â ',
};

// 更简单的方法：直接替换 NAV_ITEMS 中的 icon 为 ASCII
content = content.replace(
  /const NAV_ITEMS = \[[\s\S]*?\];/,
  () => {
    return `const NAV_ITEMS = [
  {key:'dashboard', icon:'â', text:'DASHBOARD'},
  {key:'users',     icon:'â¤', text:'USERS'},
  {key:'orders',    icon:'â', text:'ORDERS'},
  {key:'positions', icon:'â', text:'POSITIONS'},
  {key:'flows',     icon:'ð', text:'FLOWS'},
  {key:'coins',     icon:'â',  text:'COINS'},
  {key:'market',    icon:'â', text:'MARKET'},
  {key:'inject',    icon:'ð', text:'INJECT'},
  {key:'restrict',  icon:'ð', text:'RESTRICT'},
  {key:'command',   icon:'â', text:'COMMAND'},
  {key:'controls',  icon:'â®', text:'CONTROLS'},
  {key:'logs',      icon:'â', text:'LOGS'},
  {key:'sql',       icon:'â¥',  text:'SQL'},
  {key:'config',    icon:'â', text:'CONFIG'},
  {key:'danger',    icon:'â ', text:'DANGER ZONE'},
];`;
  }
);

// 写回文件（UTF-8 无 BOM）
fs.writeFileSync(file, content, 'utf8');
console.log('[Fix] Done! File:', file);
console.log('[Fix] Size:', fs.statSync(file).size, 'bytes');

// 验证语法
const { execSync } = require('child_process');
try {
  execSync('node --check "' + file + '"', { stdio: 'inherit' });
  console.log('â Syntax OK');
} catch(e) {
  console.log('â Syntax Error - need to fix manually');
}
