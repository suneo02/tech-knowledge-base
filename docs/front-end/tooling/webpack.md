# Webpack 核心概念与实践

## 概述

Webpack 是一个现代 JavaScript 应用程序的静态模块打包器。当 webpack 处理应用程序时，它会在内部构建一个依赖关系图，此图会映射项目所需的每个模块，并生成一个或多个 bundle。

## 核心配置项

Webpack 的配置主要包括以下几个部分：

### Entry（入口）

指定 Webpack 打包的入口文件，可以是单个或多个 JavaScript 文件。这个配置决定了 Webpack 从哪个模块开始生成依赖关系图。

```javascript
module.exports = {
  entry: './src/index.js',
  // 或多入口
  entry: {
    app: './src/app.js',
    admin: './src/admin.js'
  }
};
```

### Output（输出）

设置 Webpack 打包后输出的目录和文件名称，包括 path、filename 和 publicPath 等。

```javascript
module.exports = {
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    publicPath: '/'
  }
};
```

### Module（模块）

配置了不同的 loaders 来处理不同的模块，例如，对于 CSS 文件，可以使用 css-loader 和 style-loader。

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      }
    ]
  }
};
```

### Resolve（解析）

设置 Webpack 如何解析模块依赖，包括别名、扩展名等。

```javascript
module.exports = {
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src/')
    }
  }
};
```

### Plugins（插件）

使用不同的插件可以增强 Webpack 的功能。

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
};
```

### DevServer（开发服务器）

提供了一个简单的 web 服务器和实时重载功能。

```javascript
module.exports = {
  devServer: {
    contentBase: './dist',
    port: 3000,
    hot: true,
    proxy: {
      '/api': 'http://localhost:8080'
    }
  }
};
```

### Optimization（优化）

可以使用 optimization.splitChunks 和 optimization.runtimeChunk 配置代码拆分和运行时代码提取等优化策略。

```javascript
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10
        }
      }
    },
    runtimeChunk: 'single'
  }
};
```

### 其他配置项

- **externals**：用于配置排除打包的模块，例如，可以将 jQuery 作为外置扩展，避免将其打包到应用程序中
- **devtool**：配置 source-map 类型
- **context**：webpack 使用的根目录，string 类型必须是绝对路径
- **target**：指定 Webpack 编译的目标环境
- **performance**：输出文件的性能检查配置
- **noParse**：不用解析和处理的模块
- **stats**：控制台输出日志控制

## 常见的 Loader 和 Plugin

### Loader

Loader 本质是一个函数，它是一个转换器。webpack 只能解析原生 js 文件，对于其他类型文件就需要 loader 进行转换。

**常用 Loader：**

- **babel-loader**：将 ES6+ 的代码转换成 ES5 的代码
- **css-loader**：解析 CSS 文件，并处理 CSS 中的依赖关系
- **style-loader**：将 CSS 代码注入到 HTML 文档中
- **file-loader**：解析文件路径，将文件复制到输出目录，并返回文件路径
- **url-loader**：类似于 file-loader，但是可以将小于指定大小的文件转成 base64 编码的 Data URL 格式
- **sass-loader**：将 Sass 文件编译成 CSS 文件
- **less-loader**：将 Less 文件编译成 CSS 文件
- **postcss-loader**：自动添加 CSS 前缀，优化 CSS 代码等
- **vue-loader**：将 Vue 单文件组件编译成 JavaScript 代码

### Plugin

Plugin 是一个插件，用于增强 webpack 功能。webpack 在运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 webpack 提供的 API 改变输出结果。

**常用 Plugin：**

