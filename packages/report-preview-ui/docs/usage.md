# 使用指南

## 快速开始

### 安装

使用 pnpm 或 npm 安装组件库：

```bash
pnpm add report-preview-ui
# 或
npm install report-preview-ui
```

### 基本用法

1. 导入组件和样式
2. 配置必要的属性
3. 渲染报告预览组件

## 主要组件

### CreditRPPreviewComp
信用报告预览组件，用于渲染企业信用报告。

**必填属性**：
- corpCode（企业代码）
- axiosInstance（Axios 实例）
- packageInfo（用户套餐信息）
- reportConfig（报告配置）
- apiTranslate（数据翻译函数）

**可选属性**：
- isDev（开发模式标识）
- onLoadingChange（加载状态回调）
- onError（错误处理回调）

### DDRPPreviewComp
尽调报告预览组件，属性接口与 CreditRPPreviewComp 相同。

## 配置要求

### 必需配置

1. **Axios 实例**：配置 API 基础 URL、超时时间和认证头
2. **翻译函数**：提供异步翻译函数，支持中英文数据翻译
3. **报告配置**：符合 `detail-page-config` 规范的 JSON 配置

### 样式导入

必须导入主 CSS 文件以确保样式正确显示。

## 开发工具

### Storybook

- 启动：`pnpm run storybook`
- 构建：`pnpm run build-storybook`

### 本地开发

- 安装依赖：`pnpm install`
- 启动开发：`pnpm run dev`
- 构建组件：`pnpm run build`
- 运行测试：`pnpm run test`

## 高级功能

### 主题定制
支持 CSS 变量自定义主题颜色和布局样式。

### 错误处理
提供完善的错误边界和降级处理机制。

### 国际化
支持多语言切换和数据翻译功能。

### 性能优化
内置缓存机制和懒加载，支持大数据量场景。

## 技术栈

### 核心依赖
- React 18+
- @wind/wind-ui
- TypeScript
- Less & CSS Modules

### 运行时依赖
- detail-page-config
- report-util
- gel-api
- axios

## 注意事项

- 这是内部包，需要正确安装和配置相关依赖包
- 支持现代浏览器，需要 ES6+ 语法支持
- 必须导入主 CSS 文件以确保样式正确显示

## 相关文档

- [组件参考](./components-reference.md) - 完整的组件API文档
- [示例文档](./examples.md) - 使用示例和最佳实践
- [技术实现](./technical-implementation.md) - 核心技术细节