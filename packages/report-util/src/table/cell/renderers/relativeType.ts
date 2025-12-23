import { DEFAULT_EMPTY_TEXT } from '../shared'
import { ReportSimpleTableCellRenderFunc } from '../type'

export const renderRelativeType: ReportSimpleTableCellRenderFunc = (value, _record, _config, { t }) => {
  switch (value) {
    case '1':
      return t('74323', '本公司')
    case '2':
      return t('204320', '分支机构')
    case '3':
      return t('138589', '控股企业')
    case '4':
      return t('138724', '对外投资')
    default:
      return DEFAULT_EMPTY_TEXT
  }
}
