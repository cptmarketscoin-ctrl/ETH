// 重启后端服务
const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// 1. 杀掉占用8080端口的进程
try {
  const out = execSync('netstat -ano | findstr :8080', { encoding: 'utf8' });
  const lines = out.split('\n');
  for (const line of lines) {
    if (line.includes('LISTENING')) {
      const parts = line.trim().split(/\s+/);
      const pid = parts[parts.length - 1];
      if (pid) {
        try { execSync(`taskkill /F /PID ${pid}`); console.log(`已终止进程 ${pid}`); } catch(e) {}
      }
    }
  }
} catch(e) { console.log('没有需要终止的进程'); }

// 2. 等待2秒
setTimeout(() => {
  // 3. 启动新服务
  const log = fs.openSync(path.join(__dirname, 'server.log'), 'w');
  const child = spawn('node', ['server.js'], {
    cwd: __dirname,
    stdio: ['ignore', log, log],
    detached: true,
  });
  child.unref();
  console.log(`后端服务已启动 PID: ${child.pid}`);
}, 2000);
