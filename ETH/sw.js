// Service Worker - 网络层代理 v2.2
// 静态资源走 GitHub Pages CDN，API 代理到后端
var API_PROXY = 'https://api.cptnexus.sbs';
var BASE_PATH = '/ETH';
var CACHE_VERSION = 'v3.0';

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

// 只检查路径（不含?参数），判断是否静态资源
function isStatic(urlStr) {
  var p = urlStr.split('?')[0].split('#')[0];
  return p.indexOf('/static/') !== -1 ||
         p.match(/\.(js|css|png|jpg|jpeg|gif|svg|woff|ttf|ico|woff2|mp4|webm|json|txt|html)$/) ||
         p.match(/\/ETH\/?$/);
}

self.addEventListener('fetch', function(event) {
  var url = event.request.url;
  if (url.indexOf(API_PROXY) !== -1) return;
  if (url.indexOf('#') !== -1) return;

  var isRelative = !url.match(/^https?:\/\//);
  var isOurDomain = url.indexOf('cptmarketscoin-ctrl.github.io') !== -1;
  if (!isRelative && !isOurDomain) return;

  var urlPath = url.replace(/^https?:\/\/[^/]+/, '');
  var urlPathOnly = urlPath.split('?')[0].split('#')[0];

  // 静态资源不代理（只看路径，不含查询参数）
  if (isStatic(urlPathOnly)) {
    console.log('[SW] 静态放行:', urlPathOnly);
    return;
  }

  // 代理到后端
  var newUrl = API_PROXY + urlPath;
  console.log('[SW] 代理:', urlPathOnly, '->', newUrl);

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
