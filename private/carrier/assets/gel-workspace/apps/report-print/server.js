import express from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = 3000

// 设置静态文件服务，这样就能直接访问dist目录下的文件
app.use(express.static(path.join(__dirname, 'dist')))

// 显式处理/printReport路径，返回printReport.html
// TODO 临时方案，需要排查为什么
app.get('/creditrp', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'creditrp.html'))
})

app.get('/creditevaluationrp', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'creditevaluationrp.html'))
})

// API代理设置
app.use(
  '/api/xsh',
  createProxyMiddleware({
    target: 'https://114.80.154.45',
    changeOrigin: true,
    pathRewrite: {
      '^/api/xsh': '',
    },
    secure: false,
  })
)

app.use(
  '/api/xnj',
  createProxyMiddleware({
    target: 'https://180.96.8.44',
    changeOrigin: true,
    pathRewrite: {
      '^/api/xnj': '',
    },
    secure: false,
  })
)

app.use(
  '/api/xtest',
  createProxyMiddleware({
    target: 'https://test.wind.com.cn',
    changeOrigin: true,
    pathRewrite: {
      '^/api/xtest': '',
    },
    secure: false,
  })
)

app.listen(PORT, () => {
  console.log(`静态服务器运行在 http://localhost:${PORT}`)
})
