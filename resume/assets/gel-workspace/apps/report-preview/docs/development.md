# 开发指南

## 本地开发

### 环境准备

```bash
# 安装依赖
pnpm install
```

### 启动开发服务

```bash
# 启动热更新开发服务
pnpm run dev:serve
```

### 访问方式

启动后，访问 `http://localhost:3000` 并带上相应的 URL 参数（如 `?corpCode=xxx`）即可在浏览器中实时预览报告。

### 调试特点

由于此应用不涉及 `wkhtmltopdf`，所有调试和验收工作均在浏览器中完成，具有以下优势：

- 可以使用现代浏览器的开发者工具进行调试
- 支持实时热更新，修改代码后立即看到效果
- 无需考虑 PDF 生成工具的兼容性限制
- 可以充分利用现代 Web 技术和浏览器 API

## 技术栈

- **框架**: React 18+
- **包管理**: pnpm
- **构建工具**: Vite
- **状态管理**: Context API / Redux
- **类型系统**: TypeScript
- **样式**: CSS Modules / Styled Components

## 项目依赖

### 核心依赖
- `report-preview-ui`: UI 组件库
- `detail-page-config`: 报告配置数据源
- `report-util`: 通用工具函数

### 开发依赖
- TypeScript: 类型检查
- ESLint: 代码规范检查
- Prettier: 代码格式化
- Vitest: 单元测试