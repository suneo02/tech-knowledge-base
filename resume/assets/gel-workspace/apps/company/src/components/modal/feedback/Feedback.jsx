import { Radio } from '@wind/wind-ui'
import RadioGroup from '@wind/wind-ui/lib/radio/group'
import { useState } from 'react'
import intl from '../../../utils/intl'

const FeedbackModal = ({ name }) => {
  const [feedType, setFeedType] = useState()
  return (
    <div>
      <div className="feedback-nav">
        <div className="feedback-nav-type-title">{intl('283797', '反馈类型')}</div>
        <RadioGroup onChange={(e) => setFeedType(e.target.value)} value={feedType}>
          <Radio value={'数据纠错'}>{intl('138235', '数据纠错')}</Radio>
          <Radio value={'功能提升'}>{intl('138311', '功能提升')}</Radio>
          <Radio value={'其他建议'}>{intl('138421', '其他建议')}</Radio>
          <Radio value={'异议处理'}>{intl('366153', '异议处理')}</Radio>
        </RadioGroup>
      </div>
    </div>
  )
}

export default FeedbackModal