- **HtmlWebpackPlugin**：生成 HTML 文件，并自动将打包后的 JavaScript 和 CSS 文件引入到 HTML 文件中
- **CleanWebpackPlugin**：清除输出目录
- **ExtractTextWebpackPlugin**：将 CSS 代码提取到单独的 CSS 文件中（已被 MiniCssExtractPlugin 替代）
- **MiniCssExtractPlugin**：将 CSS 代码提取到单独的 CSS 文件中
- **DefinePlugin**：定义全局变量
- **UglifyJsWebpackPlugin**：压缩 JavaScript 代码
- **HotModuleReplacementPlugin**：热模块替换，用于在开发环境下实现热更新
- **BundleAnalyzerPlugin**：分析打包后的文件大小和依赖关系
- **ImageminPlugin**：构建时批量压缩图片
- **ProvidePlugin**：自动为模块注入变量，无需手动 import
- **CopyPlugin**：复制文件/目录到输出路径
- **PurifyCSSPlugin**：分析模板引用，去除未使用的 CSS

#### 常见插件详细配置

##### 1. HtmlWebpackPlugin - HTML 文件生成

背景：多入口场景下，产物文件名含 `[hash]`，手动维护 HTML 引用困难。

安装：

```bash
npm install --save-dev html-webpack-plugin
```

配置示例：

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Hello Webpack',
      template: './src/index.html',
      filename: 'index.html',
      favicon: './src/favicon.ico',
      hash: true,
      inject: 'body',
      minify: {
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: true,
      },
      cache: true,
      showErrors: true,
      chunks: ['index'],
    }),
  ],
};
```

##### 2. ImageminPlugin - 图片压缩

背景：图片体积过大影响加载与存储。

安装：

```bash
npm install --save-dev imagemin-webpack-plugin
```

配置示例：

```javascript
const ImageminPlugin = require('imagemin-webpack-plugin').default;

module.exports = {
  plugins: [
    new ImageminPlugin({
      disable: process.env.NODE_ENV !== 'production',
      pngquant: { quality: '95-100' },
    }),
  ],
};
```

##### 3. CleanWebpackPlugin - 清理产物目录

背景：每次打包前需要清空输出目录。

安装：

```bash
npm install --save-dev clean-webpack-plugin
```

配置示例：

```javascript
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  plugins: [new CleanWebpackPlugin()],
};
```

##### 4. ProvidePlugin - 全局变量提供（内置）

背景：在多个模块中重复 import 全局库麻烦。

配置示例：

```javascript
const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      React: 'react',
      ReactDOM: 'react-dom',
      Component: ['react', 'Component'],
    }),
  ],
};
```

##### 5. SplitChunksPlugin - 公共代码抽取（内置）

背景：第三方库与公共模块在多入口/多页面场景重复打包。

配置示例：

```javascript
module.exports = {
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: 'all',
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          minChunks: 1,
          maxInitialRequests: 5,
          minSize: 0,
          priority: 100,
        },
        common: {
          chunks: 'all',
          test: /[\\/]src[\\/]js[\\/]/,
          name: 'common',
          minChunks: 2,
          maxInitialRequests: 5,
          minSize: 0,
          priority: 1,
        },
      },
    },
    // 提取 runtime，提升长效缓存
    runtimeChunk: { name: 'manifest' },
  },
};
```

##### 6. MiniCssExtractPlugin - 提取 CSS（生产推荐）

背景：将 CSS 打包进 JS 不利于缓存与首屏。

安装：

```bash
npm install --save-dev mini-css-extract-plugin
```

配置示例：

```javascript
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [new MiniCssExtractPlugin()],
};
```

注意：开发模式下不建议使用（不支持 HMR）。

##### 7. PurifyCSSPlugin - CSS 摇树/去冗余

背景：样式冗余。

安装：

```bash
npm install --save-dev purifycss-webpack glob
```

配置示例：

```javascript
const PurifyCSS = require('purifycss-webpack');
const glob = require('glob');
const path = require('path');

