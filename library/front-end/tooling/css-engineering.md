# CSS 工程化

## 概述 {#概述}

CSS 工程化是指通过工程化的方法和工具来组织、编写、处理和优化 CSS 代码，以提高开发效率、代码质量和可维护性。

## CSS 工程化要解决的问题

CSS 工程化是为了解决以下问题：

### 1. 宏观设计

- CSS 代码如何组织？
- 如何拆分？
- 模块结构怎样设计？
- 如何实现代码复用？

### 2. 编码优化

- 怎样写出更好的 CSS？
- 如何提高代码可读性？
- 如何减少重复代码？
- 如何实现响应式设计？

### 3. 构建优化

- 如何处理 CSS，才能让打包结果最优？
- 如何压缩 CSS？
- 如何提取关键 CSS？
- 如何实现按需加载？

### 4. 可维护性

- 代码写完后，如何最小化后续的变更成本？
- 如何确保任何一个同事都能轻松接手？
- 如何避免样式冲突？
- 如何实现主题切换？

## CSS 工程化方案

以下三个方向都是时下比较流行的、普适性非常好的 CSS 工程化实践：

- **预处理器**：Less、Sass 等
- **重要的工程化插件**：PostCSS
- **Webpack loader 等构建工具**

### 1. CSS 预处理器 {#css-预处理器}

#### 为什么要用预处理器？

预处理器，其实就是 CSS 世界的"轮子"。预处理器支持我们写一种类似 CSS、但实际并不是 CSS 的语言，然后把它编译成 CSS 代码。

```
类 CSS 代码 → 预处理器 → 标准 CSS 代码
```

那为什么写 CSS 代码写得好好的，偏偏要转去写"类 CSS"呢？这就和本来用 JS 也可以实现所有功能，但最后却写 React 的 jsx 或者 Vue 的模板语法一样。

随着前端业务复杂度的提高，前端工程中对 CSS 提出了以下的诉求：

- **宏观设计上**：优化 CSS 文件的目录结构，对现有的 CSS 文件实现复用
- **编码优化上**：希望能写出结构清晰、简明易懂的 CSS，需要它具有一目了然的嵌套层级关系；希望它具有变量特征、计算能力、循环能力等更强的可编程性
- **可维护性上**：更强的可编程性意味着更优质的代码结构，实现复用意味着更简单的目录结构和更强的拓展能力

这三点是传统 CSS 所做不到的，也正是预处理器所解决掉的问题。

#### 预处理器的特性

预处理器普遍会具备这样的特性：

1. **嵌套代码的能力**：通过嵌套来反映不同 CSS 属性之间的层级关系
2. **支持定义 CSS 变量**
3. **提供计算函数**
4. **允许对代码片段进行 extend 和 mixin**
5. **支持循环语句的使用**
6. **支持将 CSS 文件模块化，实现复用**

#### Sass/SCSS 示例

```scss
// 变量
$primary-color: #3498db;
$font-size-base: 14px;

// 嵌套
.container {
  width: 100%;
  padding: 20px;
  
  .header {
    background-color: $primary-color;
    font-size: $font-size-base + 2px;
    
    h1 {
      margin: 0;
      color: white;
    }
  }
  
  .content {
    margin-top: 20px;
  }
}

// Mixin
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.box {
  @include flex-center;
  width: 200px;
  height: 200px;
}

// 函数
@function calculate-rem($px) {
  @return $px / 16px * 1rem;
}

.title {
  font-size: calculate-rem(24px);
}

// 循环
@for $i from 1 through 3 {
  .col-#{$i} {
    width: 100% / 3 * $i;
  }
}

// 继承
.button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
}

.primary-button {
  @extend .button;
  background-color: $primary-color;
  color: white;
}
```

#### Less 示例

```less
// 变量
@primary-color: #3498db;
@font-size-base: 14px;

// 嵌套
.container {
  width: 100%;
  padding: 20px;
  
  .header {
    background-color: @primary-color;
    font-size: @font-size-base + 2px;
    
    h1 {
      margin: 0;
      color: white;
    }
  }
}

// Mixin
.flex-center() {
  display: flex;
  justify-content: center;
  align-items: center;
}

.box {
  .flex-center();
  width: 200px;
  height: 200px;
}

// 函数
.calculate-rem(@px) {
  @result: @px / 16 * 1rem;
}

// 循环
.generate-columns(@n, @i: 1) when (@i =< @n) {
  .col-@{i} {
    width: (100% / @n * @i);
  }
  .generate-columns(@n, (@i + 1));
}

.generate-columns(3);
```

#### Stylus 示例

