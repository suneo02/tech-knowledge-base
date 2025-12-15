import { execSync } from 'child_process'
import fs from 'fs'
import os from 'os'
import puppeteer from 'puppeteer-core'

// 获取系统 Chrome 可执行文件路径
function getChromePath() {
  const platform = os.platform()
  console.log(`Platform: ${platform}`)

  // macOS 系统
  if (platform === 'darwin') {
    const defaultPath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    if (fs.existsSync(defaultPath)) return defaultPath

    try {
      const macResult = execSync('mdfind kMDItemCFBundleIdentifier=com.google.Chrome').toString().trim().split('\n')[0]
      if (macResult) return `${macResult}/Contents/MacOS/Google Chrome`
    } catch (e) {
      console.log('未能通过 mdfind 找到 Chrome')
    }
  }

  // Windows 系统
  if (platform === 'win32') {
    const windowsPaths = [
      `${process.env.PROGRAMFILES}\\Google\\Chrome\\Application\\chrome.exe`,
      `${process.env['PROGRAMFILES(X86)']}\\Google\\Chrome\\Application\\chrome.exe`,
      `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
    ]

    for (const windowsPath of windowsPaths) {
      if (fs.existsSync(windowsPath)) return windowsPath
    }
  }

  // Linux 系统
  if (platform === 'linux') {
    const linuxPaths = ['/usr/bin/google-chrome', '/usr/bin/chromium-browser', '/usr/bin/chromium']

    for (const linuxPath of linuxPaths) {
      if (fs.existsSync(linuxPath)) return linuxPath
    }

    try {
      return execSync('which google-chrome').toString().trim()
    } catch (e) {
      console.log('未能通过 which 找到 Chrome')
    }
  }

  // 找不到 Chrome
  console.error('无法找到 Chrome 浏览器，请手动指定路径')
  return null
}

// 启动浏览器的配置函数
async function launchBrowser() {
  const chromePath = getChromePath()

  if (!chromePath) {
    throw new Error('未找到 Chrome 浏览器，请确保已安装 Google Chrome')
  }

  try {
    console.log(`使用 Chrome 路径: ${chromePath}`)
    return await puppeteer.launch({
      headless: true,
      executablePath: chromePath,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })
  } catch (error) {
    console.error('启动浏览器失败:', error)
    throw error
  }
}

async function exportToPdf(url: string, title = 'export') {
  const browser = await launchBrowser()

  try {
    const page = await browser.newPage()

    // 对应 wkhtmltopdf --debug-javascript
    page.on('console', (msg) => {
      console.log('PAGE LOG:', msg.text())
    })

    console.log(`正在导航到 ${url}`)
    await page.goto(url, {
      waitUntil: 'networkidle0',
      timeout: 60000,
    })

    // 对应 wkhtmltopdf --javascript-delay 1000
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const pdfPath = (title ?? 'export.pdf').endsWith('.pdf') ? title : `${title}.pdf`

    const pdfOptions: any = {
      path: pdfPath ? `./${pdfPath}` : undefined,
      format: 'A4',
      // 对应 --margin-bottom 0mm --margin-left 0mm --margin-right 0mm --margin-top 0mm
      margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
      // 对应 --disable-smart-shrinking
      scale: 1,
      printBackground: true,
      preferCSSPageSize: true,
    }

    console.log(`开始生成PDF`)
    const pdfBuffer = await page.pdf(pdfOptions)

    console.log(`PDF生成成功，文件大小: ${pdfBuffer.length / 1024} KB`)
    return pdfBuffer
  } catch (error) {
    console.error('PDF导出失败:', error)
    throw error
  } finally {
    await browser.close()
    console.log('浏览器已关闭')
  }
}

async function main() {
  const args = process.argv.slice(2)
  let url: string | undefined
  let title: string | undefined

  if (args.includes('--url')) {
    const urlIndex = args.indexOf('--url')
    if (args.length > urlIndex + 1) {
      url = args[urlIndex + 1]
    }
  } else if (args.length > 0 && !args[0].startsWith('--')) {
    ;[url, title] = args
  }

  if (args.includes('--title')) {
    const titleIndex = args.indexOf('--title')
    if (args.length > titleIndex + 1) {
      title = args[titleIndex + 1]
    }
  }

  if (!url) {
    console.error('错误: 请提供一个 URL 作为参数。')
    console.log('用法 1: pnpm run export:pdf -- --url <url> --title [文件名]')
    console.log('用法 2: pnpm run export:pdf -- <url> [文件名]')
    process.exit(1)
  }

  try {
    console.log(`开始导出PDF: ${url}`)
    await exportToPdf(url, title)
    console.log('PDF 导出成功!')
  } catch (error) {
    console.error('PDF 导出过程中发生错误。', error)
    process.exit(1)
  }
}

main()
