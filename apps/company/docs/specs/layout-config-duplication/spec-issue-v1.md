# 问题分析：配置重复维护

> 所属任务：[企业详情页配置重复维护问题](./README.md)  
> 文档版本：v1  
> 创建日期：2024-11-07

## 背景与预期

企业详情页通过配置系统实现左侧菜单与中间内容的动态联动。预期应具备：

- 单一数据源
- 配置一致性保证
- 易于维护扩展

**参考文档**：

- @see [配置体系设计](../../CorpDetail/layout-config.md)
- @see [左侧区域设计](../../CorpDetail/layout-left.md)
- @see [中间区域设计](../../CorpDetail/layout-middle.md)

## 问题现象

### 1. 配置全量加载，资源浪费

中间内容配置（`listRowConfig`）在页面初始化时全量加载所有模块配置，包括未使用的模块。

**代码位置**：

- @see `src/components/company/listRowConfig.tsx` - 导出完整配置数组
- @see `src/components/company/handle/index.ts:28-45` - `useCorpModuleCfg` 返回完整配置

**问题表现**：

```typescript
// @see src/components/company/listRowConfig.tsx
export const listRowConfig: ICorpPrimaryModuleCfg[] = [
  base, // ❌ 全量导入基础信息配置
  IpoBusinessData, // ❌ 全量导入业务数据配置
  PublishFundData, // ❌ 全量导入公募基金配置
  PrivateFundData, // ❌ 全量导入私募基金配置
  finance, // ❌ 全量导入财务数据配置
  buss, // ❌ 全量导入经营数据配置
  qualifications, // ❌ 全量导入资质证书配置
  ip, // ❌ 全量导入知识产权配置
  risk, // ❌ 全量导入司法风险配置
  bussRisk, // ❌ 全量导入经营风险配置
  history, // ❌ 全量导入历史信息配置
]

// @see src/components/company/handle/index.ts
export const useCorpModuleCfg = (corpType, corpTypeId) => {
  return useMemo(() => {
    let res: ICorpPrimaryModuleCfg[]
    if (getIfIndividualBusiness(corpType, corpTypeId)) {
      res = corpModuleCfgIIP // ❌ 返回完整配置
    } else {
      res = listRowConfig // ❌ 返回完整配置
    }
    // 海外企业过滤
    if (wftCommon.is_overseas_config) {
      res = res.filter(/* ... */) // ⚠️ 过滤后仍包含大量未使用配置
    }
    return res
  }, [corpType, corpTypeId, userVipInfo])
}
```

**资源浪费**：

- 所有模块配置在页面加载时全部导入，包括大量 React 组件、表格配置、图表配置
- 普通企业可能只显示 5-6 个模块，但加载了 11 个模块的完整配置
- 海外企业、个体工商户等特殊类型企业加载了大量不会使用的配置
- 每个配置模块包含复杂的 JSX、render 函数、图表配置等，体积较大

### 2. 模块顺序重复维护

左侧菜单配置（`useCorpMenuByType`）和中间内容配置（`listRowConfig`）各自维护了一次模块顺序。

**代码位置**：

- @see `src/views/Company/menu/useCorpMenuByType.ts`
- @see `src/components/company/listRowConfig.tsx`

### 3. 统计数字重复维护

`basicNum` 对应的统计数字在两个配置中各维护了一次映射关系。

**示例**：

```typescript
// 菜单配置中维护统计字段
const menuConfig = {
  title: '股东信息',
  showList: ['showShareholder'],
  numArr: ['shareholder_num'], // ❌ 统计字段维护第一次
}

// 内容配置中再次维护统计字段
export const listRowConfig = [
  {
    showShareholder: {
      modelNum: 'shareholder_num', // ❌ 统计字段维护第二次
      // ...
    },
  },
]
```

### 4. 过滤逻辑重复维护

海外企业和个体工商户的过滤逻辑在菜单配置和内容配置中各维护了一次。

**场景 A：海外企业过滤不一致**

内容配置侧已实现过滤：

```typescript
// @see src/components/company/handle/index.ts:32-40
if (wftCommon.is_overseas_config) {
  res = res.filter((module) => {
    if (!module.moduleTitle) return true
    // ✅ 过滤司法风险和经营风险
    return ![bussRisk.moduleTitle.moduleKey, risk.moduleTitle.moduleKey].includes(module.moduleTitle.moduleKey)
  })
}
```

菜单配置侧未实现过滤：

```typescript
// @see src/views/Company/menu/useCorpMenuByType.ts
// ❌ 未实现海外企业过滤
// 导致菜单显示司法风险和经营风险，但内容不显示
```

**场景 B：个体工商户过滤分散**

菜单配置侧：

```typescript
// @see src/views/Company/menu/individualBusiness.ts:28-33
const menuToDel = ['financing', 'qualifications', 'risk', 'businessRisk']
menuToDel.forEach((key) => {
  delete res[key] // ✅ 删除司法风险和经营风险菜单
})
```

内容配置侧：

```typescript
// @see src/handle/corpModuleCfgSpecial/IIP.tsx
// ✅ 单独维护个体工商户配置
export const corpModuleCfgIIP: ICorpPrimaryModuleCfg[] = [
  // 不包含司法风险和经营风险模块
]
```

### 5. 配置不一致风险

特殊企业过滤逻辑依赖菜单配置决定内容显示：

```typescript
// @see src/components/company/CompanyBase.tsx:1046-1050
if (basicNum.__specialcorp > 0) {
  const theModuleKey = eachTableKey.split('-')[0]
  if (!props.allMenuDataObj[theModuleKey]) {
    continue // ❌ 依赖菜单配置决定内容显示
  }
}
```

## 根本原因

1. **全量加载**：配置采用静态导入，所有模块配置在初始化时全部加载
2. **缺乏按需加载**：未根据企业类型、可见性规则动态加载所需配置
3. **配置分离**：菜单配置和内容配置分离，缺乏统一的配置源
4. **重复定义**：模块顺序在两处独立定义
5. **映射重复**：统计字段映射关系重复维护
6. **逻辑分散**：过滤逻辑（海外企业、特殊企业）在两侧各自实现
7. **耦合问题**：特殊企业过滤逻辑耦合菜单配置

## 影响范围

- **性能问题**：全量加载配置导致初始化时间长，首屏加载慢
- **资源浪费**：加载大量未使用的配置，增加内存占用和网络传输
- **维护成本高**：新增或调整模块需要修改多处配置
- **一致性风险**：两处配置可能不同步，导致菜单与内容不匹配
- **用户体验问题**：海外企业访问时，菜单显示司法风险和经营风险，但点击后内容不显示
- **扩展困难**：新增企业类型或过滤规则需要同时维护多处
- **调试复杂**：配置分散导致问题排查困难

## 更新记录

| 日期       | 修改人 | 更新内容     |
| ---------- | ------ | ------------ |
| 2024-11-07 | -      | 创建问题分析 |
