# 实现说明：司法风险与经营风险模块扩展

> 所属任务：[司法风险与经营风险模块扩展](./README.md)  
> 文档版本：v1  
> 创建日期：2025-11-11

## 上线概览

| 项目           | 内容   |
| -------------- | ------ |
| **上线时间**   | 待补充 |
| **上线版本**   | 待补充 |
| **上线环境**   | 待补充 |
| **上线负责人** | 待补充 |

## 实现差异

### 与设计方案的差异

| 差异项 | 设计方案 | 实际实现 | 差异原因 | 影响评估 |
| ------ | -------- | -------- | -------- | -------- |
| 待补充 | 待补充   | 待补充   | 待补充   | 待补充   |

### 未实现功能

| 功能项 | 未实现原因 | 计划实现时间 | 备注   |
| ------ | ---------- | ------------ | ------ |
| 待补充 | 待补充     | 待补充       | 待补充 |

## 关键实现

### 1. 类型定义

**文件位置**：`src/components/company/type/corpDetail/CorpTableCfg.ts`

**实现要点**：扩展 `CorpTableCfg` 类型，新增 `type` 和 `maskRedirect` 字段

**关键决策**：待补充

### 2. 司法风险模块配置

**文件位置**：`src/handle/corpModuleCfg/risk/risk.tsx`

**实现要点**：新增3个模块配置，调整模块顺序

**关键决策**：待补充

### 3. 经营风险模块配置

**文件位置**：`src/handle/corpModuleCfg/bussRisk/bussRisk.tsx`

**实现要点**：新增7个模块配置，调整模块顺序

**关键决策**：待补充

### 4. 蒙版组件

**文件位置**：`src/components/company/MaskRedirectModal/`

**实现要点**：创建蒙版弹窗组件，实现跳转链接变量替换

**关键决策**：待补充

### 5. 模块渲染逻辑

**文件位置**：`src/components/company/CompanyBase.tsx`

**实现要点**：判断 `type` 字段，根据不同类型渲染不同样式，绑定点击事件

**关键决策**：待补充

## 关联 PR

| PR 编号 | PR 标题 | 合并时间 | 备注   |
| ------- | ------- | -------- | ------ |
| 待补充  | 待补充  | 待补充   | 待补充 |

## 数据字段确认

### 司法风险统计字段

| 模块名称 | 字段名称（设计）       | 字段名称（实际） | 备注   |
| -------- | ---------------------- | ---------------- | ------ |
| 股权冻结 | `equity_freeze_num`    | 待补充           | 待补充 |
| 限制出境 | `exit_restriction_num` | 待补充           | 待补充 |
| 悬赏公告 | `reward_notice_num`    | 待补充           | 待补充 |

### 经营风险统计字段

| 模块名称 | 字段名称（设计）           | 字段名称（实际） | 备注   |
| -------- | -------------------------- | ---------------- | ------ |
| 债券违约 | `bond_default_num`         | 待补充           | 待补充 |
| 非标违约 | `nonstandard_default_num`  | 待补充           | 待补充 |
| 债务逾期 | `debt_overdue_num`         | 待补充           | 待补充 |
| 商票逾期 | `commercial_overdue_num`   | 待补充           | 待补充 |
| 环保信用 | `environmental_credit_num` | 待补充           | 待补充 |
| 股权质押 | `equity_pledge_num`        | 待补充           | 待补充 |
| 简易注销 | `simple_cancellation_num`  | 待补充           | 待补充 |

## 跳转链接规则

### 司法风险跳转链接

| 模块名称 | 跳转链接（设计）                                                  | 跳转链接（实际） | 备注   |
| -------- | ----------------------------------------------------------------- | ---------------- | ------ |
| 股权冻结 | `https://risk.wind.com.cn/company/{companyCode}/equity-freeze`    | 待补充           | 待补充 |
| 限制出境 | `https://risk.wind.com.cn/company/{companyCode}/exit-restriction` | 待补充           | 待补充 |
| 悬赏公告 | `https://risk.wind.com.cn/company/{companyCode}/reward-notice`    | 待补充           | 待补充 |

### 经营风险跳转链接

