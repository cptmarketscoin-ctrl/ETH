/**
 * Klakna 后端配置
 */

module.exports = {
  // 🖥️ 服务器端口
  PORT: 8080,
  HTTPS_PORT: 8443,

  // 🎯 原站地址（用于透传代理）
  TARGET: 'https://www.klakna.sbs',

  // 🔐 JWT 密钥
  JWT_SECRET: 'klakna_backend_secret_key_2024',
  JWT_EXPIRES_IN: '7d',

  // 💰 交易手续费率
  FEE_RATE: 0.001,        // 0.1%
  FEE_RATE_FUTURES: 0.0005, // 0.05%

  // 👑 管理员密钥（API 调用时通过 Authorization: Bearer admin:SECRET 鉴权）
  ADMIN_SECRET: 'klakna_admin_root_2024',

  // 📁 数据库文件
  DB_PATH: __dirname + '/data/klakna.db',
};
