# TemplateList

模板列表组件，展示报告模板列表，支持模板预览、删除和使用功能。

## 目录结构

```
TemplateList/
├── index.tsx                      # 模板列表主组件
├── index.module.less              # 主组件样式文件
├── TemplateUseModal.tsx           # 模板使用弹窗组件
├── TemplateUseModal.module.less   # 弹窗样式文件
├── useTemplateUse.ts              # 模板使用业务逻辑Hook
└── README.md                      # 组件文档
```

## 核心文件职责

### index.tsx
模板列表主组件，展示可用的报告模板，支持：
- 模板列表展示
- 模板预览（系统模板）
- 模板删除（自定义模板）
- 模板使用（触发公司选择弹窗）

### TemplateUseModal.tsx
模板使用弹窗组件，包含：
- 公司搜索表单
- 确认/取消操作
- 表单验证和状态管理

### useTemplateUse.ts
模板使用的业务逻辑Hook，管理：
- 弹窗显示状态
- 选中的模板和公司信息
- API调用逻辑
- 错误处理和用户提示

## 功能特性

### 模板使用流程
1. 用户点击"开始使用"按钮
2. 弹出公司选择弹窗
3. 用户搜索并选择公司
4. 确认后调用`report/template/use`接口
5. 成功后跳转到新创建的报告详情页

### 核心API
- `report/template/list` - 获取模板列表
- `report/template/delete` - 删除模板
- `report/template/use` - 使用模板创建报告

### 状态管理
| 状态 | 类型 | 说明 |
|------|------|------|
| useModalVisible | boolean | 弹窗显示状态 |
| selectedTemplate | ReportTemplateItem \| null | 选中的模板 |
| selectedCorpId | string | 选中的公司ID |
| selectedCorpName | string | 选中的公司名称 |
| confirmLoading | boolean | 确认按钮加载状态 |

## 技术实现

### 依赖组件
- `@wind/wind-ui` - UI组件库（Modal、Form、Button等）
- `gel-ui/biz/common/CorpPresearch` - 公司搜索组件
- `ahooks` - React Hooks工具库
- `dayjs` - 日期处理库

### Hook使用
- `useRequest` - 数据请求管理
- `useState` - 状态管理
- 自定义`useTemplateUse` Hook - 业务逻辑封装

## 模块依赖

```
首页/新建报告页面
  └─> TemplateList (模板列表)
      ├─> TemplateUseModal (公司选择弹窗)
      ├─> useTemplateUse (业务逻辑Hook)
      └─> CorpPresearch (公司搜索组件)
```

## 规范遵循

- [React规范](../../../../../docs/rule/code-react-component-rule.md)
- [TypeScript规范](../../../../../docs/rule/code-typescript-style-rule.md)
- [样式规范](../../../../../docs/rule/code-style-less-bem-rule.md)
- [API请求规范](../../../../../docs/rule/code-api-client-rule.md)

## 更新记录

| 日期 | 修改人 | 更新内容 |
|------|--------|----------|
| 2025-10-30 | Kiro | 新增模板使用公司选择功能，添加弹窗组件和业务逻辑Hook |

