$html = Get-Content -Path "index.html" -Raw

# Fix 1: Expose proxyUrl to global (add before the closing } of first IIFE)
$html = $html -replace '(window\.WebSocket\.CLOSED = origWS\.CLOSED;\s*)\}\)\(\);', '$1  window.__PROXY_URL__ = PROXY;
  window.__proxyUrl__ = proxyUrl;
$1}());'

# Fix 2: Rewrite createElement interceptor to also handle <img> and use window.__proxyUrl__
$oldInterceptor = '\(function\(\) \{\s*var origCreate = document\.createElement[\s\S]*?\}\)\(\);</script>'
$newInterceptor = '<script>
// Fix webpack publicPath for /ETH/ subdirectory
// Override document.createElement to fix script/img src paths
(function() {
  var proxyUrl = window.__proxyUrl__ || function(url) {
    var PROXY = window.__PROXY_URL__ || "https://victory-suffered-annually-premiere.trycloudflare.com";
    if (PROXY && typeof url === "string" && url.startsWith("/") && !url.startsWith("//") && !url.startsWith(PROXY)) {
      return PROXY + url;
    }
    return url;
  };
  var origCreate = document.createElement;
  document.createElement = function(tag) {
    var el = origCreate.call(document, tag);
    var tagName = (tag || "").toLowerCase();
    if (tagName === "script" || tagName === "img") {
      var setAttribute = el.setAttribute;
      el.setAttribute = function(name, value) {
        if ((name === "src" || name === "href") && typeof value === "string") {
          value = proxyUrl(value);
        }
        return setAttribute.call(this, name, value);
      };
      try {
        var proto = tagName === "script" ? HTMLScriptElement.prototype : HTMLImageElement.prototype;
        var desc = Object.getOwnPropertyDescriptor(proto, "src");
        if (desc && desc.set) {
          Object.defineProperty(el, "src", {
            set: function(value) {
              value = proxyUrl(value);
              return desc.set.call(this, value);
            },
            get: function() { return desc.get.call(this); },
            configurable: true
          });
        }
      } catch(e) {}
    }
    return el;
  };
})();
</script>'

$html = $html -replace $oldInterceptor, $newInterceptor

Set-Content -Path "index.html" -Value $html -NoNewline -Encoding UTF8
Write-Host "index.html updated successfully"