```stylus
// 变量
primary-color = #3498db
font-size-base = 14px

// 嵌套（可省略大括号和分号）
.container
  width 100%
  padding 20px
  
  .header
    background-color primary-color
    font-size font-size-base + 2px
    
    h1
      margin 0
      color white

// Mixin
flex-center()
  display flex
  justify-content center
  align-items center

.box
  flex-center()
  width 200px
  height 200px

// 函数
calculate-rem(px)
  (px / 16) rem

.title
  font-size calculate-rem(24px)

// 循环
for i in 1..3
  .col-{i}
    width (100% / 3 * i)
```

### 2. PostCSS {#postcss}

#### PostCSS 是什么？

PostCSS 是一个用 JavaScript 工具和插件转换 CSS 代码的工具。

```
标准 CSS → PostCSS → 优化后的 CSS
```

#### PostCSS 与预处理器的区别

- **预处理器**处理的是**类 CSS**
- **PostCSS** 处理的就是 **CSS 本身**

PostCSS 做的是类似 Babel 的事情：它可以编译尚未被浏览器广泛支持的先进的 CSS 语法，还可以自动为一些需要额外兼容的语法增加前缀。更强的是，由于 PostCSS 有着强大的插件机制，支持各种各样的扩展，极大地强化了 CSS 的能力。

#### PostCSS 的使用场景

1. **提高 CSS 代码的可读性**：PostCSS 其实可以做类似预处理器能做的工作

2. **当 CSS 代码需要适配低版本浏览器时**：PostCSS 的 Autoprefixer 插件可以帮助自动增加浏览器前缀

3. **允许编写面向未来的 CSS**：PostCSS 能够帮助编译 CSS next 代码

#### PostCSS 常用插件

##### Autoprefixer（自动添加前缀）

```css
/* 输入 */
.container {
  display: flex;
  transition: all 0.3s;
}

/* 输出 */
.container {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
}
```

##### postcss-preset-env（使用未来的 CSS 特性）

```css
/* 输入 */
:root {
  --mainColor: #12345678;
}

body {
  color: var(--mainColor);
  font-family: system-ui;
  overflow-wrap: break-word;
}

/* 输出（转换为当前浏览器支持的语法）*/
body {
  color: rgba(18, 52, 86, 0.47);
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif;
  word-wrap: break-word;
}
```

##### cssnano（压缩优化）

```css
/* 输入 */
.container {
  margin: 10px 10px 10px 10px;
  color: #ffffff;
}

/* 输出 */
.container{margin:10px;color:#fff}
```

##### postcss-import（合并文件）

```css
/* 输入 */
@import "variables.css";
@import "base.css";

/* 输出：将所有文件内容合并 */
```

#### PostCSS 配置示例

```javascript
// postcss.config.js
module.exports = {
  plugins: [
    require('postcss-import'),
    require('postcss-preset-env')({
      stage: 3,
      features: {
        'nesting-rules': true,
        'custom-properties': true
      }
    }),
    require('autoprefixer')({
      overrideBrowserslist: [
        '> 1%',
        'last 2 versions',
        'not dead'
      ]
    }),
    require('cssnano')({
      preset: 'default'
    })
  ]
};
```

### 3. Webpack 处理 CSS

#### Webpack 能处理 CSS 吗？

- Webpack 在裸奔的状态下，是**不能处理 CSS** 的，Webpack 本身是一个面向 JavaScript 且只能处理 JavaScript 代码的模块化打包工具
- Webpack 在 **loader 的辅助下，是可以处理 CSS** 的

#### 如何用 Webpack 实现对 CSS 的处理

操作 CSS 需要使用的两个关键的 loader：

##### css-loader

**作用：** 导入 CSS 模块，对 CSS 代码进行编译处理

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
};
```

css-loader 会：
- 解析 `@import` 和 `url()`
- 处理 CSS 模块化
- 将 CSS 转换为 JavaScript 模块

##### style-loader

**作用：** 创建 `<style>` 标签，把 CSS 内容写入标签

style-loader 会：
- 将 CSS 注入到 DOM 中
- 支持热更新
- 可以配置插入位置

#### 完整的 CSS 处理流程

```javascript
// webpack.config.js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          // 开发环境使用 style-loader
          // 生产环境使用 MiniCssExtractPlugin.loader
          process.env.NODE_ENV === 'development'
            ? 'style-loader'
            : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true, // 启用 CSS Modules
              importLoaders: 1
            }
          },
          'postcss-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          process.env.NODE_ENV === 'development'
            ? 'style-loader'
            : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          process.env.NODE_ENV === 'development'
            ? 'style-loader'
            : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'less-loader'
        ]
      }
    ]
  },
  plugins: [
    // 提取 CSS 到单独文件
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    })
  ],
  optimization: {
    minimizer: [
      // 压缩 CSS
      new CssMinimizerPlugin()
    ]
  }
};
```

## CSS Modules {#css-modules}

### 概念

CSS Modules 是一种 CSS 模块化方案，通过自动生成唯一的类名来避免全局命名冲突。

### 使用示例

```css
/* styles.module.css */
.container {
  padding: 20px;
}

