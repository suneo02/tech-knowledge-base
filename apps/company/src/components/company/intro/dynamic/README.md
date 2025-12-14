# 动态标签页组件 (DynamicTabs)

## 概述

`DynamicTabs` 是一个智能的标签页组件，包含动态、舆情、商机三个标签页。该组件具备智能初始化功能，在组件加载时会自动选择第一个有数据的标签页作为初始活跃标签页。

## 初始化逻辑

### 核心特性

1. **自动数据加载**：切换到新标签页时自动加载数据
2. **智能初始化**：组件初始化时自动选择有数据的标签页
3. **防重复加载**：每个标签页的数据只加载一次
4. **加载状态管理**：数据加载时禁用用户交互

### 初始化规则

#### 标签页优先级
按以下顺序进行初始化检查：
1. **动态** (`dongtai`) - 始终显示
2. **舆情** (`yuqing`) - 个体工商户不显示
3. **商机** (`shangji`) - 仅在客户端且中文环境显示

#### 初始化触发时机
- 仅在组件首次加载时执行一次
- 通过 `isInitialized` 状态控制，避免重复执行

#### 初始化流程
```
组件加载
    ↓
按优先级检查第一个标签页
    ↓
未加载？ → 加载数据 → 检查是否有数据
已加载？ → 直接检查是否有数据
    ↓
有数据？ → 设为初始活跃标签页 ✅
无数据？ → 继续检查下一个标签页
    ↓
所有标签页都无数据 → 使用第一个可见标签页
```

### 技术实现

#### 数据加载状态管理
每个标签页使用独立的 Hook 管理数据：
- `useDynamicEvents` - 动态事件数据
- `useBusinessOpportunity` - 商机数据  
- `usePublicOpinion` - 舆情数据

每个 Hook 提供统一的状态接口：
```typescript
{
  data: any,           // 数据内容
  loading: boolean,    // 加载状态
  hasLoaded: boolean,  // 是否已尝试加载
  hasData: boolean,    // 是否有数据
  fetchData: () => Promise<void>, // 加载函数
  error?: Error        // 错误信息
}
```

#### 防重复加载机制
使用 `useRef` 跟踪加载状态：
```typescript
const hasLoadedRef = useRef(false)

const fetchData = useCallback(() => {
  if (!companycode || hasLoadedRef.current) {
    return Promise.resolve()
  }
  hasLoadedRef.current = true // 请求开始时立即标记
  return run()
}, [companycode, run])
```

#### 数据获取和检查
```typescript
// 直接基于数据结果判断，避免状态更新延迟
const fetchTabData = async (key: DynamicTabsKey): Promise<boolean> => {
  let data: any
  
  switch (key) {
    case 'dongtai':
      data = await fetchDynamicEvents() // 直接返回数据
      return checkHasDataFromResult(key, data) // 立即检查
    // ...
  }
}

// 基于实际数据结构判断是否有数据
const checkHasDataFromResult = (key: DynamicTabsKey, data: any): boolean => {
  switch (key) {
    case 'dongtai':
      return Array.isArray(data) && data.length > 0
    case 'yuqing':
      return Array.isArray(data) && data.length > 0
    case 'shangji':
      return data && (data.data?.length > 0 || data.list?.length > 0 || Object.keys(data).length > 0)
    default:
      return false
  }
}
```

#### 初始化实现
```typescript
const [isInitialized, setIsInitialized] = useState(false)

useEffect(() => {
  if (isInitialized) return // 只在初始化时执行一次
  
  const initializeActiveTab = async () => {
    // 从第一个可见 tab 开始检查
    for (const tab of availableTabs) {
      let hasData = false
      
      // 如果该 tab 还没有加载数据，先加载并获取结果
      if (!getCurrentTabHasLoaded(tab)) {
        hasData = await fetchTabData(tab)
      } else {
        // 如果已经加载过，直接检查是否有数据
        hasData = getCurrentTabHasData(tab)
      }
      
      // 如果该 tab 有数据，设为 active tab
      if (hasData) {
        setTabKey(tab)
        setIsInitialized(true)
        return
      }
    }
    
    // 如果所有 tab 都没有数据，使用第一个可见 tab
    if (availableTabs.length > 0) {
      setTabKey(availableTabs[0])
    }
    setIsInitialized(true)
  }
  
  initializeActiveTab()
}, [availableTabs, getCurrentTabHasLoaded, getCurrentTabHasData, fetchTabData, isInitialized])
```

### 使用示例

```typescript
<DynamicTabs
  companycode="000001.SZ"
  baseInfo={corpBasicInfo}
  ifIndividualBusiness={false}
/>
```

### 环境适配

#### 标签页显示规则
- **动态标签页**：始终显示
- **舆情标签页**：个体工商户不显示 (`!ifIndividualBusiness`)
- **商机标签页**：客户端且中文环境才显示 (`usedInClient() && getLocale() === 'zh-CN'`)

#### 多语言支持
- 支持中英文切换
- 舆情数据支持自动翻译
- 动态事件支持多语言显示

### 性能优化

1. **按需加载**：只有切换到标签页时才加载数据
2. **缓存机制**：数据加载后缓存，避免重复请求
3. **函数稳定性**：使用 `useCallback` 确保函数引用稳定
4. **状态优化**：避免不必要的重新渲染

### 错误处理

1. **网络错误**：显示错误信息，不影响其他标签页
2. **数据异常**：空数据处理，触发智能切换
3. **加载超时**：使用 `useRequest` 内置的错误处理

### 调试信息

开发环境下可以通过以下方式查看状态：
```javascript
// 在浏览器控制台查看当前状态
console.log({
  currentTab: tabKey,
  availableTabs,
  dynamicState: { hasLoaded: dynamicHasLoaded, hasData: dynamicHasData, loading: dynamicLoading },
  businessState: { hasLoaded: businessHasLoaded, hasData: businessHasData, loading: businessLoading },
  opinionState: { hasLoaded: opinionHasLoaded, hasData: opinionHasData, loading: opinionLoading }
})
```

### 注意事项

1. **数据依赖**：确保 `companycode` 有效，否则不会加载数据
2. **环境检查**：不同环境下标签页显示规则不同
3. **状态同步**：智能切换依赖准确的数据状态，确保状态及时更新
4. **用户体验**：加载时禁用交互，避免用户误操作

## 更新日志

### v1.0.0
- 实现基础标签页功能
- 添加智能切换逻辑
- 支持多环境适配
- 集成 ahooks useRequest
- 完善错误处理机制
