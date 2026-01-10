---
title: ShareRateIdentifier 展示逻辑重构 - 方案设计
version: v1
status: 进行中
---

# ShareRateIdentifier 展示逻辑重构 - 方案设计

[返回任务概览](./README.md)

## 设计目标

统一使用后端 `showShareRate` 字段 + `formatText` 包装展示股权比例，移除前端复杂格式化逻辑。

## 涉及位置

| 文件                                 | 模块              | 当前逻辑                                          |
| ------------------------------------ | ----------------- | ------------------------------------------------- |
| `base/finalBeneficiary.tsx`          | 受益所有人/自然人 | `displayPercent(txt)`                             |
| `base/finalBeneficiary.tsx`          | 受益机构          | `shareRate\|formatPercent`（无需修改）            |
| `history/beneficiary.tsx`            | 历史受益人        | `formatPercent(txt)` + `ultimateBeneficialShares` |
| `history/ultimateController.tsx`     | 历史实控人        | `showChain` 函数                                  |
| `base/suspectedActualController.tsx` | 疑似实控人        | `showChain` 函数                                  |
| `base/publishActualController.tsx`   | 公告披露实控人    | `showChain` 函数                                  |
| `base/shareSearch.tsx`               | 股东穿透          | `displayPercent(txt)`                             |
| `corpCompMisc.tsx`                   | showChain 函数    | `displayPercent(rate)`                            |
| `utils/utils.tsx`                    | showRoute 函数    | `displayPercent(header.shareRate)`                |

## 核心改动

### 1. 创建 ShareRateWithRoute 组件

```typescript
// @see components/common/ShareRateWithRoute.tsx（新建）
interface ShareRateWithRouteProps {
  value: string
  hasRoute: boolean
  onRouteClick: () => void
}

export const ShareRateWithRoute: React.FC<ShareRateWithRouteProps> = ({ value, hasRoute, onRouteClick }) => {
  if (!hasRoute) {
    return <>{value}</>
  }
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <div style={{ flex: 1 }}>{value}</div>
      <div className="share-route" onClick={onRouteClick} />
    </div>
  )
}
```

### 2. 列表展示（render 函数）

```typescript
// 修改前
fields: ['NO.', 'name', 'shareRate', 'beneficType', 'judgeReason']
render: (txt, row) => {
  if (window.en_access_config) {
    return wftCommonType.displayPercent(txt)
  }
  // ... 复杂的格式化逻辑
  return wftCommonType.displayPercent(txt)
}

// 修改后
fields: ['NO.', 'name', 'showShareRate', 'beneficType', 'judgeReason']
render: (txt, row) => {
  return (
    <ShareRateWithRoute
      value={formatText(txt)}
      hasRoute={row.shareRoute?.length > 0}
      onRouteClick={() => wftCommon.showRoute(row.shareRoute)}
    />
  )
}
```

**说明**：

- fields 使用 `showShareRate`（不使用管道符）
- render 中调用 `formatText(txt)` 格式化
- 使用 `ShareRateWithRoute` 组件统一处理股权路径按钮

### 3. showChain 和 showRoute 函数

保持函数签名不变，内部改用 `formatText(row.showShareRate)` 或 `formatText(header.showShareRate)`。

## 变更对比

| 位置        | 修改前                             | 修改后                                   |
| ----------- | ---------------------------------- | ---------------------------------------- |
| fields      | `shareRate`                        | `showShareRate`                          |
| 列表 render | `displayPercent(txt)`              | `formatText(txt)` + `ShareRateWithRoute` |
| showChain   | `displayPercent(rate)`             | `formatText(showShareRate)`              |
| showRoute   | `displayPercent(header.shareRate)` | `formatText(header.showShareRate)`       |

## 验收标准

- 中英文环境都使用 `showShareRate` + `formatText`
- 移除 `ultimateBeneficialShares` 等复杂计算
- 移除 `window.en_access_config` 判断
- 股权路径弹窗正常
- 9 个展示位置一致

## 相关

- [实施计划](./spec-implementation-plan-v1.md)
- [ShareRateIdentifier 类型](/packages/types/src/corp/shareholder/index.ts)