| 模块名称 | 跳转链接（设计）                                                      | 跳转链接（实际） | 备注   |
| -------- | --------------------------------------------------------------------- | ---------------- | ------ |
| 债券违约 | `https://risk.wind.com.cn/company/{companyCode}/bond-default`         | 待补充           | 待补充 |
| 非标违约 | `https://risk.wind.com.cn/company/{companyCode}/nonstandard-default`  | 待补充           | 待补充 |
| 债务逾期 | `https://risk.wind.com.cn/company/{companyCode}/debt-overdue`         | 待补充           | 待补充 |
| 商票逾期 | `https://risk.wind.com.cn/company/{companyCode}/commercial-overdue`   | 待补充           | 待补充 |
| 环保信用 | `https://risk.wind.com.cn/company/{companyCode}/environmental-credit` | 待补充           | 待补充 |
| 股权质押 | `https://risk.wind.com.cn/company/{companyCode}/equity-pledge`        | 待补充           | 待补充 |
| 简易注销 | `https://risk.wind.com.cn/company/{companyCode}/simple-cancellation`  | 待补充           | 待补充 |

## 国际化文案

### 中文文案

| 文案 ID | 中文文案                   | 备注   |
| ------- | -------------------------- | ------ |
| xxx001  | 股权冻结                   | 待补充 |
| xxx002  | 限制出境                   | 待补充 |
| xxx003  | 悬赏公告                   | 待补充 |
| xxx004  | 债券违约                   | 待补充 |
| xxx005  | 非标违约                   | 待补充 |
| xxx006  | 债务逾期                   | 待补充 |
| xxx007  | 商票逾期                   | 待补充 |
| xxx008  | 环保信用                   | 待补充 |
| xxx009  | 股权质押                   | 待补充 |
| xxx010  | 简易注销                   | 待补充 |
| xxx011  | 该数据为风控专属数据       | 待补充 |
| xxx012  | 查看完整信息请前往风控产品 | 待补充 |
| xxx013  | 前往查看                   | 待补充 |

### 英文文案

| 文案 ID | 英文文案                                                       | 备注   |
| ------- | -------------------------------------------------------------- | ------ |
| xxx001  | Equity Freeze                                                  | 待补充 |
| xxx002  | Exit Restriction                                               | 待补充 |
| xxx003  | Reward Notice                                                  | 待补充 |
| xxx004  | Bond Default                                                   | 待补充 |
| xxx005  | Non-standard Default                                           | 待补充 |
| xxx006  | Debt Overdue                                                   | 待补充 |
| xxx007  | Commercial Paper Overdue                                       | 待补充 |
| xxx008  | Environmental Credit                                           | 待补充 |
| xxx009  | Equity Pledge                                                  | 待补充 |
| xxx010  | Simple Cancellation                                            | 待补充 |
| xxx011  | This data is exclusive to risk control                         | 待补充 |
| xxx012  | Please go to the risk control product for complete information | 待补充 |
| xxx013  | View Details                                                   | 待补充 |

## 测试结果

### 功能测试

**测试时间**：待补充  
**测试人员**：待补充  
**测试结果**：待补充

### 性能测试

**测试时间**：待补充  
**测试人员**：待补充  
**测试结果**：待补充

| 指标             | 优化前 | 优化后 | 提升   |
| ---------------- | ------ | ------ | ------ |
| 页面加载时间     | 待补充 | 待补充 | 待补充 |
| 菜单渲染时间     | 待补充 | 待补充 | 待补充 |
| 蒙版弹窗打开时间 | 待补充 | 待补充 | 待补充 |
| 内存占用         | 待补充 | 待补充 | 待补充 |

## 上线检查清单

- [ ] 代码已合并到主分支
- [ ] 所有单元测试通过
- [ ] 所有集成测试通过
- [ ] 功能验收通过
- [ ] 性能测试通过
- [ ] 国际化文案完整
- [ ] 上线文档完整
- [ ] 回滚方案准备完毕
- [ ] 监控告警配置完成
- [ ] 相关人员已通知

## 回滚方案

**回滚条件**：待补充

**回滚步骤**：待补充

**回滚影响**：待补充

## 后续优化

| 优化项 | 优先级 | 计划时间 | 备注   |
| ------ | ------ | -------- | ------ |
| 待补充 | 待补充 | 待补充   | 待补充 |

## 经验总结

### 成功经验

待补充

### 遇到的问题

待补充

### 改进建议

待补充

## 更新记录

| 日期       | 修改人 | 更新内容     |
| ---------- | ------ | ------------ |
| 2025-11-11 | -      | 创建实现说明 |
