// Service Worker - 网络层代理 v2.0
// 所有请求统一代理到后端，由后端 express.static 提供静态文件
var API_PROXY = 'https://api.cptnexus.sbs';
var BASE_PATH = '/ETH';
var CACHE_VERSION = 'v2.1';

self.addEventListener('install', function(event) {
  console.log('[SW] 安装中...', CACHE_VERSION);
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  console.log('[SW] 激活中...', CACHE_VERSION);
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_VERSION) {
            console.log('[SW] 删除旧缓存:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(function() {
      console.log('[SW] 已激活新版本', CACHE_VERSION);
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(event) {
  var url = event.request.url;

  // 跳过代理服务器本身的请求
  if (url.indexOf(API_PROXY) !== -1) return;

  // 跳过 Hash URL（客户端路由）
  if (url.indexOf('#') !== -1) return;

  // 排除外部域名 - 只代理 GitHub Pages 域名的请求
  var isRelative = !url.match(/^https?:\/\//);
  var isOurDomain = url.indexOf('cptmarketscoin-ctrl.github.io') !== -1;
  if (!isRelative && !isOurDomain) return;

  var urlPath = url.replace(/^https?:\/\/[^/]+/, '');

  // 🔧 修复：ETH/undefined → 重定向
  if (urlPath.indexOf('/ETH/undefined') !== -1) {
    urlPath = urlPath.replace(/\/ETH\/undefined/g, '/ETH');
  }

  // 统一代理到后端
  var newUrl = API_PROXY + urlPath;
  console.log('[SW] 代理:', url, '->', newUrl);

  event.respondWith(
    fetch(newUrl, {
      method: event.request.method,
      headers: event.request.headers,
      body: (event.request.method !== 'GET' && event.request.method !== 'HEAD') ? event.request.body : undefined,
      mode: 'cors',
      credentials: 'omit'
    }).catch(function(error) {
      console.error('[SW] 代理失败:', error);
      return fetch(event.request);
    })
  );
});

console.log('[SW] Service Worker 已加载', CACHE_VERSION);
