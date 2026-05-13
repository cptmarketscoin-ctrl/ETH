const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  publicPath: '/ETH/',
  outputDir: 'dist',
  assetsDir: 'static',
  indexPath: 'index.html',
  chainWebpack: config => {
    config.plugin('copy').tap(args => {
      if (!args[0].patterns) args[0].patterns = [];
      args[0].patterns.push({ from: 'public/klakna.css', to: 'klakna.css' });
      return args;
    });
  }
});
