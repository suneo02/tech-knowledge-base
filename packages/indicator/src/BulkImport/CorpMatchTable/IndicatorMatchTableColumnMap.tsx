import { IndicatorCorpMatchItem } from 'gel-api'
import { t } from 'gel-util/intl'

export const IndicatorMatchTableColumnMap: Record<keyof IndicatorCorpMatchItem, string> = {
  corpId: t('441914', '序号'),
  corpName: t('138677', '企业名称'),
  engName: t('138677', '企业名称'),
  creditCode: t('138808', '统一社会信用代码'),
  artificialPerson: t('419959', '法定代表人'),
  formerName: t('66281', '曾用名'),
  source: t('9754', '来源'),
  matched: t('', '匹配状态'),
  queryText: t('', '导入信息'),
}
