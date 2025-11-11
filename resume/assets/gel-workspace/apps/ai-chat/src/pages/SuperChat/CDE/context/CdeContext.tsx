import { createWFCSuperlistRequestFcs } from '@/api'
import { useSuperChatRoomContext } from '@/contexts/SuperChat'
import { useRequest, useSetState } from 'ahooks'
import { GetTableInfoResponse } from 'gel-api'
import { createContext, ReactNode, useContext } from 'react'

export interface CdeContextState extends GetTableInfoResponse {
  loading?: boolean
  setTableInfo: (tableInfo: GetTableInfoResponse) => void
}

export const CdeContext = createContext<CdeContextState | undefined>(undefined)

export const useCdeContext = () => {
  const context = useContext(CdeContext)
  if (!context) {
    throw new Error('useCdeContext must be used within a CdeProvider')
  }
  return context
}

interface CdeProviderProps {
  children: ReactNode
  tableId?: string
  conversationId?: string
  updateTableInfo?: (tableId: string, conversationId: string) => void
}

export const CdeProvider = ({ children }: CdeProviderProps) => {
  const { tableId, conversationId } = useSuperChatRoomContext()
  const getTableInfoApi = createWFCSuperlistRequestFcs('superlist/excel/getTableInfo')
  const [tableInfo, setTableInfo] = useSetState<GetTableInfoResponse>({
    tableName: '',
    cdeFilter: [],
    sheetInfos: [],
  })

  const { run: getTableInfo, loading } = useRequest(getTableInfoApi, {
    manual: true,
    refreshDeps: [tableId, conversationId],
    onSuccess: (data) => {
      if (data.Data) {
        setTableInfo(data.Data)
      }
    },
  })
  // const tableIdCache = useRef(tableId)

  // useEffect(() => {
  //   if (tableIdCache.current === tableId) return
  //   tableIdCache.current = tableId
  //   if (tableId && conversationId) {
  //     getTableInfo({ tableId, conversationId })
  //   }
  // }, [tableId, conversationId, getTableInfo])

  const value = {
    loading,
    ...tableInfo,
    updateTableInfo: getTableInfo,
    setTableInfo,
  }

  return <CdeContext.Provider value={value}>{children}</CdeContext.Provider>
}
