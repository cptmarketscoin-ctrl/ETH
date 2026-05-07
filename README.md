# Klakna 前端 - GitHub Pages 部署包

## 文件结构
```
index.html          ← 入口页面（已注入 API 代理脚本）
static/
  css/
    app.1774378911945.css
    chunk-vendors.1774378911945.css
  js/
    app.1774378911945.js
    chunk-vendors.1774378911945.js
```

## 部署步骤

### 1. 修改 API 代理地址
编辑 `index.html`，找到第 29 行：
```js
var KLAKNA_API_PROXY = 'https://your-server.com';
```

**改成你的后端服务器地址**，例如：
```js
// 方案 A：后端在 VPS 上
var KLAKNA_API_PROXY = 'https://your-vps-ip:8080';

// 方案 B：前后端同域
var KLAKNA_API_PROXY = '';  // 留空，不走代理

// 方案 C：本机测试
var KLAKNA_API_PROXY = 'http://localhost:8080';
```

### 2. 上传到 GitHub Pages
1. 在 GitHub 创建仓库（如 `BTC`）
2. 将整个文件夹内容 push 到 `main` 分支
3. 在仓库 Settings → Pages 中启用 GitHub Pages

### 3. 确保后端 API 允许跨域（CORS）
如果 `KLAKNA_API_PROXY` 指向不同域名，后端需设置 CORS 头：
```js
res.setHeader('Access-Control-Allow-Origin', 'https://your-github-pages.io');
```

---
原站资源 hash：1774378911945
抓取时间：2026-05-07
