# Vite 核心概念与原理

## 概述

Vite 是新一代前端构建工具，由 Vue.js 作者尤雨溪开发。它在开发环境中利用浏览器原生 ES Modules 支持，实现了极速的冷启动和热更新。

## Vite 比 Webpack 快的原因 {#vite-比-webpack-快的原因}

### 1. 开发模式的差异

在开发环境中，**Webpack 是先打包再启动开发服务器**，而 **Vite 则是直接启动，然后再按需编译依赖文件**。

这意味着：

- 使用 **Webpack** 时，所有的模块都需要在开发前进行打包，这会增加启动时间和构建时间
- **Vite** 则采用了不同的策略，它会在请求模块时再进行实时编译，这种按需动态编译的模式极大地缩短了编译时间

特别是在大型项目中，文件数量众多，Vite 的优势更为明显。

#### Webpack 启动流程

```
解析配置 → 构建依赖图 → 打包所有模块 → 启动开发服务器
```

- 需要等待所有模块打包完成
- 启动时间随项目规模增长而增加

#### Vite 启动流程

```
启动开发服务器 → 预构建依赖 → 按需编译模块
```

- 几乎瞬间启动
- 仅在浏览器请求时编译对应模块

### 2. 对 ES Modules 的支持 {#2-对-es-modules-的支持}

现代浏览器本身就支持 **ES Modules**，会**主动发起**请求去获取所需文件。Vite 充分利用了这一点，将开发环境下的模块文件直接作为浏览器要执行的文件，而不是像 Webpack 那样**先打包**，再交给浏览器执行。这种方式减少了中间环节，提高了效率。

#### 什么是 ES Modules？

通过使用 `export` 和 `import` 语句，ES Modules 允许在浏览器端导入和导出模块。

当使用 ES Modules 进行开发时，开发者实际上是在构建一个**依赖关系图**，不同依赖项之间通过导入语句进行关联。

主流浏览器（除 IE 外）均支持 ES Modules，并且可以通过在 script 标签中设置 `type="module"` 来加载模块。默认情况下，模块会延迟加载，执行时机在文档解析之后，触发 DOMContentLoaded 事件前。

```html
<script type="module">
  import { createApp } from 'vue'
  import App from './App.vue'
  
  createApp(App).mount('#app')
</script>
```

### 3. 底层语言的差异 {#3-底层语言的差异}

- **Webpack** 是基于 **Node.js** 构建的
- **Vite** 则是基于 **esbuild** 进行预构建依赖

esbuild 是采用 **Go** 语言编写的，Go 语言是**纳秒**级别的，而 Node.js 是**毫秒**级别的。因此，Vite 在打包速度上相比 Webpack 有 **10-100** 倍的提升。

#### 什么是预构建依赖？

预构建依赖通常指的是在项目**启动或构建**之前，对项目中所需的依赖项进行预先的**处理或构建**。这样做的好处在于，当项目实际运行时，可以**直接使用**这些已经预构建好的依赖，而无需再进行实时的编译或构建，从而提高了应用程序的运行速度和效率。

Vite 会使用 esbuild 预构建依赖：

- 将 CommonJS/UMD 转换为 ESM
- 将有多个内部模块的 ESM 依赖项打包成单个模块

```javascript
// vite.config.js
export default {
  optimizeDeps: {
    include: ['lodash-es', 'axios'],
    exclude: ['some-local-package']
  }
}
```

### 4. 热更新的处理

在 **Webpack** 中，当一个模块或其依赖的模块内容改变时，需要**重新编译**这些模块。

而在 **Vite** 中，当某个模块内容改变时，只需要让浏览器**重新请求**该模块即可，这大大减少了热更新的时间。

#### Webpack HMR

```
文件变化 → 重新编译模块及依赖 → 推送更新到浏览器
```

#### Vite HMR

```
文件变化 → 失效模块缓存 → 浏览器重新请求该模块
```

Vite 的 HMR 是在原生 ESM 上执行的：

```javascript
if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    // 处理模块更新
  })
}
```

## Vite 核心特性

### 1. 极速的服务启动

使用原生 ESM 文件，无需打包！

### 2. 轻量快速的热重载

无论应用程序大小如何，都始终极快的模块热替换（HMR）

### 3. 丰富的功能

对 TypeScript、JSX、CSS 等支持开箱即用

### 4. 优化的构建

可选 "多页应用" 或 "库" 模式的预配置 Rollup 构建

### 5. 通用的插件

在开发和构建之间共享 Rollup-superset 插件接口

### 6. 完全类型化的 API

灵活的 API 和完整的 TypeScript 类型

## Vite 配置示例 {#vite-配置示例}

### 基本配置

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'pinia']
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
```

### 环境变量

Vite 使用 `dotenv` 从环境目录中加载额外的环境变量：

```
.env                # 所有情况下都会加载
.env.local          # 所有情况下都会加载，但会被 git 忽略
.env.[mode]         # 只在指定模式下加载
.env.[mode].local   # 只在指定模式下加载，但会被 git 忽略
```

只有以 `VITE_` 为前缀的变量才会暴露给客户端代码：

```bash
VITE_APP_TITLE=My App
VITE_API_URL=https://api.example.com
```

在代码中使用：

```javascript
console.log(import.meta.env.VITE_APP_TITLE)
```

## Vite 与 Webpack 对比

| 特性 | Vite | Webpack |
|------|------|---------|
| 开发服务器启动 | 极快（几乎瞬时） | 较慢（随项目增大而变慢） |
| 热更新速度 | 极快 | 较慢 |
| 生产构建 | Rollup（优化好） | Webpack（配置灵活） |
| 配置复杂度 | 简单 | 复杂 |
| 插件生态 | 快速增长 | 非常成熟 |
| 浏览器支持 | 现代浏览器 | 所有浏览器 |
| 学习曲线 | 平缓 | 陡峭 |

## 何时选择 Vite

### 适合使用 Vite 的场景

- 新项目启动
- 现代浏览器为主要目标
- 追求极致的开发体验
- Vue 3 / React / Svelte 等现代框架项目
- 对开发速度有较高要求

### 仍需考虑 Webpack 的场景

- 需要支持老旧浏览器
- 有大量现有 Webpack 插件依赖
- 需要高度定制化的构建流程
- 团队对 Webpack 已有深入积累

## 从 Webpack 迁移到 Vite {#从-webpack-迁移到-vite}

### 1. 安装 Vite 相关依赖

```bash
npm install -D vite @vitejs/plugin-vue
```

### 2. 创建 vite.config.js

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})
```

### 3. 更新 index.html

将 `index.html` 移到项目根目录，并更新脚本引用：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My App</title>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

### 4. 更新 package.json

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### 5. 处理环境变量

将 `process.env` 替换为 `import.meta.env`，并添加 `VITE_` 前缀。

## 延伸阅读

- [Webpack 详解](./webpack.md)
- [模块规范与系统](./module-systems.md)
- [Vite 官方文档](https://vitejs.dev/)
- [构建工具资源](./resources.md)
