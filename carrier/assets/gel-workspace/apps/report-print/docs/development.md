# 开发指南

本文档介绍 report-print 项目的基本开发验证流程、构建和测试方法。

## 环境要求

- **Node.js**: 推荐使用 LTS 版本
- **pnpm**: 项目包管理器
- **wkhtmltopdf**: PDF 生成工具（必须安装）
- **浏览器**: Chrome/Firefox 用于调试

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 开发模式

```bash
# 启动开发服务器 + 热重载
pnpm run dev
```

开发模式会启动：
- Webpack 开发服务器 (端口 3000)
- 文件监听和自动重编译

### 3. 构建项目

```bash
# 生产环境构建
pnpm run build

# 预发布环境构建
pnpm run build:staging
```

## 开发验证流程

### 核心流程：修改 → 测试 → 验证

report-print 的开发必须通过实际的 PDF 生成来验证，这是项目兼容性要求的**唯一验收标准**。

### 1. 修改代码

在 `src/` 目录下修改渲染逻辑：
- `src/comp/` - 核心渲染组件
- `src/handle/` - 业务逻辑处理
- `src/pages/` - 应用入口

### 2. 选择验证方式

#### 方式一：使用 export 脚本（推荐）

```bash
# 测试环境 - 中文报告
pnpm run export:credit:test:cn

# 生产环境 - 中文报告
pnpm run export:credit:main:cn

# 本地开发 - 批量测试
pnpm run export:credit:batch:local
```

#### 方式二：自定义参数

```bash
# 通用导出命令
node scripts/export.cjs [options]

# 示例：自定义企业代码
node scripts/export.cjs --env test --language cn --companyCode 1173319566
```

### 3. 检查验证结果

脚本执行后会生成：
- **PDF 文件**: 项目根目录的 `output-xxx.pdf`
- **日志文件**: `logs/` 目录下的详细日志
- **控制台输出**: 实时执行状态

**验证要点**：
- ✅ PDF 是否正常生成（无报错）
- ✅ 内容是否正确显示
- ✅ 分页是否合理
- ✅ 样式是否符合预期

## 导出脚本详解

### 基本用法

```bash
node scripts/export.cjs [options]
```

### 参数说明

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `--env` | 环境名称 (local/test/main) | local |
| `--language` | 语言 (cn/en) | cn |
| `--report` | 报告类型 (credit/creditevaluation) | credit |
| `--companyCode` | 企业代码 | - |
| `--batch` | 是否批量模式 | false |
| `--pattern` | 加密企业数据模式 | - |
| `--outputFile` | 自定义输出文件名 | - |

### 环境配置

| 环境 | URL | 说明 |
|------|-----|------|
| `local` | `http://localhost:3000/creditrp` | 本地开发服务器 |
| `test` | `https://test.wind.com.cn/...` | 测试环境 |
| `main` | `https://wx.wind.com.cn/...` | 生产环境 |

### 预设企业代码

脚本内置了多种类型的企业测试数据：

```javascript
// 部分常用企业代码
CO: '1173319566',     // 公司
FCP: '1063144164',    // 金融机构
SPE: '1004283596',    // 特殊目的实体
HK: '1207343546',     // 香港企业
JAPAN: '1224890572',  // 日本企业
```

## 开发命令

### 构建

```bash
pnpm run build              # 生产构建
pnpm run build:staging      # 预发布构建
pnpm run watch              # 开发监听模式
```

### 代码质量

```bash
pnpm run lint               # ESLint 检查
pnpm run lint:fix           # 自动修复 ESLint 问题
pnpm run format             # Prettier 格式化
pnpm run check-format       # 检查格式
pnpm run validate           # lint + 格式检查
```

### 类型检查

```bash
pnpm run tsc                # TypeScript 类型检查
```

### 测试

```bash
pnpm run test               # 单元测试
pnpm run storybook          # 启动 Storybook
pnpm run build-storybook    # 构建 Storybook
```

## 调试技巧

### 1. 浏览器调试

访问 `http://localhost:3000/creditrp?companyCode=1173319566` 查看渲染结果

### 2. 控制台日志

由于 wkhtmltopdf 环境限制，使用特殊的日志处理：
```javascript
// export.cjs 中的配置
--run-script "console.log = function(msg) { alert(msg); };"
```

### 3. 分步验证

1. **页面渲染验证**: 先在浏览器中确认页面正常渲染
2. **PDF生成验证**: 使用脚本验证 PDF 生成
3. **内容验证**: 检查 PDF 内容完整性

## 常见问题

### Q: PDF 生成失败？
**A**: 检查 wkhtmltopdf 是否安装，以及 URL 是否可访问

### Q: 样式不正确？
**A**: wkhtmltopdf 对 CSS 支持有限，避免使用现代 CSS 特性

### Q: JavaScript 报错？
**A**: 确保代码兼容 ES5，使用 report-util 提供的兼容函数

### Q: 分页异常？
**A**: 检查 `page-break-inside: avoid` 等分页控制 CSS

## 兼容性要求

⚠️ **重要**: 所有代码必须兼容 wkhtmltopdf 的 ES5 环境

- **禁止**: ES6+ 语法 (箭头函数、const/let、模板字符串等)
- **允许**: 使用 report-util 提供的兼容函数
- **必测**: 每次修改后必须通过 PDF 生成验证

## 相关文档

- [Core Architecture](./core-architecture.md) - 核心架构和兼容性要求
- [Core Rendering Flow](./core-rendering-flow.md) - 渲染流程详解
- [PDF Pagination Design](./pdf-pagination-design.md) - 分页方案设计