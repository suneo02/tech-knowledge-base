# 企业名称 API 定义

## 字段契约

### 三字段模式

| 字段                 | 类型     | 说明                        |
| -------------------- | -------- | --------------------------- |
| `{field}`            | string   | 原始值                      |
| `{field}Trans`       | string?  | 翻译值（官方 → TRANS → AI） |
| `{field}AITransFlag` | boolean? | true=AI/TRANS，false=官方   |

### 企业名称字段

| 字段                  | 类型     | 说明         |
| --------------------- | -------- | ------------ |
| `corpName`            | string   | 原始企业名称 |
| `corpNameTrans`       | string?  | 翻译名称     |
| `corpNameAITransFlag` | boolean? | AI 标识      |

**命名规范**：所有字段统一使用驼峰命名

## 区域策略补充（2025-12）

- 中文环境（`zh-CN`）前端不再调用 AI 翻译，`corpNameTrans` 需由后端提供；否则仅展示 `corpName`。
- 英文环境（`en-US`）逻辑维持不变：原始为英文时仅展示原始；原始非英文时优先使用后端翻译，必要时可启用 AI（由业务控制）。

## 接口示例

```json
{
  "corpId": "123456",
  "corpName": "Apple Inc.",
  "corpNameTrans": "苹果公司",
  "corpNameAITransFlag": false
}
```

## 显示模式

| 模式   | 标识        | 行为           |
| ------ | ----------- | -------------- |
| 模式一 | `origin`    | 仅返回原始字段 |
| 模式二 | `only-data` | 返回完整三字段 |

详见：[全局显示模式](../i18n-display-modes.md)

## 相关文档

- [后端数据取值规则](./backend.md)
- [前端展示逻辑](./frontend.md)

## 相关代码

### 核心工具函数

- `packages/gel-util/src/misc/translate/companyName.ts` - 企业名称格式化工具
  - `deriveCorpNameInputFromRecord()` - 从对象提取字段
  - `formatEnterpriseNameMainWithAI()` - 主要位置格式化
  - `formatEnterpriseNameOther()` - 其余位置格式化

### 业务处理

- `apps/company/src/handle/corp/base/translate.ts` - 企业详情翻译处理
- `apps/company/src/views/GlobalSearch/components/result/MultiResultList/handleName.ts` - 搜索结果名称处理
  - `handleItemEn()` - 英文环境处理
  - `handleItemZh()` - 中文环境处理（移除前端 AI 回退）
  - `handleItem()` - 分派函数

### UI 组件

- `apps/company/src/views/GlobalSearch/components/result/components/SearchResult/info.tsx` - 搜索结果展示
- `packages/gel-ui/src/biz/corp/base/name/CompanyNameMain.tsx` - 企业名称主组件
- `packages/gel-ui/src/biz/common/ProvidedByAI/` - AI 标识组件
