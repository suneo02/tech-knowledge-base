const { createProxyMiddleware } = require('http-proxy-middleware')

// let target = 'https://superlist.windinfo.com.cn';
// let target = 'https://180.96.8.44';
// let target = 'http://114.80.154.45'
// let target = 'https://test.wind.com.cn'
let target = 'https://wx.wind.com.cn'
// let target = 'http://180.96.8.44';
let session = '1fe3084b15024f828e86604964ff71c1'

// Helper function to log request details
const logRequestDetails = (_proxyReq, _req) => {
  // const fullUrl = `${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`
  // const targetUrl = `${proxyReq.protocol}//${proxyReq.host}${proxyReq.path}`
  // console.log('\n=== API REQUEST DETAILS ===')
  // console.log(`Original Request: ${fullUrl}`)
  // console.log(`Proxied to: ${targetUrl}`)
  // console.log(`Headers: ${JSON.stringify(proxyReq.getHeaders(), null, 2)}`)
  // console.log('===========================\n')
}

module.exports = function (app) {
  app.use(
    createProxyMiddleware('/superlist/api', {
      target,
      changeOrigin: true,
      onProxyReq: logRequestDetails,
      logLevel: 'debug',
    })
  )
  // 滑动验证码获取
  app.use(
    createProxyMiddleware('/efasbew', {
      target,
      changeOrigin: true,
      onProxyReq: logRequestDetails,
      logLevel: 'debug',
    })
  )

  app.use(
    createProxyMiddleware('/wmap', {
      target: target,
      headers: {
        'wind.sessionid': session,
      },
      changeOrigin: true,
      secure: false,
      onProxyReq: logRequestDetails,
      logLevel: 'debug',
    })
  )
  app.use(
    createProxyMiddleware('/wind.ent.web', {
      target: 'https://test.wind.com.cn',
      headers: {
        'wind.sessionid': '9622ded411cd45659da8918dfdbf8828',
      },
      changeOrigin: true,
      secure: false,
      onProxyReq: logRequestDetails,
      logLevel: 'debug',
    })
  )
  app.use(
    createProxyMiddleware('/wind.ent.chat', {
      target,
      changeOrigin: true,
      secure: false,
      onProxyReq: logRequestDetails,
      logLevel: 'debug',
    })
  )

  //

  // Wind.WFC.Enterprise.Web
  app.use(
    createProxyMiddleware('/Wind.WFC.Enterprise.Web', {
      // target: 'http://180.96.8.173/',
      target: target,
      headers: {
        'wind.sessionid': session,
      },
      changeOrigin: true,
      //   target: 'http://10.230.21.104:8081/',
      // pathRewrite: { '^/Wind.WFC.Enterprise.Web': '/superlist/api/Wind.WFC.Enterprise.Web' },
      secure: false,
      onProxyReq: logRequestDetails,
      logLevel: 'debug',
    })
  )

  app.use(
    createProxyMiddleware('/edb.gateway', {
      //   target: 'http://180.96.8.173/',
      target: 'http://180.96.8.44',
      //   target: 'http://10.230.21.104:8081/',
      // pathRewrite: { '^/Wind.WFC.Enterprise.Web': '/superlist/api/Wind.WFC.Enterprise.Web' },
      secure: false,
      headers: {
        'wind.sessionid': session,
      },
      changeOrigin: true,
      onProxyReq: logRequestDetails,
      logLevel: 'debug',
    })
  )

  // wind.risk.relay
  app.use(
    createProxyMiddleware('/wind.risk.relay', {
      //   target: 'http://180.96.8.173/',
      target: 'http://180.96.8.44',
      //   target: 'http://10.230.21.104:8081/',
      headers: {
        'wind.sessionid': session,
      },
      changeOrigin: true,
      secure: false,
      onProxyReq: logRequestDetails,
      logLevel: 'debug',
    })
  )

  app.use(
    createProxyMiddleware('/superlist/logo', {
      target: 'https://superlist.windinfo.com.cn/',
      headers: {
        'wind.sessionid': session,
      },
      changeOrigin: true,
      secure: false,
      onProxyReq: logRequestDetails,
      logLevel: 'debug',
    })
  )

  app.use(
    createProxyMiddleware('/superlist/biddingText', {
      target: 'https://superlist.windinfo.com.cn/',
      headers: {
        'wind.sessionid': session,
      },
      changeOrigin: true,
      secure: false,
      onProxyReq: logRequestDetails,
      logLevel: 'debug',
    })
  )
}
