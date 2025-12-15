// .storybook/middleware.js
const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function expressMiddleware(router) {
  router.use(
    '/api',
    createProxyMiddleware({
      target: 'http://wx.wind.com.cn',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
      secure: false,
    }),
  )
}
