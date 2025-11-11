/**
 * wind 图谱平台
 */
import { usedInClient } from '@/env'
export enum WKGModule {
  COMPETITOR = 'competitor',
}

export const getWKGUrl = (module: WKGModule) => {
  console.log('🚀 ~ getWKGUrl ~ module:', module)
  try {
    switch (module) {
      case WKGModule.COMPETITOR:
        // 仅终端环境可用
        if (usedInClient()) {
          return 'http://windkgserver/windkg/index.html#/competitors'
        }
        return ''
    }
  } catch {
    return null
  }
}
