import { configDetailIntlHelper } from '@/corpConfigJson'
import { TIntl } from '@/types'
import { ReportPageJson } from 'gel-types'
import { getTodayIntl } from './common'

export const getCreditEvaluationRPLocale = () => {
  return {
    // 报告标题 暂时显示为尽调报告
    reportTitle: '授信报告',
  }
}

/**
 * 报告首页声明
 * @param isEn
 * @returns
 */
export const getCreditEvaluationRPCoverComment = () => {
  return [
    '本报告内容为截至2025年07月04日的数据快照内容，万得根据目标企业在相关信息公示、公开信息数据整理分析所得。其中有部分章节基于报告使用人上传的私人资料结合AI大数据生成，在具体章节会特别说明，AI生成的信息仅供参考，请注意核实数据和信息的正确性。万得不对本报告的全面、准确、真实性进行分辨和核验，不负相关法律责任，本报告内容不构成我们对任何人或企业之明示或暗示的观点或保证，仅为您提供参考，真实结果请以各官方网站的公布结果为准。',
    '本报告仅供商业决策参考之用，不得用作法律诉讼的依据或是其他非法用途。未经万得同意或授权，不得向第三人透露本报告任何内容。在任何情况下，对由于参考本报告所造成的损失，万得不承担任何责任。',
  ]
}

/**
 * 信用报告说明
 *
 * Disclaimer:


 */
export const getCreditEvaluationRPDisclaimer = ({
  config,
  t,
  isEn,
}: {
  config: ReportPageJson
  t: TIntl
  isEn: boolean
}) => {
  const reportDate = getTodayIntl(isEn)

  const modules = config.map((item) => {
    return {
      title: configDetailIntlHelper(item, 'title', t),
      children:
        'children' in item && item.children
          ? item.children.map((child) => {
              return {
                title: configDetailIntlHelper(child, 'title', t),
              }
            })
          : [],
    }
  })
  return [
    isEn ? 'Disclaimer:' : '免责声明：',
    `本报告内容为截至${reportDate}的数据快照内容，万得根据目标企业在相关信息公示、公开信息数据整理分析所得。其中有部分章节基于报告使用人上传的私人资料结合AI大数据生成，在具体章节会特别说明，AI生成的信息仅供参考，请注意核实数据和信息的正确性。万得不对本报告的全面、准确、真实性进行分辨和核验，不负相关法律责任，本报告内容不构成我们对任何人或企业之明示或暗示的观点或保证，仅为您提供参考，真实结果请以各官方网站的公布结果为准。如对该数据服务存在异议，或发现违法及不良信息，请拨打电话400-820-9463或发送邮件至service@wind.com.cn，我们将及时处理。`,
    '本报告仅供商业决策参考之用，不得用作法律诉讼的依据或是其他非法用途。未经万得同意或授权，不得向第三人透露本报告任何内容。在任何情况下，对由于参考本报告所造成的损失，万得不承担任何责任。',
    t('451097', '本文档包含以下章节：'),
    ...modules.map((item, index) => {
      return `${index + 1}.${item.title}${isEn ? ':' : '：'}${item.children
        ?.map((child) => {
          return child.title
        })
        .join(isEn ? ',' : '、')}`
    }),
    `${modules.length + 1}.${t('451098', '附录')}`,
  ]
}
