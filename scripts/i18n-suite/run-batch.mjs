import path from 'path'
import { loadGlobalLocales, processProject, generateReport } from './auto-i18n.mjs'
import { config } from './i18n.config.mjs'

const ROOT_DIR = process.cwd()
const GLOBAL_LOCALES_DIR = path.join(ROOT_DIR, 'packages/gel-util/src/intl/locales')
const REPORT_PATH = path.join(ROOT_DIR, 'i18n-report.html')

async function main() {
  console.log('Starting Batch i18n Processing...')

  // 1. Load Global Locales ONCE
  const globalData = loadGlobalLocales(GLOBAL_LOCALES_DIR)

  const allReports = []

  // Filter projects if argument provided
  const targetNamespace = process.argv[2]
  const projectsToProcess = targetNamespace ? config.filter((p) => p.namespace === targetNamespace) : config

  if (targetNamespace && projectsToProcess.length === 0) {
    console.error(`No project found with namespace: ${targetNamespace}`)
    process.exit(1)
  }

  // 2. Process Each Project
  for (const project of projectsToProcess) {
    try {
      const report = processProject(
        {
          targetDir: project.target,
          localesOutputDir: project.locales,
          namespace: project.namespace,
        },
        globalData
      )

      allReports.push(report)
    } catch (e) {
      console.error(`Error processing ${project.namespace}:`, e)
    }
  }

  // 3. Generate Combined Report
  const globalSummary = {
    used: Object.keys(globalData.cnMap).length,
    total: 0,
    matched: 0,
    unmatched: 0,
  }

  allReports.forEach((report) => {
    globalSummary.total += report.summary.total || 0
    globalSummary.matched += report.summary.matched || 0
    globalSummary.unmatched += report.summary.unmatched || 0
  })

  generateReport(allReports, globalSummary, REPORT_PATH)
  console.log('Batch processing complete.')
}

main()
