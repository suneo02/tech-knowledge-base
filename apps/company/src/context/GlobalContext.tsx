import React from 'react'

export const GlobalContext = React.createContext({
  language: 'zh',
  theme: 'default',
})

export const { Provider, Consumer } = GlobalContext
