import React from 'react'
import AIChartsContent from './comp/AiChartsContent'
import { AIGRAPH_DEFAULT_COMPANY_CODE, AIGRAPH_DEFAULT_COMPANY_NAME } from '../Charts/comp/constants'
import { AIGraphProvider, AIChartProvider } from './context'

/**
 * @description AI图谱组件
 * @author bcheng<bcheng@wind.com.cn>
 */
const AIGraph: React.FC<{
  companyCode?: string
  companyName?: string
}> = ({ companyCode = AIGRAPH_DEFAULT_COMPANY_CODE, companyName = AIGRAPH_DEFAULT_COMPANY_NAME }) => {
  return (
    <AIGraphProvider initialCompanyCode={companyCode} initialCompanyName={companyName}>
      <AIChartProvider>
        <AIChartsContent />
      </AIChartProvider>
    </AIGraphProvider>
  )
}

export default AIGraph
