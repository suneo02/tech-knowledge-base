const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')
const cors = require('cors')

const app = express()
const PORT = 3030

// 启用CORS
app.use(cors())

// 默认代理路径
const proxyPaths = {
  '/xtest': 'https://test.wind.com.cn',
  '/xprod': 'https://wx.wind.com.cn',
  '/xgel': 'https://gel.wind.com.cn',
  '/xdev': 'http://10.100.5.240:8880',
}

// 可配置的sessionId
const DEFAULT_SESSION_ID = '14e7df7eadbe433083c9afb4ecd43885'
const SESSION_ID = DEFAULT_SESSION_ID
const SESSION_HEADER = 'wind.sessionid'

// 设置各代理路径
Object.entries(proxyPaths).forEach(([path, target]) => {
  if (!target) {
    console.warn(`警告: ${path} 的目标URL未定义`)
    return
  }

  app.use(
    path,
    createProxyMiddleware({
      target,
      changeOrigin: true,
      pathRewrite: { [`^${path}`]: '' },
      logLevel: 'debug',
      // 添加请求头修改
      onProxyReq: (proxyReq, req) => {
        // 如果没有wind.sessionid请求头，则添加
        if (!proxyReq.getHeader(SESSION_HEADER)) {
          proxyReq.setHeader(SESSION_HEADER, SESSION_ID)
        }

        // 记录请求信息
        console.log(`请求: ${req.method} ${req.url} -> ${target}${req.url.replace(path, '')}`)
        console.log(`添加请求头: ${SESSION_HEADER}=${SESSION_ID}`)
      },
      onError: (err, _req, res) => {
        console.error(`代理错误 (${path} -> ${target}): ${err.message}`)
        res.status(500).send(`代理错误: ${err.message}`)
      },
    })
  )
})

// 添加健康检查端点
app.get('/health', (_req, res) => {
  res.send('代理服务器正常运行')
})

// 添加一个简单的测试端点
app.get('/test-api', (_req, res) => {
  res.json({
    success: true,
    message: '代理服务器测试API正常响应',
    timestamp: new Date().toISOString(),
    sessionId: SESSION_ID,
  })
})

// 添加查看和修改sessionId的端点
app.get('/session', (_req, res) => {
  res.json({
    sessionId: SESSION_ID,
    header: SESSION_HEADER,
  })
})

// 启动服务器
app.listen(PORT, () => {
  console.log(`API代理服务器运行在: http://localhost:${PORT}`)
  console.log(`当前使用的sessionId: ${SESSION_ID}`)
  console.log('配置的代理路径:')
  Object.entries(proxyPaths).forEach(([path, target]) => {
    if (target) {
      console.log(`${path} -> ${target}`)
    } else {
      console.log(`${path} -> 未配置`)
    }
  })
})
