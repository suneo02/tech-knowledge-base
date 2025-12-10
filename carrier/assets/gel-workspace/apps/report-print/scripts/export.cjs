const { exec } = require('child_process')
const util = require('util')
const execPromise = util.promisify(exec)
const readline = require('readline')
const path = require('path')
const fs = require('fs')

// 创建logs目录（如果不存在）
const logsDir = path.join(__dirname, '../logs')
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true })
}

/**
 *
 * wkhtmltopdf --margin-bottom 0mm --margin-left 0mm --margin-right 0mm --margin-top 0mm --debug-javascript --javascript-delay 1000  --disable-smart-shrinking "http://localhost:3000/creditevaluationrp?companyCode=1240014302" output.pdf
 */
// 定义所有预设的企业代码
const companies = {
  CO: '1173319566',
  FCP: '1063144164',
  FPC: '1002954109',
  SPE: '1004283596',
  GOV: '1179064448',
  IIP: '1102955966',
  LS: '1248823373',
  NGO: '1226065840',
  PE: '1038862373',
  SOE: '1355909797',
  OE: '1054443718',
  SH: '1225626853',
  HK: '1207343546',
  TW: '1250975407',
  CANADA: '1247070793',
  ENGLAND: '1213525159',
  FRANCE: '1337588182',
  GERMANY: '1265819509',
  INDIA: '1555171305',
  ITALY: '1284842480',
  JAPAN: '1224890572',
  KOREA: '1207772711',
  LUXEMBOURG: '1239158216',
  MALAYSIA: '1575116880',
  NEW_ZEALAND: '1354418508',
  RUSSIA: '1550341742',
  SINGAPORE: '1223920191',
  TAILAND: '1524110754',
  VIETNAM: '1273211271',
}

// 报表类型映射（默认 credit）
const REPORT_PATH_MAP = {
  credit: 'creditrp',
  creditevaluation: 'creditevaluationrp',
}

// 环境配置
const config = {
  local: {
    baseUrl: 'http://localhost:3000/creditrp',
    env: 'local',
  },
  test: {
    baseUrl: 'https://test.wind.com.cn/Wind.WFC.Enterprise.Web/PC.Front/reportprint/creditrp.html',
    env: 'test',
  },
  main: {
    baseUrl: 'https://wx.wind.com.cn/Wind.WFC.Enterprise.Web/PC.Front/reportprint/creditrp.html',
    env: 'online',
  },
}

// wkhtmltopdf 通用参数
const WKHTMLTOPDF_OPTIONS =
  '--margin-bottom 0mm --margin-left 0mm --margin-right 0mm --margin-top 0mm --debug-javascript --javascript-delay 1000 --run-script "console.log = function(msg) { alert(msg); };" --disable-smart-shrinking'

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve))
}

// 创建命令行交互界面
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

async function exportReport(options) {
  const {
    companyCode,
    type = '',
    report = 'credit',
    env: envName = 'local',
    language = '',
    sessionId = '',
    pattern = '',

    outputFile,
  } = options

  const envConfig = config[envName]

  // 根据报表类型替换路径
  const reportKey = (report || 'credit').toLowerCase()
  const reportPath = REPORT_PATH_MAP[reportKey] || REPORT_PATH_MAP.credit
  const baseUrl = envConfig.baseUrl.replace('creditrp', reportPath)
  const langParam = language ? `&lan=${language}` : ''
  const sessionParam = sessionId ? `&wind.sessionid=${sessionId}` : ''
  const patternParam = pattern ? `&pattern=${pattern}` : ''

  // 如果没有指定输出文件名，则生成一个
  const finalOutputFile =
    outputFile ||
    `output-${reportKey}-${type || companyCode}-${envConfig.env}${language ? '-' + language : ''}${pattern ? '-' + 'hasPattern' : ''}.pdf`

  // 生成日志文件名
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const logFile = path.join(logsDir, `wkhtmltopdf-${timestamp}-${type || companyCode}.log`)

  const url = `${baseUrl}?companyCode=${companyCode}${langParam}${sessionParam}${patternParam}`
  const command = `wkhtmltopdf ${WKHTMLTOPDF_OPTIONS} --debug-javascript --javascript-delay 1000 "${url}" ${finalOutputFile} 2>&1 | tee "${logFile}"`

  try {
    console.log(
      `Started exporting ${envName} report${type ? ' for ' + type : ''}${language ? ' (' + language + ')' : ''}...`,
      url
    )
    console.log(`Logging output to: ${logFile}`)

    const { stdout, stderr } = await execPromise(command)

    // 将输出写入日志文件
    fs.appendFileSync(logFile, '\n=== Command Output ===\n')
    if (stdout) fs.appendFileSync(logFile, `\nStdout:\n${stdout}`)
    if (stderr) fs.appendFileSync(logFile, `\nStderr:\n${stderr}`)

    console.log(`Successfully exported ${finalOutputFile}`)
    return {
      success: true,
      type: type || companyCode,
      env: envName,
      language,
      logFile,
    }
  } catch (error) {
    // 记录错误到日志文件
    fs.appendFileSync(logFile, '\n=== Error ===\n' + error.toString())

    console.error(`Error exporting ${type || companyCode} ${envName} version:`, error)
    return {
      success: false,
      type: type || companyCode,
      env: envName,
      language,
      error,
      logFile,
    }
  }
}

