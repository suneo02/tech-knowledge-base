import { IndicatorProductDetailRes } from 'gel-api'
import { createContext, ReactNode, useContext } from 'react'

export const DEFAULT_CONFIG: IndicatorProductDetailRes = {
  detailType: 'CORP',
  downloadUrl: `//wx.wind.com.cn/Wind.WFC.Enterprise.Web/PC.Front/customer/index.html#mylist`,
  matchCount: 2000,
  matchCountWithDay: { VIP: 2000, SVIP: 5000 },
  matchReportCount: 50,
  pathIndicatorIds: [78],
  permissionDescription: 'SVIP用户每日可批量查询5,000家企业，VIP用户每日可批量查询2,000家企业。',
  permissionDescriptionEn:
    'SVIP users can query 5,000 companies per day, and VIP users can query 2,000 companies per day.',
  productId: 1,
  productName: 'GEL',
  reportParentId: 139,
}

interface IndicatorContextType {
  config: typeof DEFAULT_CONFIG
}

const IndicatorContext = createContext<IndicatorContextType | null>(null)

interface IndicatorProviderProps {
  children: ReactNode
  config?: typeof DEFAULT_CONFIG
}

export const IndicatorProvider = ({ children, config = DEFAULT_CONFIG }: IndicatorProviderProps) => {
  return (
    <IndicatorContext.Provider
      value={{
        config,
      }}
    >
      {children}
    </IndicatorContext.Provider>
  )
}

export const useIndicator = () => {
  const context = useContext(IndicatorContext)
  if (!context) {
    throw new Error('useIndicator must be used within an IndicatorProvider')
  }
  return context
}
