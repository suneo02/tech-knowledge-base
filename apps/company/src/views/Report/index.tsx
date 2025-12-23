import { default as SideMenuLayout } from '@/components/layout/SideMenuLayout'
import { LinksModule } from '@/handle/link'
import { usePageTitle } from '@/handle/siteTitle'
import React from 'react'
import { getTreeData } from './constant'
import './index.less'

const Report: React.FC = () => {
  usePageTitle('ReportHome')
  const treeData = getTreeData()
  return (
    <SideMenuLayout
      module={LinksModule.REPORT_HOME}
      menu={treeData}
      menuStyle={{
        justifyContent: 'space-between',
      }}
    ></SideMenuLayout>
  )
}

export default Report