module.exports = {
  plugins: [
    new PurifyCSS({ paths: glob.sync(path.resolve('./src/*.html')) }),
  ],
};
```

提示：通常按顺序处理「HTML 生成 → CSS 提取 → CSS 摇树」。

##### 8. CopyPlugin - 复制静态资源

背景：将图片/字体等静态资源拷贝到产物目录。

安装：

```bash
npm install --save-dev copy-webpack-plugin
```

配置示例：

```javascript
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'public', to: 'dist' },
        { from: 'other/xx.js', to: 'dist' },
      ],
    }),
  ],
};
```

### Loader 和 Plugin 的区别

**功能不同：**

- Loader 本质是一个函数，它是一个转换器。webpack 只能解析原生 js 文件，对于其他类型文件就需要 loader 进行转换
- Plugin 它是一个插件，用于增强 webpack 功能。webpack 在运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 webpack 提供的 API 改变输出结果

**用法不同：**

- Loader 的配置是在 `module.rules` 下进行。类型为数组，每一项都是一个 Object，里面描述了对于什么类型的文件（test），使用什么加载（loader）和使用的参数（options）
- Plugin 的配置在 `plugins` 下。类型为数组，每一项是一个 Plugin 的实例，参数都通过构造函数传入

## Module / Chunk / Bundle 的区别

参考：

- https://www.cnblogs.com/skychx/p/webpack-module-chunk-bundle.html
- https://blog.csdn.net/Jasonslw/article/details/124028176

简述：同一份逻辑代码在不同阶段的称谓不同：

- 我们直接编写的是 module
- Webpack 处理过程中形成 chunk
- 最终生成浏览器可直接运行的 bundle

![](../assets/web-module-untitled.png)

## Webpack 构建流程

Webpack 的运行流程呈串行执行：

### 概览

1. **初始化**：读取与合并配置参数，加载 Plugin，实例化 Compiler
2. **编译**：从 Entry 出发，按 Loader 翻译每个 Module，解析依赖并递归处理
3. **输出**：把编译后的 Module 组合成 Chunk，转换为文件输出到文件系统

监听模式下的流程：

![](../assets/web-module-9B823AC99AF889118D34D0CB72E7A28E.png)

### 详细步骤

#### 1. 初始化参数

解析 Webpack 配置参数，合并 Shell 传入和 webpack.config.js 文件配置的参数，形成最终的配置结果。

#### 2. 开始编译

使用上一次得到的参数初始化 compiler 对象，注册所有配置的插件，插件监听 Webpack 构建生命周期的事件节点，做出相应的反应，执行对象的 run 方法开始执行编译。

#### 3. 确定入口

从配置的 entry 入口，开始解析文件构建 AST 语法树，找出依赖，递归下去。

#### 4. 编译模块

递归中根据文件类型和 loader 配置，调用所有配置的 loader 对文件进行转换，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理。

#### 5. 完成模块编译

在经过第四步使用 Loader 翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系。

#### 6. 输出资源

根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，再把每个 Chunk 转换成单独的文件加入到输出列表，这步是可以修改输出内容的最后机会。

#### 7. 输出完成

在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统。

### 关键阶段要点

- **初始化**：合并 CLI/配置参数 → 实例化 Compiler → 加载插件 → 处理入口
- **编译期常见钩子**：`before-run`、`run`、`watch-run`、`compile`、`compilation`、`make`、`after-compile`、`invalid`
- **Compilation 过程**：使用 Loader 转换模块、生成 AST、收集依赖、优化、封装为 Chunk、生成产物文件

### 特点

这个流程是一个串行的过程，Webpack 的运行流程是一个串行的过程，它的工作流程就是将各个插件串联起来。在运行过程中会广播事件，插件只需要监听它所关心的事件，就能加入到这条 Webpack 机制中，去改变 Webpack 的运作，使得整个系统扩展性良好。

## 热更新（Hot Module Replacement）

### 概念

Webpack 的热更新（HMR），在不刷新页面的前提下，将新代码替换掉旧代码。

### 原理

HMR 的原理实际上是 webpack-dev-server（WDS）和浏览器之间维护了一个 websocket 服务。当本地资源发生变化后，webpack 会先将打包生成新的模块代码放入内存中，然后 WDS 向浏览器推送更新，并附带上构建时的 hash，让客户端和上一次资源进行对比。

### 配置示例

```javascript
const webpack = require('webpack');

