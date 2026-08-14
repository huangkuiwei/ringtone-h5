module.exports = {
  transpileDependencies: ['@dcloudio/uni-ui'],

  devServer: {
    proxy: {
      '/api': {
        target: 'https://alarmapi.qingsail.com',
        changeOrigin: true,
      },
    },
    port: 8090,
  },
};
