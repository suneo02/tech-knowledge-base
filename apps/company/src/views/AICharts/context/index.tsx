import React, { createContext, useContext, useState, ReactNode } from 'react'
import { AIGraphMenuKey, BuildGraphItem } from '../types'
import { AIGRAPH_MENU_ITEMS } from '../contansts'

/**
 * @description AI图谱上下文状态接口
 */
interface AIGraphContextState {
    selectedKeys: AIGraphMenuKey[]
    buildGraphItem: BuildGraphItem | null
    companyCode: string
    companyName: string
}

/**
 * @description AI图谱上下文方法接口
 */
interface AIGraphContextMethods {
    setSelectedKeys: (keys: AIGraphMenuKey[]) => void
    setBuildGraphItem: (item: BuildGraphItem | null) => void
    setCompanyCode: (code: string) => void
    setCompanyName: (name: string) => void
}

/**
 * @description AI图谱上下文接口
 */
interface AIGraphContextType extends AIGraphContextState, AIGraphContextMethods { }

/**
 * @description AI图谱上下文默认值
 */
const defaultContextValue: AIGraphContextType = {
    selectedKeys: [AIGRAPH_MENU_ITEMS[0]?.key],
    buildGraphItem: null,
    companyCode: '',
    companyName: '',
    setSelectedKeys: () => { },
    setBuildGraphItem: () => { },
    setCompanyCode: () => { },
    setCompanyName: () => { },
}

/**
 * @description AI图谱上下文
 */
const AIGraphContext = createContext<AIGraphContextType>(defaultContextValue)

/**
 * @description AI图谱Provider属性接口
 */
interface AIGraphProviderProps {
    children: ReactNode
    initialCompanyCode?: string
    initialCompanyName?: string
}

/**
 * @description AI图谱Provider组件
 * @author bcheng<bcheng@wind.com.cn>
 */
export const AIGraphProvider: React.FC<AIGraphProviderProps> = ({
    children,
    initialCompanyCode = '',
    initialCompanyName = '',
}) => {
    const [selectedKeys, setSelectedKeys] = useState<AIGraphMenuKey[]>([AIGRAPH_MENU_ITEMS[0]?.key])
    const [buildGraphItem, setBuildGraphItem] = useState<BuildGraphItem | null>(null)
    const [companyCode, setCompanyCode] = useState(initialCompanyCode)
    const [companyName, setCompanyName] = useState(initialCompanyName)

    const value = {
        selectedKeys,
        buildGraphItem,
        companyCode,
        companyName,
        setSelectedKeys,
        setBuildGraphItem,
        setCompanyCode,
        setCompanyName,
    }

    return <AIGraphContext.Provider value={value}>{children}</AIGraphContext.Provider>
}

/**
 * @description 使用AI图谱上下文的Hook
 */
export const useAIGraph = () => {
    const context = useContext(AIGraphContext)
    if (!context) {
        throw new Error('useAIGraph must be used within an AIGraphProvider')
    }
    return context
}

interface ChartData {
    relations?: any[]
    nodes?: any[]
    [key: string]: any
}

interface AIChartContextType {
    fetching: boolean
    setFetching: (value: boolean) => void
    chatData: ChartData | null
    setChatData: (data: ChartData | null) => void
    chatId: string
    setChatId: (id: string) => void
    historyChatId: string
    setHistoryChatId: (id: string) => void
}

const AIChartContext = createContext<AIChartContextType | null>(null)

export const AIChartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [fetching, setFetching] = useState(false)
    const [chatData, setChatData] = useState<ChartData | null>(null)
    const [chatId, setChatId] = useState('')
    const [historyChatId, setHistoryChatId] = useState('')

    return (
        <AIChartContext.Provider value={{ fetching, setFetching, chatData, setChatData, chatId, setChatId, historyChatId, setHistoryChatId }}>
            {children}
        </AIChartContext.Provider>
    )
}

export const useAIChartContext = () => {
    const context = useContext(AIChartContext)
    if (!context) {
        throw new Error('useAIChartContext must be used within an AIChartProvider')
    }
    return context
} 