// @ts-nocheck
import React from 'react'

import Sider from '@wind/wind-ui/lib/layout/Sider'

/**
 * 对话组件，包含AI对话和详情目录两个标签页
 */
const SiderTabs: React.FC = () => {
  return (
    <Sider width={400}>
      <iframe
        src="https://您的域名/embed-chat?initialMsg=分析一下这个公司的竞争优势&entityType=company&entityName=阿里巴巴"
        width="100%"
        // height=""
        frameBorder="0"
      ></iframe>
    </Sider>
  )
}

export default SiderTabs
