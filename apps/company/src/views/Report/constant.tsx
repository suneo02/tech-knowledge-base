import { MenuItemProps } from '@/components/layout/SideMenuLayout/types'
import { isDev } from '@/utils/env'
import { usedInClient } from 'gel-util/env'
import { AliceLinkModule, getAlickLink } from 'gel-util/link'
import React from 'react'
import { ReportDeveloping, ReportUnlyInClient } from './comp'

export const getTreeData = (): MenuItemProps[] => {
  let bankCreditReport = undefined
  if (usedInClient()) {
    bankCreditReport = {
      title: '银行授信尽调报告',
      key: '5',
      ai: true,
      iframeUrl: getAlickLink(
        AliceLinkModule.EDITOR,
        {
          templateType: 'dueDiligence',
        },
        isDev
      ),
    }
  } else {
    bankCreditReport = {
      title: '银行授信尽调报告',
      key: '5',
      ai: true,
      content: <ReportUnlyInClient title="银行授信尽调报告" />,
    }
  }
  return [
    {
      title: '我的报告模板',
      key: 'template',
      children: [],
    },
    {
      title: '选择报告',
      key: 'report',
      children: [
        {
          title: '股权穿透分析报告',
          key: '321',
          iframeUrl: `${window.location.origin + '/Wind.WFC.Enterprise.Web/PC.Front'}/Company/GQCTRP_Preview.html?companyCode=1047934153`, // TODO
        },
        {
          title: '企业深度信用报告',
          key: '1',
          content: <ReportDeveloping title="企业深度信用报告" />,
        },
        {
          title: '尽职调查报告-高级版',
          key: '0',
          content: <ReportDeveloping title="尽职调查报告-高级版" />,
        },
        bankCreditReport,
      ],
      height: 200,
    },
  ]
}