async function batchExport({
  sessionId = '',
  companyCode = companies.CO,
  type = 'CO',
  env,
  pattern,
  report = 'credit',
}) {
  const code = companyCode
  let exportTasks = []

  // 如果指定了环境，则执行新的批量导出逻辑
  if (env) {
    if ((env === 'test' || env === 'main') && !sessionId) {
      sessionId = await question(`Enter wind.sessionid for ${env} env: `)
      if (!sessionId) {
        console.log(`SessionID is required for ${env} environment.`)
        return
      }
    }

    const languages = ['cn', 'en']
    // 如果提供了 pattern，则测试有 pattern 和无 pattern 两种情况
    const patternsToTest = pattern ? [pattern, ''] : ['']

    for (const lang of languages) {
      for (const p of patternsToTest) {
        const reportOptions = {
          companyCode: code,
          type,
          env,
          language: lang,
          pattern: p || undefined,
          report,
        }
        if (env !== 'local') {
          reportOptions.sessionId = sessionId
        }
        exportTasks.push(exportReport(reportOptions))
      }
    }
  } else {
    // 否则，执行原有的批量导出逻辑
    if (!sessionId) {
      sessionId = await question('Enter wind.sessionid for test/main envs: ')
    }

    // 本地版 (local)
    exportTasks.push(exportReport({ companyCode: code, type, env: 'local', report }))
    exportTasks.push(
      exportReport({
        companyCode: code,
        type,
        env: 'local',
        language: 'cn',
        report,
      })
    )

    // 测试版和主站版 (test/main)
    if (sessionId) {
      const envs = ['test', 'main']
      const languages = ['cn', 'en']
      for (const e of envs) {
        for (const l of languages) {
          exportTasks.push(
            exportReport({
              companyCode: code,
              type,
              env: e,
              language: l,
              sessionId,
              report,
            })
          )
        }
      }
    }
  }

  // 并行执行所有任务
  const results = await Promise.all(exportTasks)

  // 统计结果
  const successful = results.filter((r) => r.success).length
  const failed = results.filter((r) => !r.success).length

  console.log('\nExport Summary:')
  console.log(`Total: ${results.length}`)
  console.log(`Successful: ${successful}`)
  console.log(`Failed: ${failed}`)

  if (failed > 0) {
    console.log('\nFailed exports:')
    results
      .filter((r) => !r.success)
      .forEach((r) => {
        console.log(`- ${r.type} (${r.env}${r.language ? ', ' + r.language : ''})`, `\n  Log file: ${r.logFile}`)
      })
  }

  console.log('\nLog files can be found in:', logsDir)
}

// 处理命令行参数
const args = process.argv.slice(2)
const params = {}
args.forEach((arg, i) => {
  if (arg.startsWith('--')) {
    params[arg.slice(2)] = args[i + 1]
  }
})

// 主函数
async function main() {
  try {
    if (params.batch === 'true') {
      await batchExport({
        sessionId: params.sessionId,
        companyCode: params.companyCode,
        type: params.type,
        env: params.env,
        pattern: params.pattern,
        report: params.report,
      })
    } else {
      await exportReport({
        companyCode: params.companyCode || companies.CO,
        env: params.env || 'local',
        language: params.language,
        sessionId: params.sessionId,
        pattern: params.pattern,
        outputFile: params.output,
        report: params.report,
      })
    }
  } finally {
    rl.close()
  }
}

main().catch(console.error)
