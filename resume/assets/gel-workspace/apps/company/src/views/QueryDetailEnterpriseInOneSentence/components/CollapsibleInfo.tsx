import React, { useState } from 'react'
import { DownOutlined, UpOutlined } from '@ant-design/icons'
import './CollapsibleInfo.less'
import { Tag } from '@wind/wind-ui'
import { t } from 'gel-util/intl'

interface CollapsibleInfoProps {
  title?: string
  data: string[]
}

interface InfoItem {
  label: string
  value: string
}

const CollapsibleInfo: React.FC<CollapsibleInfoProps> = ({ title = t('455062', '参考信息'), data }) => {
  const [isCollapsed, setIsCollapsed] = useState(true)

  if (!data?.length) return null

  const parseInfoItem = (item: string): InfoItem => {
    const [label, ...valueParts] = item.split(':')
    return {
      label: label.trim(),
      value: valueParts.join(':').trim(), // 处理值中可能包含冒号的情况
    }
  }

  return (
    <div className="collapsible-info">
      <div
        className="collapsible-header"
        onClick={() => setIsCollapsed(!isCollapsed)}
        data-uc-id="-VUz-ZdUuMq"
        data-uc-ct="div"
      >
        <span className="title">{title}</span>
        {isCollapsed ? <DownOutlined className="icon" /> : <UpOutlined className="icon" />}
      </div>
      <div className={`collapsible-content ${isCollapsed ? 'collapsed' : ''}`}>
        {data.map((item, index) => {
          const { label, value } = parseInfoItem(item)
          return (
            <p key={index} className="info-item">
              {/* @ts-ignore */}
              <Tag className={label === '分类' ? 'color-DPU' : 'color-corp'} data-uc-id="un1r0bA9J_U" data-uc-ct="tag">
                {label}
              </Tag>
              <span>{value}</span>
            </p>
          )
        })}
      </div>
    </div>
  )
}

export default CollapsibleInfo
