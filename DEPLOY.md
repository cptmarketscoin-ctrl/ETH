# ETH 仓库部署说明

## 部署到 GitHub Pages

### 方法一：运行脚本（推荐）

1. 双击 `push-to-github.bat`
2. 输入用户名：`cptmarketscoin-ctrl`  
3. 密码处输入 **Personal Access Token (PAT)**
   - 获取地址：https://github.com/settings/tokens
   - 需要勾选 `repo` 权限

### 方法二：手动 Git 命令

```bash
cd eth-deploy/
git init
git remote add origin https://github.com/cptmarketscoin-ctrl/ETH.git
git checkout -B main
git add -A
git commit -m "Deploy: klakna exchange frontend"
git push origin main --force
```

---

## 开启 GitHub Pages

推送完成后，到以下页面开启：

👉 https://github.com/cptmarketscoin-ctrl/ETH/settings/pages

设置：
- **Source**: Deploy from a branch
- **Branch**: `main`
- **Folder**: `/ (root)`

点击 **Save** 后等待约 1-2 分钟即可访问：  
👉 https://cptmarketscoin-ctrl.github.io/ETH/

---

## 配置 API 地址

编辑 `index.html` 第一行，修改：
```javascript
var KLAKNA_API_PROXY="https://your-server.com";
```

- 本地测试：`http://localhost:8080`
- 正式服务器：`https://你的域名.com`
- 不需要后端（纯前端）：`""`

---

## 后端 CORS 配置

后端 `server.js` 需要允许跨域：
```javascript
res.header('Access-Control-Allow-Origin', 'https://cptmarketscoin-ctrl.github.io');
```
