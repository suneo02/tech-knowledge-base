import http from 'http'
import { execSync } from 'child_process'
import url from 'url'
import fs from 'fs'

const PORT = 4789

const existsCmd = (cmd) => {
  try { execSync(`command -v ${cmd}`, { stdio: 'ignore' }); return true } catch { return false }
}

const openInEditor = (filePath, line) => {
  const custom = process.env.EDITOR_CMD
  if (custom) {
    try { execSync(`${custom} "${filePath}" ${line ? `:${line}` : ''}`); return true } catch {}
  }
  if (existsCmd('code')) {
    try { execSync(`code -g "${filePath}:${line || 1}"`); return true } catch {}
  }
  try { execSync(`open "${filePath}"`); return true } catch {}
  return false
}

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true)
  if (parsed.pathname === '/open') {
    const filePath = parsed.query.path
    const line = parseInt(parsed.query.line || '1', 10)
    if (!filePath || !fs.existsSync(filePath)) {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ ok: false, error: 'invalid path' }))
      return
    }
    const ok = openInEditor(filePath, line)
    res.writeHead(ok ? 200 : 500, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ ok }))
    return
  }
  res.writeHead(404, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ ok: false, error: 'not found' }))
})

server.listen(PORT, () => {
  console.log(`i18n-suite server listening on http://localhost:${PORT}`)
})

