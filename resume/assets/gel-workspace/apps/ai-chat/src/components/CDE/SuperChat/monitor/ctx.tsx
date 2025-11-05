import { SuperListCdeMonitor } from 'gel-api'
import { createContext, FC, ReactNode } from 'react'

interface SuperListCdeMonitorContextType {
  monitorList: SuperListCdeMonitor[]
  setMonitorList: (list: SuperListCdeMonitor[]) => void
  totalCount: number
  setTotalCount: (count: number) => void
  subMail: string
  setSubMail: (mail: string) => void
}

const SuperListCdeMonitorContext = createContext<SuperListCdeMonitorContextType | undefined>(undefined)

interface SuperListCdeMonitorProviderProps {
  children: ReactNode
}

export const SuperListCdeMonitorProvider: FC<SuperListCdeMonitorProviderProps> = ({ children }) => {
  const [monitorList, setMonitorList] = useState<SuperListCdeMonitor[] | undefined>()
  const [totalCount, setTotalCount] = useState<number>(0)
  const [subMail, setSubMail] = useState<string>('')
  return (
    <SuperListCdeMonitorContext.Provider
      value={{
        monitorList: monitorList || [],
        setMonitorList,
        totalCount,
        setTotalCount,
        subMail,
        setSubMail,
      }}
    >
      {children}
    </SuperListCdeMonitorContext.Provider>
  )
}

export const useSuperListCdeMonitor = () => {
  const context = useContext(SuperListCdeMonitorContext)
  if (context === undefined) {
    throw new Error('useSuperListCdeMonitor must be used within a SuperListCdeMonitorProvider')
  }
  return context
}
