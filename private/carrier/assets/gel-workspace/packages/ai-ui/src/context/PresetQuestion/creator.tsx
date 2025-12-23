import { createContext, ReactNode, useContext, useState } from 'react'

export interface PresetQuestionContextType<T> {
  chatQuestions: T[]
  setChatQuestions: (questions: T[]) => void
}

export function createPresetQuestionContext<T>() {
  const Context = createContext<PresetQuestionContextType<T> | undefined>(undefined)

  const useQuestionContext = () => {
    const context = useContext(Context)
    if (!context) {
      throw new Error('useQuestionContext must be used within a QuestionProvider')
    }
    return context
  }

  const Privider = ({ children, initialQuestions }: { children: ReactNode; initialQuestions?: T[] }) => {
    const [chatQuestions, setChatQuestions] = useState<T[]>(initialQuestions || [])

    return (
      <Context.Provider
        value={{
          chatQuestions,
          setChatQuestions,
        }}
      >
        {children}
      </Context.Provider>
    )
  }

  return { Context, Privider, useQuestionContext }
}
