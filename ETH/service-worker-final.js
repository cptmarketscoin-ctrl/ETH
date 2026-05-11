// service-worker-final.js
// 拦截所有网络请求并代理

var API_PROXY = 'https://api.cptnexus.sbs';
var BASE_PATH = '/ETH';

console.log('[SW] Service Worker 正在加载...');

// 检查是否是静态资源
function isStatic(url) {
  return url.indexOf('/static/') !== -1 || 
         url.match(/\.(js|css|png|jpg|jpeg|gif|svg|woff|ttf|ico|woff2|mp4|webm|mp3)(\?|$)/);
}

// 拦截所有请求
self.addEventListener('fetch', function(event) {
  var url = event.request.url;
  
  // 跳过代理服务器本身的请求
  if (url.indexOf(API_PROXY) !== -1) {
    return;
  }
  
  var shouldProxy = false;
  var newUrl = url;
  
  // 如果是 GitHub Pages 域名
  if (url.indexOf('cptmarketscoin-ctrl.github.io') !== -1) {
    var urlPath = url.replace(/^https?:\/\/[^/]+/, '');
    
    // 静态资源不代理
    if (isStatic(urlPath)) {
      console.log('[SW] 跳过静态资源:', urlPath);
      return;
    }
    
    // 代理这个请求
    newUrl = API_PROXY + urlPath;
    shouldProxy = true;
    console.log('[SW] 代理请求:', url, '->', newUrl);
  }
  
  // 如果是相对路径
  if (!url.match(/^https?:\/\//) && !isStatic(url)) {
    newUrl = API_PROXY + BASE_PATH + '/' + url.replace(/^\//, '');
    shouldProxy = true;
    console.log('[SW] 代理相对路径:', url, '->', newUrl);
  }
  
  // 如果需要代理
  if (shouldProxy) {
    var fetchOptions = {
      method: event.request.method,
      headers: event.request.headers,
      mode: 'cors',
      credentials: 'omit',
      redirect: 'follow'
    };
    
    // 只有非 GET/HEAD 请求才包含 body
    if (event.request.method !== 'GET' && event.request.method !== 'HEAD') {
      fetchOptions.body = event.request.body;
    }
    
    event.respondWith(
      fetch(newUrl, fetchOptions).then(function(response) {
        console.log('[SW] 代理成功:', newUrl, response.status);
        return response;
      }).catch(function(error) {
        console.error('[SW] 代理失败:', error);
        // 代理失败，尝试原始请求
        return fetch(event.request);
      })
    );
  }
});

self.addEventListener('activate', function(event) {
  console.log('[SW] Service Worker 已激活');
  return self.clients.claim();
});

self.addEventListener('install', function(event) {
  console.log('[SW] Service Worker 已安装');
  event.skipWaiting();
});

console.log('[SW] Service Worker 加载完成');
