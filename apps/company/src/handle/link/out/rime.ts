import { isTestSite } from '@/utils/env'
import intl from '@/utils/intl/index.ts'
import { wftCommon } from '@/utils/utils'
import { Modal } from '@wind/wind-ui'
import { getRimeOrganizationUrl, RimeTargetType } from 'gel-util/link'
export { getRimeOrganizationUrl, RimeHost, RimeHostMap, RimeTargetType } from 'gel-util/link'

const STRINGS = {
  TIP: intl('31041', '提示'),
  MORE: intl('272167', '更多'),
  RIME_DATA_TOOLTIP: intl('449776', '该数据由合作方 RimeData 来觅数据提供，如需查看详情请前往来觅官网查看'),
  SEEK: intl('257641', '查看'),
}

export const jumpToRimeUrl = ({
  id,
  isTerminal: isTerminalProp,
  type,
}: {
  id?: string
  isTerminal?: boolean
  type: RimeTargetType
}) => {
  const isTerminal = isTerminalProp != null ? isTerminalProp : wftCommon.usedInClient()

  if (!isTerminal) {
    Modal.info({
      title: STRINGS.TIP,
      content: STRINGS.RIME_DATA_TOOLTIP,
      okText: STRINGS.SEEK,
      onOk: () => {
        window.open('https://www.rimedata.com/')
      },
    })
    return
  }
  if (type === RimeTargetType.VERTICAL_HOME) {
    window.open('//RIME/rime/frontend/web/vertical/all')
    return
  }
  const url = getRimeOrganizationUrl({ id, type, isTestSite: isTestSite() })
  if (url) {
    window.open(url, '_blank')
  }
}
