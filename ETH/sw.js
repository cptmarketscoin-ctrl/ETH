// Service Worker - 网络层代理 v1.4
// 与 index.html 内联代理逻辑保持一致
var API_PROXY = 'https://api.cptnexus.sbs';
var BASE_PATH = '/ETH';
var CACHE_VERSION = 'v1.5';  // v1.5: CPT品牌修复+图标+K线数据

self.addEventListener('install', function(event) {
  console.log('[SW] 安装中...', CACHE_VERSION);
  if (event && typeof event.skipWaiting === 'function') {
    event.skipWaiting();
  } else {
    self.skipWaiting();
  }
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

// 检查是否是静态资源
function isStatic(urlStr) {
  return urlStr.indexOf('/static/') !== -1 ||
         urlStr.indexOf('/ETH/static/') === 0 ||
         urlStr.indexOf('/ETH/img/') === 0 ||
         urlStr.indexOf('/img/') === 0 ||
         urlStr.match(/\.(js|css|png|jpg|jpeg|gif|svg|woff|ttf|ico|woff2|mp4|webm|json|txt)(\?|$)/) ||
         urlStr.indexOf('.js?') !== -1 ||
         urlStr.indexOf('.css?') !== -1;
}

self.addEventListener('fetch', function(event) {
  var url = event.request.url;

  // 跳过代理服务器本身的请求
  if (url.indexOf(API_PROXY) !== -1) return;

  // 跳过 Hash URL（客户端路由）
  if (url.indexOf('#') !== -1) {
    console.log('[SW] 跳过 Hash URL:', url);
    return;
  }

  var urlPath = url.replace(/^https?:\/\/[^/]+/, '');
  var shouldProxy = false;
  var newUrl = url;

  // 🔧 修复：ETH/undefined → 重定向到有效路径
  if (urlPath.indexOf('/ETH/undefined') !== -1) {
    urlPath = urlPath.replace(/\/ETH\/undefined/g, '/ETH');
    newUrl = API_PROXY + urlPath;
    shouldProxy = true;
    console.log('[SW] Fixed undefined fileId:', url, '->', newUrl);
  }

  // 静态资源不代理
  if (isStatic(urlPath)) {
    console.log('[SW] 静态资源不代理:', url);
    return;
  }

  // 排除外部 CDN 域名 - 只代理 GitHub Pages 域名的请求
  var isRelative = !url.match(/^https?:\/\//);
  var isOurDomain = url.indexOf('cptmarketscoin-ctrl.github.io') !== -1;
  if (!isRelative && !isOurDomain) {
    return; // 外部域名直接放行
  }

  // 全量代理到后端
  if (!shouldProxy) {
    newUrl = API_PROXY + urlPath;
    shouldProxy = true;
    console.log('[SW] 代理:', url, '->', newUrl);
  }

  if (shouldProxy) {
    event.respondWith(
      fetch(newUrl, {
        method: event.request.method,
        headers: event.request.headers,
        body: (event.request.method !== 'GET' && event.request.method !== 'HEAD') ? event.request.body : undefined,
        mode: 'cors',
        credentials: 'omit'
      }).catch(function(error) {
        console.error('[SW] 代理失败:', error);
        // 代理失败，尝试原始请求
        return fetch(event.request);
      })
    );
  }
});

console.log('[SW] Service Worker 已加载', CACHE_VERSION);
