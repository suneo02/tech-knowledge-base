import { createContext, ReactNode, useContext, useState } from 'react'

interface DevContextState {
  isDevMode: boolean
  setIsDevMode: (value: boolean) => void
  showDebugPanel: boolean
  setShowDebugPanel: (value: boolean) => void
}

const DevContext = createContext<DevContextState | undefined>(undefined)

export const useDevContext = () => {
  const context = useContext(DevContext)
  if (!context) {
    throw new Error('useDevContext must be used within a DevProvider')
  }
  return context
}

interface DevProviderProps {
  children: ReactNode
}

const DevProvider = ({ children }: DevProviderProps) => {
  const [isDevMode, setIsDevMode] = useState(process.env.NODE_ENV === 'development')
  const [showDebugPanel, setShowDebugPanel] = useState(false)

  const value = {
    isDevMode,
    setIsDevMode,
    showDebugPanel,
    setShowDebugPanel,
  }

  return <DevContext.Provider value={value}>{children}</DevContext.Provider>
}

export default DevProvider
