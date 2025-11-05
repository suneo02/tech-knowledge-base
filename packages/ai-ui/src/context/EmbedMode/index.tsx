import React, { createContext, useContext, ReactNode } from 'react'

interface EmbedModeContextType {
  isEmbedMode: boolean
}

const defaultContext: EmbedModeContextType = {
  isEmbedMode: false,
}

const EmbedModeContext = createContext<EmbedModeContextType>(defaultContext)

interface EmbedModeProviderProps {
  children: ReactNode
  isEmbedMode: boolean
}

export const EmbedModeProvider: React.FC<EmbedModeProviderProps> = ({ children, isEmbedMode }) => {
  return <EmbedModeContext.Provider value={{ isEmbedMode }}>{children}</EmbedModeContext.Provider>
}

export const useEmbedMode = () => useContext(EmbedModeContext)
