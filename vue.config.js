module.exports = {
  transpileDependencies: ['@dcloudio/uni-ui'],

  devServer: {
    proxy: {
      '/api': {
        target: 'https://sjapi.netling.cn',
        changeOrigin: true,
      },
    },
    port: 8090,
  },
};
