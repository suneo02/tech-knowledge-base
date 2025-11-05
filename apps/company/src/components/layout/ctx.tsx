import { createContext } from 'react'

// 定义类型
export type IConfigDetailModule = 'character' | 'company' | 'group'

// 创建上下文
export const ConfigDetailContext = createContext<IConfigDetailModule | null>(null)
