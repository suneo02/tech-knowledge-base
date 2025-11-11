# DebugPanel 调试面板组件

## 概述

DebugPanel 是一个用于开发环境调试的侧边栏面板组件，使用 wind-ui 实现，提供了环境配置、API 前缀设置、WSID 配置等功能。

## 功能特性

### 1. 开发模式配置

- **API Prefix 配置**：支持预设和自定义 API 前缀
  - 预设选项：主站、测试站、体验站、上海主站、南京主站、开发环境、本地代理等
  - 自定义输入：允许用户输入自定义的 API 前缀
- **WSID 配置**：支持预设和自定义 WSID
  - 预设选项：默认 WSID、测试 WSID、体验站 WSID、上海 WSID
  - 自定义输入：允许用户输入自定义的 WSID

### 2. 环境配置

- **主环境配置**：主站、测试站、体验站、上海主站、南京主站、本地代理-主站
- **本地调试环境配置**：开发环境、本地代理-开发等
- **SessionID 管理**：为每个环境单独配置 SessionID

### 3. 调试功能

- **tableId 设置**：快速设置 tableId 参数
- **API 信息显示**：实时显示当前环境的 API 调用信息
- **权限切换**：管理员、VIP用户、普通用户权限切换
- **账号切换**：测试账号快速切换

## 技术实现

### 组件架构

- 使用 React Hooks 管理状态
- 使用 lodash 的 debounce 进行防抖处理
- 使用 wind-ui 组件库构建界面
- 遵循 Babel Case 命名规范的 Less 样式

### 状态管理

```typescript
interface DevModeConfig {
  apiPrefix: string
  wsid: string
  customApiPrefix: string
  customWsid: string
}

interface EnvSetting {
  mainEnv: EnvType | null
  devEnv: EnvType | null
  sessionIds: Record<EnvType, string>
}
```

### 数据持久化

- 使用 localStorage 保存配置信息
- 支持配置的自动保存和恢复
- 环境切换后自动刷新页面

## 使用方法

### 基础用法

```tsx
import { DebugPanel } from '@/components/debug-panel'

function App() {
  return (
    <div>
      {/* 你的应用内容 */}
      <DebugPanel />
    </div>
  )
}
```

### 自定义样式

```tsx
<DebugPanel style={{ position: 'fixed', right: '20px', bottom: '20px' }} />
```

## 样式类名

### 主要类名

- `.debug-panel-trigger`：触发按钮
- `.debug-panel-container`：面板容器
- `.debug-panel-content`：面板内容
- `.debug-panel-header`：面板头部
- `.debug-panel-body`：面板主体

### 功能类名

- `.env-tag`：环境标签
- `.role-tag`：角色标签
- `.api-info`：API 信息显示
- `.config-item`：配置项
- `.env-config-panel`：环境配置面板
- `.dev-mode-config-panel`：开发模式配置面板

## 环境变量

### 开发环境显示

组件仅在开发模式下显示，通过 CSS 类名 `.dev-mode` 控制：

```css
.debug-panel-trigger {
  display: none;
}

:global {
  .dev-mode {
    .debug-panel-trigger {
      display: flex;
    }
  }
}
```

## 配置项说明

### API Prefix 预设值

- `/xprod`：主站
- `/xtest`：测试站
- `/xexp`：体验站
- `/xsh`：上海主站
- `/xnj`：南京主站
- `/xdev`：开发环境
- `http://localhost:3020/xprod`：本地代理-主站
- `http://localhost:3020/xdev`：本地代理-开发

### WSID 预设值

- `f6770493afc44d5a885b268c167282f1`：默认 WSID
- `d4bf5a91d6e2457eaf15e34de90087a5`：测试 WSID
- `WIND_EXP_SESSIONID`：体验站 WSID
- `WIND_SH_SESSIONID`：上海 WSID

## 注意事项

1. **开发环境专用**：此组件仅在开发环境中使用，生产环境会自动隐藏
2. **配置持久化**：所有配置都会保存到 localStorage，刷新页面后保持
3. **环境切换**：保存环境配置后会自动刷新页面以应用新配置
4. **防抖处理**：开发模式配置的保存使用 500ms 防抖，避免频繁保存

## 依赖项

- `@wind/wind-ui`：UI 组件库
- `@ant-design/icons`：图标库
- `lodash`：工具函数库
- `@/utils/storage`：本地存储工具
- `@/utils/env`：环境配置工具
