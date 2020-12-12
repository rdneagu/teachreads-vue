module.exports = {
  devServer: {
    proxy: {
      '/books': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        logLevel: 'debug',
      },
    },
  },
};
