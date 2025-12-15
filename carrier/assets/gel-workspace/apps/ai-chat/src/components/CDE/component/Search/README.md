# CDE Search 组件文档

## 1. 概述 (Overview)

`CDESearch` 是一个功能强大的企业高级筛选组件，旨在提供一体化的数据筛选、预览和提取体验。它通过一个独立的弹窗界面，让用户可以构建复杂的查询条件、实时查看匹配的企业数量，并最终将数据提取到新的或已有的表格中。

### 核心功能

- **动态查询构建**：用户可以通过可视化的菜单，自由组合多个筛选条件。
- **即时结果反馈**：在用户调整筛选条件时，系统会实时计算并显示符合条件的企业总数。
- **便捷的弹窗调用**：通过 `useCDEModal` Hook，可以像 Ant Design 的 `Modal.useModal()` 一样，在任何组件中轻松地以命令式方式唤起搜索弹窗。
- **条件保存与复用**：用户可以将常用的筛选条件组合保存起来，以便未来快速调用。
- **灵活的数据提取**：支持将筛选结果作为新表格创建，或直接追加到当前已打开的表格中。

---

## 2. 组件架构 (Architecture)

组件遵循关注点分离的原则，将 UI、状态管理、业务逻辑和 API 调用分离到不同的模块中，确保了代码的清晰度和可维护性。

```
src/components/CDE/component/Search/
├── CDEModal/                   # 弹窗调用逻辑
│   ├── index.tsx               # 提供 useCDEModal Hook
│   └── index.module.less       # 样式文件
├── CDESearch/                  # 搜索组件核心
│   └── index.tsx               # 搜索主界面
├── components/                 # UI 子组件
│   ├── Footer/                 # 搜索弹窗的页脚，包含操作按钮
│   └── container/              # 容器组件
├── hooks/                      # 自定义 Hooks
│   └── useApi.ts               # 封装数据请求逻辑
├── index.tsx                   # 模块统一出口 (当前为空，待补充)
├── README.md                   # 组件文档
└── 评审.md                     # 代码评审记录
```

---

## 3. 核心 API

### `useCDEModal()`

这是与该组件交互的主要入口。它是一个自定义 Hook，用于在任何函数组件中获取弹窗的控制器和必要的上下文节点。

- **返回值**: `[api, contextHolder]`
  - `api`: `object` - 包含用于控制弹窗方法的对象。
    - `show(options?: object)`: `() => void` - 打开搜索弹窗。
      - `options.tableId?`: `string` - 当前表格的 ID。如果提供，页脚将显示"至当前表格"选项。
      - `options.sheetId?`: `string` - 当前工作表的 ID。
  - `contextHolder`: `React.ReactNode` - 一个必须在你的组件树中渲染的 React 节点。它负责处理弹窗的实际渲染。

---

## 4. 使用示例 (Usage Example)

### 在页面或组件中使用

在任何需要触发企业高级筛选弹窗的组件中，调用 `useCDEModal` Hook。

```tsx
import { useCDEModal } from '@/components/CDE/component/Search/CDEModal' // 请根据实际路径调整
import { Button } from '@wind/wind-ui'

const MyFeatureComponent = () => {
  // 1. 获取 modal API 和 contextHolder
  const [modal, contextHolder] = useCDEModal()

  const handleOpenModal = () => {
    // 2. 调用 show 方法，并按需传递参数
    modal.show({
      tableId: 'current_table_id_123',
      sheetId: 'current_sheet_id_abc',
    })
  }

  return (
    <div>
      <Button onClick={handleOpenModal}>打开企业高级筛选</Button>

      {/* 3. 必须在组件的某个地方渲染 contextHolder */}
      {contextHolder}
    </div>
  )
}
```

**注意**：`contextHolder` 是弹窗能够被正确渲染的关键，请确保它始终存在于你的组件返回值中。
