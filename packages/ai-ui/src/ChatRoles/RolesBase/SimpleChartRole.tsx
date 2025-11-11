import { ChatTypeEnum, DPUItem } from 'gel-api'
import { AntRoleType, SimpleChartMessage } from 'gel-ui'
import { lazy, Suspense } from 'react'
import { RoleAvatarHidden } from '../components/misc'
import ChartDataBuilder from './core/ChartDataBuilder'
import DPUProcessor from './core/DPUProcessor'

// 懒加载 WCB 组件
const LazyWCB = lazy(() => import('@/WindChart').then((module) => ({ default: module.WCB })))

export const SimpleChartRole: AntRoleType<SimpleChartMessage['content']> = {
  placement: 'start',
  avatar: RoleAvatarHidden,
  variant: 'borderless',
  messageRender: (content) => {
    const { dpuList, chartType, rawSentence } = content

    const getConfigs = ({
      chartData,
      chartType,
      intention,
      rewriteQuestion = '',
      question = '',
    }: {
      chartData: DPUItem[] | undefined
      chartType: ChatTypeEnum | undefined
      intention?: string
      rewriteQuestion?: string
      question?: string
    }) => {
      if (!chartData) {
        return null
      }

      let chartTypeClone = chartType
      // 意图为7 问句中不包含图时不做图
      if (intention === '7' && !(rewriteQuestion || question).match(/图/gi)) {
        return null
      }

      // if (
      //   !showType ||
      //   ![ALICE_SHOW_TYPE.TBLIST, 'table', ALICE_SHOW_TYPE.STREAM].includes(showType)
      // ) {
      //   return null
      // }
      // 服务端返回不作图时，如果用户问句包含作图信息，默认折线图
      if (!chartTypeClone) {
        if ((rewriteQuestion || question).match(/绘制|曲线|圖|图|chart|graph|diagram/gi)) {
          chartTypeClone = ChatTypeEnum.LINE
        }
      }

      if ((rewriteQuestion || question).match(/饼图|饼状图|pie/gi)) {
        chartTypeClone = ChatTypeEnum.PIE
      }
      const dpuProc = new DPUProcessor()
      const tbList = dpuProc.build(chartData)
      console.warn('🚀 ~ configs ~ tbList:', tbList)
      if (tbList.length === 0) return null
      const builder = new ChartDataBuilder(tbList, { chartType: chartTypeClone })
      const config = builder.getChart()
      return config
    }

    const configs = getConfigs({
      chartData: dpuList,
      chartType,
      rewriteQuestion: rawSentence,
      question: rawSentence,
    })
    console.log('🚀 ~SimpleChartRole  configs:', configs)

    // 检查 content 是否为有效的 DPUItem 数组

    return (
      <>
        <Suspense fallback={<div></div>}>
          <LazyWCB type="bar" indicators={configs?.indicators} />
        </Suspense>
      </>
    )
  },
  styles: {
    content: {
      width: '100%',
      marginInlineEnd: 44,
    },
  },
}