.title {
  font-size: 24px;
  color: #333;
}
```

```javascript
// 在 JavaScript 中使用
import styles from './styles.module.css';

function MyComponent() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Hello</h1>
    </div>
  );
}
```

```html
<!-- 编译后的 HTML -->
<div class="styles__container__3kN2s">
  <h1 class="styles__title__2FkQx">Hello</h1>
</div>
```

### 配置选项

```javascript
{
  loader: 'css-loader',
  options: {
    modules: {
      localIdentName: '[path][name]__[local]--[hash:base64:5]',
      auto: true, // 自动启用 CSS Modules
      exportLocalsConvention: 'camelCase' // 导出格式
    }
  }
}
```

## CSS-in-JS {#css-in-js}

### 概念

CSS-in-JS 是一种在 JavaScript 中编写 CSS 的方法，将样式与组件紧密耦合。

### 主流方案

#### 1. styled-components

```javascript
import styled from 'styled-components';

const Button = styled.button`
  background-color: ${props => props.primary ? '#3498db' : '#ecf0f1'};
  color: ${props => props.primary ? 'white' : '#333'};
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    opacity: 0.8;
  }
`;

// 使用
<Button primary>Click me</Button>
```

#### 2. Emotion

```javascript
import { css } from '@emotion/react';

const buttonStyle = css`
  background-color: #3498db;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  
  &:hover {
    opacity: 0.8;
  }
`;

// 使用
<button css={buttonStyle}>Click me</button>
```

#### 3. JSS

```javascript
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  button: {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    '&:hover': {
      opacity: 0.8
    }
  }
});

function MyButton() {
  const classes = useStyles();
  return <button className={classes.button}>Click me</button>;
}
```

## 原子化 CSS {#原子化-css}

### 概念

原子化 CSS 是一种 CSS 架构方法，使用单一用途的类来构建设计。

### 主流方案

#### Tailwind CSS

```html
<div class="flex items-center justify-center h-screen bg-gray-100">
  <div class="max-w-md p-6 bg-white rounded-lg shadow-lg">
    <h1 class="text-2xl font-bold text-gray-800 mb-4">
      Hello Tailwind
    </h1>
    <p class="text-gray-600">
      This is a card component built with Tailwind CSS.
    </p>
    <button class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
      Click me
    </button>
  </div>
</div>
```

#### UnoCSS

```html
<div class="flex items-center justify-center h-screen bg-gray-1">
  <div class="max-w-md p-6 bg-white rounded shadow">
    <h1 class="text-2xl font-bold mb-4">Hello UnoCSS</h1>
  </div>
</div>
```

## CSS 工程化最佳实践

### 1. 命名规范

#### BEM（Block Element Modifier）

```css
/* Block */
.card {}

/* Element */
.card__header {}
.card__body {}
.card__footer {}

/* Modifier */
.card--primary {}
.card--large {}
.card__header--centered {}
```

#### OOCSS（Object-Oriented CSS）

```css
/* 结构与皮肤分离 */
.button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
}

.button-primary {
  background-color: #3498db;
  color: white;
}

.button-secondary {
  background-color: #ecf0f1;
  color: #333;
}
```

### 2. 目录组织

```
src/
  styles/
    base/
      reset.css
      variables.css
      typography.css
    components/
      button.css
      card.css
      modal.css
    layouts/
      header.css
      footer.css
      grid.css
    pages/
      home.css
      about.css
    utils/
      mixins.scss
      functions.scss
    main.scss
```

### 3. 性能优化

```javascript
// 1. 提取关键 CSS
const CriticalCssPlugin = require('critical-css-webpack-plugin');

// 2. 按需加载
import('./styles/heavy-component.css');

// 3. CSS 压缩
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

// 4. 删除未使用的 CSS
const PurgeCSSPlugin = require('purgecss-webpack-plugin');
```

### 4. 跨浏览器兼容

```javascript
// postcss.config.js
module.exports = {
  plugins: [
    require('autoprefixer')({
      overrideBrowserslist: [
        '> 1%',
        'last 2 versions',
        'not dead',
        'not ie <= 11'
      ]
    }),
    require('postcss-normalize')()
  ]
};
```

## 延伸阅读

- [Webpack 配置](./webpack.md)
- [PostCSS 官方文档](https://postcss.org/)
- [Sass 官方文档](https://sass-lang.com/)
- [Less 官方文档](https://lesscss.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [CSS Modules](https://github.com/css-modules/css-modules)
