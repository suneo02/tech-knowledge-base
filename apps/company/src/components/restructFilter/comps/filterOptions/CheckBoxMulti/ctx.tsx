import { useSelection } from 'cde'
import { CDEFilterOption } from 'gel-api'
import React, { createContext, FC, ReactNode, useContext } from 'react'

// The return type of useSelection is the shape of our context
export type SelectionContextType = ReturnType<typeof useSelection> & {
  optionsFromConfig: CDEFilterOption[]
}

const SelectionContext = createContext<SelectionContextType | null>(null)

export const useSelectionContext = () => {
  const context = useContext(SelectionContext)
  if (!context) {
    throw new Error('useSelectionContext must be used within a SelectionProvider')
  }
  return context
}

export const SelectionProvider: FC<{
  optionsFromConfig: CDEFilterOption[]
  value: string[]
  onChange: (value: string[]) => void
  children: ReactNode
}> = ({ optionsFromConfig, value, onChange, children }) => {
  const selection = useSelection(optionsFromConfig, value, onChange)
  return <SelectionContext.Provider value={{ ...selection, optionsFromConfig }}>{children}</SelectionContext.Provider>
}
