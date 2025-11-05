import React, { Suspense, lazy, useMemo } from 'react'
import { hashParams } from '../../utils/links/index'
import { isBaiFenTerminalOrWeb } from '@/utils/env'
import { isDeveloper } from '@/utils/common'

// 动态导入组件
const CompanyDetail = lazy(() => import('../CompanyDetail'))
const CompanyDetailAIRight = lazy(() => import('../CompanyDetailAIRight'))

export default function CompanyDetailEntry() {
  const moduleId = hashParams().getParamValue('moduleid')

  const isBaiFen = isBaiFenTerminalOrWeb()

  const component = useMemo(() => {
    // 如果moduleId存在，显示旧版
    if (moduleId) {
      return <CompanyDetail />
    }

    // 百分终端 或者 不是开发者 显示旧版
    if (isBaiFen) {
      return <CompanyDetail />
    }

    // 否则显示新版
    return <CompanyDetailAIRight />
  }, [isBaiFen, isDeveloper, moduleId])

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
