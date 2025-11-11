import intl from '@/utils/intl'
import { useGroupStore } from '@/store/group'
import { wftCommon } from '@/utils/utils'
import './extraLinks.less'
import { RightO } from '@wind/icons'

const ExtraLinks = (node) => {
  const basicInfo = useGroupStore((state) => state.basicInfo)
  const url = `CompanyChart.html?companycode=${basicInfo.corp_id}&companyid=${basicInfo.corp_old_id}&companyname=${basicInfo.corp_name}#chart_yskzr`
  return (
    <a
      className="extra-links-container"
      onClick={() => wftCommon.jumpJqueryPage(url)}
      data-uc-id="wMdkFXxvuN"
      data-uc-ct="a"
    >
      <span>{intl(node.extraLinks.titleId, node.extraLinks.title)}</span>
      <RightO data-uc-id="n3xYZo3Ilb" data-uc-ct="righto" />
    </a>
  )
}

export default ExtraLinks