module.exports = {
  devServer: {
    hot: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
};
```

## Code Splitting（代码分割）

### 概念

Code Splitting 代码分割，是一种优化技术。它允许将一个大的 chunk 拆分成多个小的 chunk，从而实现按需加载，减少初始加载时间，并提高应用程序的性能。

### 配置方式

在 Webpack 中通过 `optimization.splitChunks` 配置项来开启代码分割：

```javascript
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 20000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
};
```

## Source Map

### 概念

Source Map 是一种文件，它建立了构建后的代码与原始源代码之间的映射关系。通常在开发阶段开启，用来调试代码，帮助找到代码问题所在。

### 配置方式

在 Webpack 配置文件中的 `devtool` 选项中指定：

```javascript
module.exports = {
  devtool: 'source-map'  // 生产环境
  // devtool: 'eval-source-map'  // 开发环境
};
```

### 常用 devtool 选项

- `eval`：最快的构建速度，但不生成 source map
- `eval-source-map`：开发环境推荐，构建速度快，调试友好
- `source-map`：生产环境推荐，生成完整的 source map 文件
- `cheap-source-map`：不包含列信息的 source map
- `inline-source-map`：将 source map 嵌入到 bundle 中

## Tree Shaking

### 概念

Webpack 的 Tree Shaking 是一个利用 ES6 模块静态结构特性来去除生产环境下不必要代码的优化过程。

### 工作原理

1. 当 Webpack 分析代码时，它会标记出所有的 import 语句和 export 语句
2. 然后，当 Webpack 确定某个模块没有被导入时，它会在生成的 bundle 中排除这个模块的代码
3. 同时，Webpack 还会进行递归的标记清理，以确保所有未使用的依赖项都不会出现在最终的 bundle 中

### 配置方式

为了启用 Tree Shaking，需要在 webpack 配置文件中添加如下设置：

```javascript
module.exports = {
  mode: 'production',  // 生产模式自动启用
  optimization: {
    usedExports: true,
    concatenateModules: true,
    minimize: true
  }
};
```

**注意：** 确保你使用的是 ES6 模块语法（即 import 和 export），因为只有这样才能让 Tree Shaking 发挥作用。

## 性能优化

### 提高打包速度

1. **利用缓存**：利用 Webpack 的持久缓存功能，避免重复构建没有变化的代码

```javascript
module.exports = {
  cache: {
    type: 'filesystem'
  }
};
```

2. **使用多进程/多线程构建**：使用 thread-loader、happypack 等插件可以将构建过程分解为多个进程或线程

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          'thread-loader',
          'babel-loader'
        ]
      }
    ]
  }
};
```

3. **使用 DllPlugin 和 HardSourceWebpackPlugin**：DllPlugin 可以将第三方库预先打包成单独的文件，减少构建时间。HardSourceWebpackPlugin 可以缓存中间文件，加速后续构建过程

4. **使用 Tree Shaking**：配置 Webpack 的 Tree Shaking 机制，去除未使用的代码，减小生成的文件体积

5. **移除不必要的插件**：移除不必要的插件和配置，避免不必要的复杂性和性能开销

### 减少打包后的代码体积

1. **代码分割（Code Splitting）**：将应用程序的代码划分为多个代码块，按需加载

2. **Tree Shaking**：配置 Webpack 的 Tree Shaking 机制，去除未使用的代码

3. **压缩代码**：使用工具如 UglifyJS 或 Terser 来压缩 JavaScript 代码

```javascript
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()]
  }
};
```

4. **使用生产模式**：在 Webpack 中使用生产模式，通过设置 `mode: 'production'` 来启用优化

5. **使用压缩工具**：使用现代的压缩工具，如 Brotli 和 Gzip，来对静态资源进行压缩

6. **利用 CDN 加速**：将项目中引用的静态资源路径修改为 CDN 上的路径，减少图片、字体等静态资源等打包

```javascript
module.exports = {
  externals: {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    axios: 'axios'
  }
};
```

## 延伸阅读

- [Vite vs Webpack](./vite.md)
- [模块化与打包概览](./modules-and-bundling/README.md)
- [构建工具资源](./resources.md)

