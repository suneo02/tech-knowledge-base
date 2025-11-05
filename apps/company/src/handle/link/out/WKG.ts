/**
 * wind 图谱平台
 */
export enum WKGModule {
  COMPETITOR = 'competitor',
}

export const getWKGUrl = (
  module: WKGModule,
  options?: {
    companyName?: string
  }
) => {
  try {
    switch (module) {
      case WKGModule.COMPETITOR:
        return 'http://windkgserver/windkg/index.html#/competitors'
    }
  } catch {
    return null
  }
}
