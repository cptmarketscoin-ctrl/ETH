const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  publicPath: '/ETH/',
  outputDir: 'dist',
  assetsDir: 'static',
  indexPath: 'index.html',
  transpileDependencies: true,
  
  // 开发服务器配置
  devServer: {
    port: 8081,
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },

  // 生产构建优化
  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          elementUI: {
            name: 'chunk-element',
            priority: 20,
            test: /[\\/]node_modules[\\/]element-ui[\\/]/
          },
          vant: {
            name: 'chunk-vant', 
            priority: 20,
            test: /[\\/]node_modules[\\/]vant[\\/]/
          },
          vendors: {
            name: 'chunk-vendors',
            priority: 10,
            test: /[\\/]node_modules[\\/]/
          }
        }
      }
    }
  },

  chainWebpack: config => {
    config.plugin('copy').tap(args => {
      if (!args[0].patterns) args[0].patterns = [];
      args[0].patterns.push({ from: 'public/klakna.css', to: 'klakna.css' });
      return args;
    });
  },
});
