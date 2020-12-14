module.exports = {
  css: {
    loaderOptions: {
      scss: {
        prependData: '@import "@/scss/_colors.scss";',
      },
    },
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        logLevel: 'debug',
      },
    },
  },
};
