// 导入所需依赖

import { RPPrintRenderer } from '@/comp/RPPrintRenderer'
import { initCorpInit } from '@/handle/misc/corpInit'
import { corpBaseInfoStore, rpPrintStore, userPackageStore } from '@/store'
import { corpBaseNumStore } from '@/store/corpBaseNumStore'
import { corpOtherInfoStore } from '@/store/corpOtherInfoStore'
import { initLanguageControl } from '@/utils/lang'
import { getCreditEvaluationRPConfig } from 'detail-page-config'
import {
  getCreditEvaluationRPCoverComment,
  getCreditEvaluationRPDisclaimer,
  getCreditEvaluationRPLocale,
} from 'report-util/constants'
import '../styles/reset.less'

// 输出加载成功消息
console.log('Report JS bundle loaded successfully')

/**
 * 初始化报表渲染器
 * 工厂函数，创建并初始化ReportRenderer实例
 */

function initReportRenderer(): void {
  try {
    const $reportContainer = $('#report')
    if (!$reportContainer.length) {
      console.error('Report container element not found')
      return
    }

    const { reportTitle = '' } = getCreditEvaluationRPLocale()

    // 获取报告配置，这需要在 TableSectionsGenerator 实例化之前
    const reportConfigRaw = getCreditEvaluationRPConfig(
      corpBaseInfoStore.getData(),
      corpBaseNumStore.getData(),
      corpOtherInfoStore.getData(),
      userPackageStore.getData()
    )

    rpPrintStore.updateField('reportTitle', reportTitle)
    rpPrintStore.updateField('getRpDisclaimer', getCreditEvaluationRPDisclaimer)
    rpPrintStore.updateField('getRpCoverComment', getCreditEvaluationRPCoverComment)
    rpPrintStore.initReportConfig(reportConfigRaw)

    const renderer = new RPPrintRenderer($reportContainer)

    renderer.initialize()
  } catch (e) {
    console.trace(e)
  }
}

// 初始化语言控制并设置回调
initLanguageControl({
  onSuccess: () => {
    initCorpInit(() => {
      initReportRenderer()
    })
  },
  onError: () => console.error('Language initialization failed'),
})
