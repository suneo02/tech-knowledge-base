import React, { createContext, ReactNode, useContext, useState } from 'react'

interface HistoryContextType {
  showHistory: boolean
  setShowHistory: React.Dispatch<React.SetStateAction<boolean>>
  searchKeyword: string
  setSearchKeyword: React.Dispatch<React.SetStateAction<string>>
  selectedHistoryIds: string[]
  setSelectedHistoryIds: React.Dispatch<React.SetStateAction<string[]>>
  isSelectionMode: boolean
  setSelectionMode: React.Dispatch<React.SetStateAction<boolean>>
  clearSearch: () => void
  clearSelection: () => void
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined)

export const HistoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [showHistory, setShowHistory] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [selectedHistoryIds, setSelectedHistoryIds] = useState<string[]>([])
  const [isSelectionMode, setSelectionMode] = useState(false)

  // 清除搜索
  const clearSearch = () => {
    setSearchKeyword('')
  }

  // 清除选择
  const clearSelection = () => {
    setSelectedHistoryIds([])
    setSelectionMode(false)
  }

  return (
    <HistoryContext.Provider
      value={{
        showHistory,
        setShowHistory,
        searchKeyword,
        setSearchKeyword,
        selectedHistoryIds,
        setSelectedHistoryIds,
        isSelectionMode,
        setSelectionMode,
        clearSearch,
        clearSelection,
      }}
    >
      {children}
    </HistoryContext.Provider>
  )
}

export const useHistory = (): HistoryContextType => {
  const context = useContext(HistoryContext)
  if (!context) {
    throw new Error('useHistory must be used within a HistoryProvider')
  }
  return context
}
