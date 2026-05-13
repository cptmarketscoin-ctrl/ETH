const WS_BASE = (window.__KLAKNA_PROXY__ || 'https://api.cptnexus.sbs')
  .replace(/^https/, 'wss');

let ws = null;
let listeners = [];
let reconnectTimer = null;
let pingTimer = null;

export function connect(onMessage) {
  if (listeners.includes(onMessage)) return;
  listeners.push(onMessage);
  
  if (ws && ws.readyState === WebSocket.OPEN) return;
  doConnect();
}

function doConnect() {
  try {
    ws = new WebSocket(`${WS_BASE}/exchange/ws`);
    
    ws.onopen = () => {
      console.log('[WS] Connected');
      if (pingTimer) clearInterval(pingTimer);
      pingTimer = setInterval(() => {
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send('ping');
        }
      }, 10000);
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data === 'pong') return;
        listeners.forEach(fn => fn(data));
      } catch (e) {
        // ignore non-JSON
      }
    };
    
    ws.onclose = () => {
      console.log('[WS] Disconnected, reconnecting in 3s...');
      if (pingTimer) clearInterval(pingTimer);
      reconnectTimer = setTimeout(doConnect, 3000);
    };
    
    ws.onerror = () => {
      ws?.close();
    };
  } catch (e) {
    reconnectTimer = setTimeout(doConnect, 3000);
  }
}

export function disconnect() {
  listeners = [];
  if (reconnectTimer) clearTimeout(reconnectTimer);
  if (pingTimer) clearInterval(pingTimer);
  if (ws) ws.close();
  ws = null;
}

export default { connect, disconnect };
