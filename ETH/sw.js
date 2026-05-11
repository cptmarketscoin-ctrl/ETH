// Service Worker - 网络层代理 v1.1
var API_PROXY = 'https://api.cptnexus.sbs';
var BASE_PATH = '/ETH';
var CACHE_VERSION = 'v1.1';  // 版本号，修改后强制更新

self.addEventListener('install', function(event) {
  console.log('[SW] 安装中...');
  // 使用 self.skipWaiting() 而不是直接调用 event.skipWaiting()
  if (event && typeof event.skipWaiting === 'function') {
    event.skipWaiting();
  } else {
    self.skipWaiting();
  }
});

self.addEventListener('activate', function(event) {
  console.log('[SW] 激活中...', CACHE_VERSION);
  
  // 清除旧版本缓存，强制更新
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
  
  // ❗ 跳过 Hash URL（客户端路由）
  if (url.indexOf('#') !== -1) {
    console.log('[SW] 跳过 Hash URL:', url);
    return;
  }
  
  var urlPath = url.replace(/^https?:\/\/[^/]+/, '');
  var shouldProxy = false;
  var newUrl = url;
  
  // 检查是否是静态资源
  function isStatic(urlStr) {
    return urlStr.indexOf('/static/') !== -1 ||
           urlStr.match(/\.(js|css|png|jpg|jpeg|gif|svg|woff|ttf|ico|woff2|mp4|webm)(\?|$)/);
  }
  
  // GitHub Pages 域名的请求
  if (url.indexOf('cptmarketscoin-ctrl.github.io') !== -1) {
    if (isStatic(urlPath)) {
      return; // 静态资源不代理
    }
    newUrl = API_PROXY + urlPath;
    shouldProxy = true;
    console.log('[SW] 代理:', url, '->', newUrl);
  }
  
  // 相对路径
  if (!url.match(/^https?:\/\//) && !isStatic(url)) {
    newUrl = API_PROXY + BASE_PATH + '/' + url.replace(/^\//, '');
    shouldProxy = true;
    console.log('[SW] 代理相对路径:', url, '->', newUrl);
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
        return fetch(event.request);
      })
    );
  }
});

console.log('[SW] Service Worker 已加载');
