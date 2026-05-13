import axios from 'axios';

const BASE = window.__KLAKNA_PROXY__ || 'https://api.cptnexus.sbs';

// 创建 axios 实例
const api = axios.create({
  baseURL: BASE,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
});

// 通用 POST 请求
async function post(path, data = {}) {
  try {
    const res = await api.post(path, data);
    return res.data;
  } catch (err) {
    console.error('[API]', path, err.message);
    return { code: 'ERROR', message: err.message };
  }
}

// 首页数据
export function pageHome() {
  return post('/exchange/Home/pageHome');
}

// 全币种行情
export function tickerList() {
  return post('/exchange/RockieGoldNewStockController/tickerList');
}

// 新闻列表
export function getStockList() {
  return post('/exchange/RockieNews/getStockList');
}

// 币种图标 URL
export function coinIcon(symbol) {
  return `${BASE}/exchange/rockieFile/getFile?fileId=/ETH/static/img/${symbol}.png`;
}

// 多语言字典
export function getDict(name, page = 0, size = 9999) {
  return post(`/exchange/RockieMessage/getDict?name=${name}&page=${page}&size=${size}`);
}

// 交易对配置
export function getServe(protocolType = 15) {
  return post(`/exchange/RockieMessage/getServe?protocolType=${protocolType}`);
}

// 用户登录
export function login(userName, userPassword) {
  return post('/user/login', { userName, userPassword });
}

// 用户注册
export function register(data) {
  return post('/user/register', data);
}

// 获取用户信息
export function getUserInfo() {
  return post('/user/info');
}

// 钱包余额
export function walletList() {
  return post('/exchange/walletAccount/list');
}

// 订单簿
export function orderBook(symbol) {
  return post('/exchange/newStockCoinTrade/orderBook', { symbol });
}

// 下单
export function placeOrder(data) {
  return post('/exchange/newStockCoinTrade/placeOrder', data);
}

// 当前委托
export function currentOrders(symbol) {
  return post('/exchange/newStockCoinTrade/orders', { symbol });
}

// 历史成交
export function orderHistory(symbol) {
  return post('/exchange/newStockCoinTrade/history', { symbol });
}

// 撤单
export function cancelOrder(orderId) {
  return post('/exchange/newStockCoinTrade/cancelOrder', { orderId });
}

// 获取配置
export function getValue() {
  return post('/exchange/RockieMessage/getValue');
}

// 获取是否显示
export function getIsDisplay() {
  return post('/exchange/hashMap/getIsDisplay');
}

export default api;
