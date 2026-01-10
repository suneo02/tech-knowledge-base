// 定义 Key 常量
export const STORAGE_KEYS = {
  /** 开发者模式 */
  DEV: 'GEL_CB_LYX_LXH_ZWH',
  /** 引导页/开始挖掘页面的表单数据 */
  INTRODUCTORY_FORM: 'SUPER_AGENT_INTRODUCTORY_FORM',
} as const

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]

// 定义每个 Key 对应的数据类型
export interface StorageSchema {
  /**
   * 开发者模式标记
   */
  [STORAGE_KEYS.DEV]: 'GelDeveloper' | string

  /**
   * 引导页/开始挖掘页面的表单数据
   */
  [STORAGE_KEYS.INTRODUCTORY_FORM]: {
    companyCode: string | number
    companyName: string
    areaCodes: (string | number)[]
    productDesc: string
  }
}

// 封装操作方法
class StorageManager {
  setItem<K extends StorageKey>(key: K, value: StorageSchema[K]): void {
    try {
      // 针对 DEV 特殊处理，保持原有的纯字符串存储方式，以兼容旧代码或其他系统
      // 当然，如果确认其他地方也只通过这里存取，也可以统一 stringify
      // 鉴于用户需求是“限制 localStorage 的使用”，我们尽量统一行为。
      // 但为了兼容 PageContainer 中原本的逻辑（直接存的字符串），我们这里可以做个判断
      // 如果值是字符串，直接存；如果是对象，stringify。
      // 为了类型安全和统一，建议全部 stringify。
      // 但 PageContainer 读取时是 `=== 'GelDeveloper'`，说明存的时候没有引号。
      // 我们可以统一策略：存的时候都 stringify，读取的时候 parse。
      // 如果读取出来是字符串，则不需要 parse 或者 parse 后还是字符串。
      // 为了兼容旧的 'GelDeveloper' (非 JSON 格式字符串)，我们在 getItem 里做处理。

      const serializedValue = typeof value === 'string' ? value : JSON.stringify(value)
      localStorage.setItem(key, serializedValue)
    } catch (error) {
      console.error('Error saving to localStorage', error)
    }
  }

  getItem<K extends StorageKey>(key: K): StorageSchema[K] | null {
    try {
      const item = localStorage.getItem(key)
      if (item === null) return null

      // 尝试解析 JSON
      try {
        const parsed = JSON.parse(item)
        // 如果解析出来是字符串（例如存的是 "GelDeveloper"），或者对象，都直接返回
        return parsed as StorageSchema[K]
      } catch {
        // 解析失败，说明是普通字符串（例如存的是 GelDeveloper 无引号），直接返回
        return item as unknown as StorageSchema[K]
      }
    } catch (error) {
      console.error('Error reading from localStorage', error)
      return null
    }
  }

  removeItem(key: StorageKey): void {
    localStorage.removeItem(key)
  }
}

export const storage = new StorageManager()
