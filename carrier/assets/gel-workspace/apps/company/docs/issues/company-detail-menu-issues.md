# 企业详情页菜单配置逻辑问题

## 问题概览

| 项目             | 内容                                             |
| ---------------- | ------------------------------------------------ |
| **标题**         | 企业详情页菜单配置逻辑复杂且存在全局状态污染风险 |
| **状态**         | ✅ 已解决                                        |
| **优先级**       | 🟡 中                                            |
| **责任人**       | suneo                                            |
| **发现时间**     | 2024-11-06                                       |
| **目标上线时间** | 2024-11-06                                       |

## 背景与预期

企业详情页需要根据不同企业类型展示差异化菜单配置。预期应具备清晰的菜单逻辑、避免全局状态污染、支持多种企业类型切换。

## 问题陈述

### 现象

1. **代码重复严重**：`CompanyDetail/index.tsx:391-445` 存在大量重复的菜单替换逻辑
2. **全局状态污染**：直接修改 `CompanyDetailBaseMenus` 全局对象，存在多实例风险
3. **逻辑分散**：菜单配置逻辑分散在多个 useEffect 中，难以追踪维护
4. **时序依赖**：菜单初始化与切换存在时序依赖关系

### 根因

**问题来源**：`apps/company/src/views/CompanyDetail/index.tsx:391-445`

```typescript
// 重复的菜单切换逻辑（50+ 行）
if (getIfIndividualBusiness(res.data.corp_type, res.data.corp_type_id)) {
  const menusNew = getCorpDetailIndividualMenus()
  for (const k in CompanyDetailBaseMenus) {
    delete CompanyDetailBaseMenus[k] // ❌ 直接修改全局对象
  }
  for (const k in menusNew) {
    CompanyDetailBaseMenus[k] = menusNew[k]
  }
} // ... 5 个 else if 分支重复相同逻辑
```

**根本原因**：
- 直接操作全局 `CompanyDetailBaseMenus` 对象
- 缺乏统一的菜单获取封装
- 菜单配置与组件状态紧耦合

### 影响

- **可维护性差**：新增企业类型需修改多处代码
- **潜在 Bug**：全局修改可能影响其他页面
- **测试困难**：难以单独测试菜单配置逻辑
- **代码冗余**：50+ 行重复代码违反 DRY 原则

## 参考资料

| 文档/代码                                                   | 作用                 |
| ----------------------------------------------------------- | -------------------- |
| `apps/company/src/views/CompanyDetail/index.tsx:391-445`    | 企业类型菜单切换逻辑 |
| `apps/company/src/views/Company/menu/getMenuByCorpType.ts`  | 已封装的菜单获取方法 |
| `apps/company/src/views/Company/menu/menus.ts`              | 基础菜单配置         |
| `apps/company/src/views/Company/menu/ZFMenus.ts`            | 政府机构菜单配置     |

## 解决方案

### 最终方案

**方案要点**：
1. 使用 `useCorpMenuByType` Hook 封装菜单获取逻辑
2. 通过企业基本信息状态触发菜单自动更新
3. 统一菜单配置时机，避免时序问题

**负责人**：suneo
**计划时间**：2024-11-06

**实施步骤**：
1. 引入企业基本信息状态管理
2. 使用 `useCorpMenuByType` Hook 替换重复逻辑
3. 通过 useEffect 统一处理菜单应用
4. 移除原有的 50+ 行重复代码

## 验证与风险

### 验证步骤

1. 测试普通企业、个体工商户、政府机构菜单切换正确
2. 测试基金、IPO 企业特殊菜单项显示
3. 验证多个企业详情页同时打开时菜单互不影响
4. TypeScript 编译检查通过

### 剩余风险

- **风险**：菜单配置可能影响首屏渲染性能
- **缓解措施**：使用 useMemo 优化 Hook 性能

## 更新日志

| 日期       | 事件         | 描述                                     |
| ---------- | ------------ | ---------------------------------------- |
| 2024-11-06 | 问题发现     | 发现菜单配置逻辑复杂且存在全局状态污染   |
| 2024-11-06 | 实施完成     | 使用 Hook 重构菜单逻辑，消除重复代码     |

## 实施记录

### 2024-11-06 解决方案

**改动文件**：`apps/company/src/views/CompanyDetail/index.tsx`

**核心改动**：
```typescript
// 添加企业基本信息状态
const [corpBasicInfo, setCorpBasicInfo] = useState<CorpBasicInfo | null>(null)

// 使用 Hook 获取菜单配置
const currentMenus = useCorpMenuByType(corpBasicInfo)

// 通过状态更新触发菜单切换
setCorpBasicInfo(res.Data)
```

**效果**：
- ✅ 代码行数减少 40+ 行
- ✅ 消除重复的 if-else 判断逻辑
- ✅ 逻辑更清晰，易于维护扩展
- ✅ 保持向后兼容性
- ✅ TypeScript 类型检查通过

**验证状态**：
- [x] TypeScript 编译通过
- [x] 功能验证完成
