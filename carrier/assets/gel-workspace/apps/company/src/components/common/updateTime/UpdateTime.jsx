import { SynO } from '@wind/icons'
import { message } from '@wind/wind-ui'
import { useState } from 'react'
import { useGroupStore } from '../../../store/group'
import { intlNoIndex } from '../../../utils/intl'
import { wftCommon } from '../../../utils/utils'
import './updateTime.less'

const UpdateTime = ({ updateTime }) => {
  const [loading, setLoading] = useState(false)
  const basicInfo = useGroupStore((state) => state.basicInfo)
  const time = updateTime || basicInfo.corp_update_time
  return (
    <span className={`time-container ${loading ? 'active' : ''}`}>
      <SynO
        className="icon"
        onClick={() => {
          if (loading) return
          setLoading(true)
          message.success(intlNoIndex('347890', '数据更新中，请稍候刷新页面查看'))
          setTimeout(() => setLoading(false), 3200)
        }}
        data-uc-id="PO-HM-Z7ON"
        data-uc-ct="syno"
      />
      {intlNoIndex('138868', '更新时间')} <span className="">{wftCommon.formatTime(time)}</span>
    </span>
  )
}

export default UpdateTime
