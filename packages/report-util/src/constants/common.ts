import { TIntl } from '@/types'
import { TCorpDetailNodeKey } from 'gel-types'

export const COMMON_CONSTANTS = {
  LOCALE_PATH: './resource/locale/',
  WIND_LOGO_PATH: './resource/image/logo.png',
  NO_PHOTO_PATH: './resource/image/no_photo_list.png',
  WIND_CONTACT_NUMBER: '400-820-9463',
  DEFAULT_COMPANY: './resource/image/default_company.png',
  DEFAULT_BRAND: './resource/image/brand120.png',
}

export const getRPCommonLocale = (t: TIntl, isEn: boolean) => {
  return {
    // 报告标题 暂时显示为尽调报告
    reportDate: t('451119', '报告日期') + (isEn ? ': ' : '：') + getTodayIntl(isEn),
  }
}
/**
 * 获取日期国家化
 * @param t
 * @returns
 */
export const getTodayIntl = (isEn: boolean) => {
  try {
    const date = new Date()
    const y = date.getFullYear()
    const m = date.getMonth() + 1
    const d = date.getDate()
    const mStr = m < 10 ? `0${m}` : String(m)
    const dStr = d < 10 ? `0${d}` : String(d)
    if (isEn) {
      return `${y}-${mStr}-${dStr}`
    }
    return `${y}年${mStr}月${dStr}日`
  } catch (error) {
    console.error(error)
    return ''
  }
}

export const getNoDataLocale = (module: string | undefined, isEn: boolean) => {
  const dateStr = getTodayIntl(isEn)
  const moduleStr = module || ''
  if (isEn) {
    return `As of ${dateStr}, based on Wind's big data analysis, no publicly disclosed ${moduleStr} information for this enterprise could be found proactively. It is possible that the information is not fully consistent with the objective facts due to reasons such as the source of public information not being disclosed yet, differences in the form of public disclosure, or delays in search timing. This is for customer reference only.`
  }
  return `截止${dateStr}，根据万得大数据分析，暂未查询到该企业主动公示的${moduleStr}信息，不排除因信息公开来源尚未公开、公开形式存在差异、检索时间存在滞后等情况导致的信息与客观事实不完全一致的情形，仅供客户参考。`
}

export const getOver50DataLocale = (count: number, isEn: boolean) => {
  if (isEn) {
    return `This dimension includes a total of ${count} records; the current report displays the first 50. For more records, please visit the Wind Global Enterprise Library website to conduct your search. The data presented is the result of Wind's big data mining based on public information and is provided for reference only. This information does not constitute any express or implied opinions or warranties.`
  }
  return `此维度共计${count}条记录，当前报告中显示前50条，如需更多记录，请登录万得全球企业库网站进行查询。以上数据是万得基于公开信息进行大数据挖掘的成果，仅供参考。该信息不构成任何明示或暗示的观点或保证。`
}

export const getNoDataLocaleFinance = (module: string | undefined, isEn: boolean) => {
  const dateStr = getTodayIntl(isEn)
  const moduleStr = module || ''
  if (isEn) {
    return `As of ${dateStr}, based on Wind's big data analysis, no information from the ${moduleStr} form proactively disclosed by this enterprise in the past three years could be found. It is possible that the information is not fully consistent with the objective facts due to reasons such as the source of public information not being disclosed yet, differences in the form of public disclosure, or delays in search timing. This is for customer reference only.`
  }
  return `截止${dateStr}，根据万得大数据分析，暂未查询到该企业近三年主动公示的${module}信息，不排除因信息公开来源尚未公开、公开形式存在差异、检索时间存在滞后等情况导致的信息与客观事实不完全一致的情形，仅供客户参考。`
}

export const getNoDataLocaleAuto = (module: string | undefined, key: TCorpDetailNodeKey, isEn: boolean) => {
  const financeKeys: TCorpDetailNodeKey[] = ['BalanceSheet', 'CashFlowStatement', 'ProfitStatement']
  if (financeKeys.indexOf(key) !== -1) {
    return getNoDataLocaleFinance(module, isEn)
  }
  return getNoDataLocale(module, isEn)
}

/**
 * 报告首页声明
 * @param isEn
 * @returns
 */
export const getRPCoverComment = ({ isEn }: { isEn: boolean }) => {
  const reportDate = getTodayIntl(isEn)
  return [
    isEn
      ? 'The content of this report is the data snapshot content as of ' +
        reportDate +
        '. The data is collected by Wind according to public information. Wind does not distinguish and verify the comprehensiveness, accuracy and authenticity of this report, and does not have relevant legal liabilities. The content of this report does not constitute clear or implied views or guarantees for anyone or enterprise. This report only provides reference for you. For the real results, please refer to the announcement results of each official website.'
      : '本报告内容为截至' +
        reportDate +
        '的数据快照内容，万得根据目标企业在相关信息公示、公开信息数据整理分析所得。万得不对本报告的全面、准确、真实性进行分辨和核验，不负相关法律责任，本报告内容不构成我们对任何人或企业之明示或暗示的观点或保证，仅为您提供参考，真实结果请以各官方网站的公布结果为准。',
    isEn
      ? 'This report is for business decision-making purposes only and shall not be used as a basis for legal proceedings or other illegal purposes. Without the consent or authorization from Wind, no part of this report may be disclosed to any third party. Under no circumstances will Wind be liable for any losses resulting from the reference to this report.'
      : '本报告仅供商业决策参考之用，不得用作法律诉讼的依据或是其他非法用途。未经万得同意或授权，不得向第三人透露本报告任何内容。在任何情况下，对由于参考本报告所造成的损失，万得不承担任何责任。',
  ]
}
