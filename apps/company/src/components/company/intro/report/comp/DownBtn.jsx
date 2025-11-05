import intl from '../../../../../utils/intl'
import { MyIcon } from '../../../../Icon'
import { Button } from '@wind/wind-ui'
import './DownBtn.less'

const StylePrefix = 'DownBtn'

export const ReportDownBtn = ({ onClick, iconName = 'doc_pdf' }) => {
  return (
    <Button className={StylePrefix} onClick={onClick}>
      <MyIcon name={iconName} className={`${StylePrefix}--icon`} />
      <span>{intl('437448', '下载报告')}</span>
    </Button>
  )
}
