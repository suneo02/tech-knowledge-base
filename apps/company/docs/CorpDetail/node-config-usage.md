# 企业详情页节点配置规范

## 概述

本文档说明企业详情页内容区域中单个节点的配置结构和使用规范。节点配置通过`CompanyTable`组件消费，每个节点对应一个独立的`CompanyTable`实例。

## 节点与组件关系

### 核心消费组件

`CompanyTable`是企业详情页中消费节点配置的核心组件：

1. **配置获取**：从`corpModuleCfg`获取节点配置
2. **组件创建**：`CompanyBaseY`中调用`makeTable`创建`CompanyTable`实例
3. **配置传递**：将`eachTable`配置对象传递给`CompanyTable`
4. **内部处理**：`CompanyTable`根据配置渲染表格、处理数据请求

### 特殊节点识别

`CompanyTable`通过`eachTableKey`识别特殊节点类型：
- `showSharePenetration`：股东穿透节点
- `showMainMemberInfo`：实际控制人节点
- `showCompanyChange`：股东变更节点
- `historycompany`：历史数据节点

## 节点配置结构

### 基础配置项

| 配置项 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `title` | string | 是 | 节点标题 |
| `cmd` | string | 是 | 数据接口地址 |
| `columns` | array | 是 | 表格列配置 |
| `ajaxExtras` | object | 否 | 额外请求参数 |
| `pageSize` | number | 否 | 每页数据条数，默认10 |
| `hint` | string | 否 | 提示信息 |

### 列配置说明

| 配置项 | 类型 | 说明 |
|--------|------|------|
| `title` | string | 列标题 |
| `dataIndex` | string | 数据字段名 |
| `width` | string/number | 列宽度 |
| `render` | function | 自定义渲染函数 |
| `children` | array | 子列配置（嵌套表头） |

## 配置使用规范

### 1. 基础规范

- **命名规范**：使用camelCase命名，语义清晰
- **接口规范**：RESTful风格，路径清晰
- **字段规范**：与后端返回字段保持一致

### 2. 列配置规范

- **宽度设置**：百分比优先，固定宽度为辅
- **排序配置**：支持远程排序的列需配置`sorter`
- **空值处理**：统一使用`-`表示空值

### 3. 数据请求规范

- **分页参数**：统一使用`page`和`pageSize`
- **企业代码**：通过`ajaxExtras.companycode`传递
- **错误处理**：统一错误码和提示信息

## 错误处理

### 配置错误处理

| 错误类型 | 处理方式 |
|----------|----------|
| 缺少必填字段 | 控制台警告 + 降级渲染 |
| 接口地址错误 | 显示错误提示 + 重试机制 |
| 列配置错误 | 跳过错误列 |

### 数据错误处理

- **空数据处理**：显示"暂无数据"提示
- **权限错误**：显示权限提示和升级引导
- **网络错误**：显示网络错误提示和重试按钮

## 调试指南

### 常见问题排查

| 问题 | 排查要点 | 检查位置 |
|------|----------|----------|
| 节点不显示 | 检查`makeTable`返回值 | `CompanyBaseY`组件 |
| 数据不加载 | 验证`cmd`和`ajaxExtras` | `CompanyTable`数据请求 |
| 配置未生效 | 确认配置传递路径 | `eachTable`属性传递 |

## 相关文档

- [企业详情页整体设计](./layout-middle.md)
- [特殊节点配置说明](./special-node-config.md)
- [CompanyTable组件详细说明](./company-table.md)