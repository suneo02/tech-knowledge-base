# FilterResTip 组件设计文档

## 概述

FilterResTip 组件是用于展示企业搜索结果信息并允许用户选择添加企业数量至表格的交互组件。该组件能够显示搜索到的企业总数，最大可添加数量，以及根据用户选择的添加数量计算所需消耗的积分。

## 详细功能说明

1. **信息展示功能**：

   - 显示搜索到的企业总数
   - 显示最大可添加企业数量（不超过2000家）
   - 通过 Tooltip 提示系统限制

2. **数量选择功能**：

   - 提供数字输入框让用户输入具体的添加数量
   - 自动限制输入范围在 1 至最大可添加数量之间
   - 输入无效值时自动恢复至上一次有效值

3. **积分计算功能**：

   - 根据用户选择的添加数量实时计算所需积分
   - 显示积分消耗信息

4. **响应式布局**：
   - 在小屏幕设备上采用垂直布局
   - 在大屏幕设备上采用水平布局，提高空间利用率

## 参数说明

| 参数名         | 类型                    | 必填 | 描述                     |
| -------------- | ----------------------- | ---- | ------------------------ |
| total          | number \| undefined     | 是   | 搜索到的企业总数         |
| className      | string                  | 否   | 自定义CSS类名            |
| onAddNumChange | (value: number) => void | 否   | 添加数量变化时的回调函数 |

## 内部常量

| 常量名                   | 值   | 描述                       |
| ------------------------ | ---- | -------------------------- |
| CDE_MAX_ADD_TO_TABLE_NUM | 2000 | 最大可添加到表格的企业数量 |
| CDE_POINT_PER            | 1    | 每添加一家企业消耗的积分数 |

## 返回值说明

组件不直接返回值，但通过 `onAddNumChange` 回调函数将用户选择的添加数量传递给父组件。

## 使用示例

```tsx
import { FilterResTip } from '@/components/CDE/component/FilterResTip'

const MyComponent = () => {
  const [selectedCount, setSelectedCount] = useState<number>(0)
  const total = 50000 // 假设搜索结果有5万家企业

  const handleAddNumChange = (value: number) => {
    setSelectedCount(value)
    // 其他处理逻辑...
  }

  return (
    <div>
      <FilterResTip total={total} onAddNumChange={handleAddNumChange} />
      <div>已选择添加 {selectedCount} 家企业</div>
    </div>
  )
}
```
