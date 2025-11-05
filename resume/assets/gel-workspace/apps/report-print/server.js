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

// API代理设置
app.use(
  '/xprod',
  createProxyMiddleware({
    target: 'https://wx.wind.com.cn',
    changeOrigin: true,
    pathRewrite: {
      '^/xprod': '',
    },
    secure: false,
  })
)

app.use(
  '/xtest',
  createProxyMiddleware({
    target: 'https://test.wind.com.cn',
    changeOrigin: true,
    pathRewrite: {
      '^/xtest': '',
    },
    secure: false,
  })
)

app.listen(PORT, () => {
  console.log(`静态服务器运行在 http://localhost:${PORT}`)
})
