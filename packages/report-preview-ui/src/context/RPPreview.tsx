import { useTreeHiddenStatus } from '@/hooks'
import { DataNode } from '@wind/wind-ui/lib/tree'
import { AxiosInstance } from 'axios'
import { CorpBasicInfo, CorpBasicNumFront, CorpOtherInfo, ReportPageJson, UserPackageInfo } from 'gel-types'
import { isEn } from 'gel-util/intl'
import { createContext, FC, ReactNode, useContext, useMemo } from 'react'
import { getCorpName } from 'report-util/misc'
import { convertReportConfigToTreeNodes } from '../utils/convertReportConfigToTreeNodes'

export interface RPPreviewProviderProps {
  corpBasicNum: Partial<CorpBasicNumFront> | undefined
  corpOtherInfo: CorpOtherInfo | undefined
  corpBasicInfo: CorpBasicInfo | undefined
  corpBasicInfoFetched: boolean
  corpBasicNumFetched: boolean
  corpOtherInfoFetched: boolean

  corpCode: string | undefined
  packageInfo: UserPackageInfo | undefined
  isPackageInfoFetched: boolean

  reportConfig: ReportPageJson

  axiosInstance: AxiosInstance
  apiTranslate: (data: any) => Promise<any>
  isDev: boolean
  getWsid: () => string

  onCorpSwitch: (corpCode: string) => void

  reportTitle: string
}

interface RPPreviewCtxType extends RPPreviewProviderProps {
  corpName: string
  ifAllFetched: boolean
  originalTreeNodes: DataNode[]
  hiddenNodeIds: string[]
  handleToggleNodeVisibility: (nodeId: string) => void
}

export const RPPreviewCtx = createContext<RPPreviewCtxType | undefined>(undefined)

export const useRPPreviewCtx = () => {
  const ctx = useContext(RPPreviewCtx)
  if (!ctx) throw new Error('useRPPreviewCtx 必须在 RPPreviewCtxProvider 内部使用')
  return ctx
}

export const RPPreviewCtxProvider: FC<
  {
    children: ReactNode
  } & RPPreviewProviderProps
> = ({ children, ...props }) => {
  const ifAllFetched = useMemo(() => {
    return (
      props.corpBasicInfoFetched &&
      props.corpBasicNumFetched &&
      props.corpOtherInfoFetched &&
      props.isPackageInfoFetched
    )
  }, [props.corpBasicInfoFetched, props.corpBasicNumFetched, props.corpOtherInfoFetched, props.isPackageInfoFetched])

  const corpName = getCorpName(props.corpBasicInfo, isEn())

  const originalTreeNodes = useMemo(() => {
    return convertReportConfigToTreeNodes(props.reportConfig)
  }, [props.reportConfig])

  const { hiddenNodeIds, handleToggleNodeVisibility } = useTreeHiddenStatus(originalTreeNodes)

  return (
    <RPPreviewCtx.Provider
      value={{
        corpName,
        ifAllFetched,
        originalTreeNodes,
        hiddenNodeIds,
        handleToggleNodeVisibility,
        ...props,
      }}
    >
      {children}
    </RPPreviewCtx.Provider>
  )
}
