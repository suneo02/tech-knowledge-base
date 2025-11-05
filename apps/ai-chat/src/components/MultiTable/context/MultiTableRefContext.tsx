import { ListTable } from '@visactor/vtable'
import { createContext, useContext, useRef, ReactNode } from 'react'

// 创建 MultiTableRef 的 Context
interface MultiTableRefContextType {
  multiTableRef: React.RefObject<ListTable>
  setMultiTableInstance: (instance: ListTable | null) => void
}

// 创建 Context
const MultiTableRefContext = createContext<MultiTableRefContextType | undefined>(undefined)

// 提供 hook 方便使用 context
export const useMultiTableRef = () => {
  const context = useContext(MultiTableRefContext)
  if (!context) {
    throw new Error('useMultiTableRef 必须在 MultiTableRefProvider 内部使用')
  }
  return context
}

// 创建 Provider 组件
export const MultiTableRefProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const multiTableRef = useRef<ListTable>(null)

  const setMultiTableInstance = (instance: ListTable | null) => {
    if (instance && multiTableRef.current !== instance) {
      multiTableRef.current = instance
    }
  }

  return (
    <MultiTableRefContext.Provider value={{ multiTableRef, setMultiTableInstance }}>
      {children}
    </MultiTableRefContext.Provider>
  )
}
