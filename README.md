# Monorepo 包打包优化指南

## 核心优化原则

本指南旨在通过一系列打包优化策略，显著减小 monorepo 中各个包（package）的构建产物體积，提升加载性能和开发效率。核心原则包括：

- **依赖外部化**：避免将通用第三方库打包进产物。
- **构建目标降级**：根据目标环境选择合适的 JavaScript 版本。
- **资源输出控制**：精细化控制 CSS 等资源的输出方式。

---

## Vite 配置优化实践

我们主要通过优化 `vite.config.ts` 文件来实现打包优化。

### 1. 依赖外部化 (Externals)

这是减小打包体积最有效的方法。通过将大型、通用的第三方库（如 `react`, `antd`, `xlsx` 等）标记为外部依赖，构建工具在打包时会跳过它们，从而将包体积减小 60-80%。

**配置方法**

在 `vite.config.ts` 中配置 `build.rollupOptions`:

```typescript
// vite.config.ts
import { defineConfig } from 'vite'

export default defineConfig({
  // ...
  build: {
    rollupOptions: {
      // 将这些库标记为外部依赖
      external: [
        'react',
        'react-dom',
        '@wind/wind-ui',
        '@wind/wind-ui-table',
        '@wind/icons',
        'xlsx',
        'gel-api',
        'gel-ui',
        'gel-util',
        'classnames',
        'lodash',
        'dayjs',
        'ahooks',
        'antd',
        '@ant-design/icons',
      ],
      output: {
        // 在 UMD 构建模式下，为外部化的依赖提供一个全局变量
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@wind/wind-ui': 'WindUI',
          '@wind/wind-ui-table': 'WindUITable',
          '@wind/icons': 'WindIcons',
          xlsx: 'XLSX',
          'gel-api': 'GelApi',
          'gel-ui': 'GelUI',
          'gel-util': 'GelUtil',
          classnames: 'classNames',
          lodash: '_',
          dayjs: 'dayjs',
          ahooks: 'ahooks',
          antd: 'antd',
          '@ant-design/icons': 'AntDesignIcons',
        },
      },
    },
  },
})
```

**工作原理及适用场景**

- **原理**：打包器保留 `import` 语句，而不是将依赖代码捆绑进来。
- **场景**：适用于由宿主应用（Host Application）统一提供依赖的场景，例如微前端架构或组件库。
- **注意**：必须确保宿主环境能正确加载这些外部依赖，否则应用将在运行时因缺少模块而崩溃。

### 2. 优化构建目标 (Build Target)

通过设置合适的 ECMAScript 版本，可以减少不必要的兼容性代码，从而优化输出体积和解析性能。

```typescript
// vite.config.ts
build: {
  // ...
  // 设置目标浏览器环境
  target: 'es2015',
}
```

`es2015` 是一个兼容性很好的选择，它保证了在绝大多数现代浏览器中的支持。如果你的目标用户群体使用的浏览器版本较新（例如，近两年发布的版本），可以考虑 `es2020` 或更高版本，以获得更小的产物体积和更好的性能。

### 3. CSS 处理策略

对于组件库或工具库，通常建议将所有 CSS 合并为一个文件，方便使用者引入。

```typescript
// vite.config.ts
build: {
  // ...
  // 禁用 CSS 代码分割，将所有 CSS 合并到单个文件中
  cssCodeSplit: false,
},
// ...
// 统一 CSS产物名称
assetFileNames: (assetInfo) => {
  if (/\.css$/i.test(assetInfo.name)) {
    return 'index.css';
  }
  return `assets/[name].[ext]`;
}
```

**注意**：`cssCodeSplit: false` 对于独立应用（Application）可能不是最佳选择。在大型应用中，按需加载 CSS（CSS Code Splitting）可以改善首页加载性能。请根据包的性质（库或应用）做出选择。

---

## 优化流程与效果

### 如何应用到其它包

1.  **分析依赖**

    - 首先，检查 `package.json`，识别出可以被外部化的通用依赖。
    - **推荐**：使用打包分析工具（如 `rollup-plugin-visualizer`）来直观地识别产物中体积较大的模块。

    **安装分析插件:**

    ```bash
    pnpm add -D rollup-plugin-visualizer
    ```

    **在 `vite.config.ts` 中配置:**

    ```typescript
    // vite.config.ts
    import { visualizer } from 'rollup-plugin-visualizer'

    export default defineConfig({
      plugins: [
        // ...其他插件
        visualizer({ open: true }), // 构建后自动在浏览器中打开分析报告
      ],
    })
    ```

2.  **修改配置**
    在待优化的包的 `vite.config.ts` 中，参考上面的示例添加 `external` 和 `globals` 配置。

3.  **构建与验证**
    执行构建命令（如 `pnpm build`），对比优化前后的包体积，并确保包在宿主应用中能正常工作。

### 优化效果

| 包名      | 优化前体积 | 优化后体积 | 减少比例 |
| --------- | ---------- | ---------- | -------- |
| indicator | 3.36MB     | 0.63MB     | -81%     |
| gel-ui    | 待测试     | 待测试     | -        |
| cde       | 待测试     | 待测试     | -        |

---

## Turborepo 构建系统

本项目使用 [Turborepo](https://turbo.build/repo) 管理 monorepo 的构建、测试和开发流程，以提升开发效率。

**核心优势**:

- **智能构建**: 自动分析包之间的依赖关系，只构建需要更新的包。
- **远程缓存**: 缓存构建产物至云端，实现团队范围内的增量构建，大幅提升 CI/CD 速度。
- **并行执行**: 在多核 CPU 上并行执行任务，缩短本地和 CI 的构建时间。

**常用命令**:

```bash
# 并行构建 monorepo 中的所有包
pnpm build

# 构建 report-config 包以及它所依赖的所有包
pnpm build:report-config

# 启动所有包的开发模式
pnpm dev
```

更多用法请参考项目内的 `TURBOREPO.md` 文件或 Turborepo 官方文档。
