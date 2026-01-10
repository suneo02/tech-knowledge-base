import { isDev } from '@/utils/env'
import { isBaiFenTerminalOrWeb } from '@/utils/utilCallWftCommon'
import React, { Suspense, lazy, useMemo } from 'react'
import { hashParams } from '../../utils/links/index'

// 动态导入组件
const CompanyDetail = lazy(() => import('../CompanyDetail'))
const CompanyDetailAIRight = lazy(() => import('../CompanyDetailAIRight'))

export default function CompanyDetailEntry() {
  const moduleId = hashParams().getParamValue('moduleid')
  const isShfic = hashParams().getParamValue('isShfic')
  const isold = hashParams().getParamValue('isold')

  const isBaiFen = isBaiFenTerminalOrWeb()

  const component = useMemo(() => {
    if (isold && isDev) {
      return <CompanyDetail />
    }

    // 如果moduleId存在，显示旧版
    if (moduleId) {
      return <CompanyDetail />
    }

    // 上海工商联页面 显示旧版
    if (isShfic) {
      return <CompanyDetail />
    }

    // 百分终端 或者 不是开发者 显示旧版
    if (isBaiFen) {
      return <CompanyDetail />
    }

    // 否则显示新版
    return <CompanyDetailAIRight />
  }, [isBaiFen, moduleId])

  return (
    <Suspense
      fallback={
        <>
          <div></div>
        </>
      }
    >
      {component}
    </Suspense>
  )
}
