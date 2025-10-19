# 代码检查与 ESLint

## 概述

Lint 会对代码做静态分析，检查出其中的一些结构错误或者格式错误。在前端领域中，我们常用的 lint 就是 ESLint，它用于检查 JavaScript 代码是否符合规则。

## ESLint 基本概念

### 什么是 ESLint

ESLint 是一个开源的 JavaScript 代码检查工具，由 Nicholas C. Zakas 于 2013 年创建。它的目标是提供一个插件化的 JavaScript 代码检测工具。

**核心特性：**

- 代码质量检查
- 代码风格统一
- 潜在错误检测
- 可配置规则
- 插件化架构
- 自动修复能力

## ESLint 工作原理 {#eslint-工作原理}

### 基本架构

ESLint 基本架构图如下：

```
源代码 → Parser → AST → Rules → Linting Problems → Fix → 修复后的代码
```

**核心模块：**

`lib/linter/` - 这个模块是核心的 `Linter` 类，根据配置选项进行代码验证、检查并修复问题。这个文件不做任何文件 I/O，并且完全不与 `console` 互动。

### Linter 核心 API

Linter 是 eslint 最核心的类，它提供了以下 API：

- **verify**：检查代码
- **verifyAndFix**：检查并修复代码
- **getSourceCode**：获取 AST
- **defineParser**：定义 Parser
- **defineRule**：定义 Rule
- **getRules**：获取所有的 Rule

### AST（抽象语法树）

ESLint 拿到源代码后会进行 parse 操作，生成 AST 用于静态分析。ESLint 使用的是 [Espree](https://github.com/eslint/espree) parser。

**Espree 的演进：**

> Estree 是一套 AST 标准，[Esprima](https://github.com/jquery/esprima) 基于 estree 标准实现了 AST。[Acorn](https://github.com/acornjs/acorn) 在 Exprima 之后出现，也是 estree 标准的实现，但是它速度比 esprima 快，而且支持插件，可以通过插件扩展语法支持。
>
> Espree 最初 Fork 自 Esprima，因为 Acorn 的各种优点现在它建立在 Acorn 之上。

#### 常见 AST 节点类型

##### 1. Literal（字面量）

Literal 是字面量的意思，它的值可以是布尔、数字、字符串等。

```javascript
// 源代码
const num = 42;
const str = "hello";
const bool = true;

// AST
{
  type: "Literal",
  value: 42,
  raw: "42"
}
```

##### 2. Identifier（标识符）

Identifier 是标识符的意思，变量名、属性名、参数名等各种声明和引用的名字，都是 Identifier。

```javascript
// 源代码
const myVariable = 10;

// AST
{
  type: "Identifier",
  name: "myVariable"
}
```

##### 3. Statement（语句）

statement 是语句，它是可以独立执行的单位，比如 break、continue、debugger、return 或者 if 语句、while 语句、for 语句，还有声明语句，表达式语句等。

**常见语句类型：**

```javascript
break;
continue;
return;
debugger;
throw Error();
{}
try {} catch(e) {} finally{}
for (let key in obj) {}
for (let i = 0; i < 10; i++) {}
while (true) {}
do {} while (true)
switch (v) { case 1: break; default:; }
with (a) {}
```

## ESLint 工作流程

### 1. PreProcess 阶段

#### 确定是否需要 process

ESLint 处理器可以从其他类型的文件中提取 JavaScript 代码，然后让 ESLint 对 JavaScript 代码进行检查。

例如，对 `.vue` 类型文件做 ESLint 检查，processor 就派上用场了。

```javascript
// .eslintrc.js
module.exports = {
  processor: 'vue/.vue'
}
```

### 2. Parse 阶段

#### 确定 parser

默认是 ESLint 自带的 Espree，也可以通过配置来切换成别的 parser：

- `@babel/eslint-parser`：支持 Babel 转换的代码
- `@typescript-eslint/parser`：支持 TypeScript
- `vue-eslint-parser`：支持 Vue SFC

```javascript
// .eslintrc.js
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  }
}
```

#### 执行 parse 生成 Source Code（AST）

Parser 将源代码转换为 AST，供后续规则检查使用。

### 3. 检查阶段

#### 调用 rule 对 SourceCode 检查，生成 linting problems

**检查流程：**

1. **遍历 AST 并存储 AST Node**
   - 深度优先遍历整个 AST 树
   - 记录每个节点的类型和位置

2. **遍历规则列表**
   - 为每条规则添加对应 AST Node 的 Listener
   - 规则可以监听多种节点类型

3. **Emit 对应 AST Node 的 Listener**
   - 当遍历到特定节点时，触发对应规则的监听器
   - 规则检查节点是否符合要求
   - 如果不符合，生成 linting problem

**示例规则实现：**

```javascript
// rules/no-console.js
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow the use of console',
      category: 'Best Practices',
      recommended: false
    },
    fixable: 'code',
    schema: []
  },
  create(context) {
    return {
      // 监听 MemberExpression 节点
      MemberExpression(node) {
        if (node.object.name === 'console') {
          context.report({
            node,
            message: 'Unexpected console statement.',
            fix(fixer) {
              return fixer.remove(node.parent);
            }
          });
        }
      }
    };
  }
};
```

**为什么需要先存储 AST Node 然后再遍历？**

因为 rules 一直有个小问题，node 的 parent 属性只会在节点被遍历后才能被访问到。为了解决这个问题 ESLint 延迟执行了 Emit，这样 node parent 属性就可以被访问到了。

### 4. PostProcess 阶段

这个阶段主要用来对生成的 linting problems 做一些处理，例如过滤、修改之类的。

```javascript
// processor
module.exports = {
  preprocess(text, filename) {
    return [text];
  },
  postprocess(messages, filename) {
    // messages 是一个二维数组，每个元素对应 preprocess 返回的一个文本块
    return messages[0];
  }
};
```

### 5. Fix 阶段

对于可以 fix 的规则在 lint 检查完后，linting problems 里会有生成的 fix 信息，用于自动修复问题。

#### Fix 信息结构

```javascript
{
  fix: {
    range: [9, 11],  // 替换范围
    text: ';'        // 替换内容
  }
}
```

**修复示例：**

1. **源代码**

```javascript
var x = 1;;  // 多余的分号
```

2. **配置 rule**：`no-extra-semi`，不允许多余的分号

3. **运行 ESLint 检查**，生成如下结构：

```javascript
{
  fix: {
    range: [9, 11],
    text: ';'
  }
}
```

表示替换源码字符串中 index 从 9 到 11 的内容为 `;`，即替换 `;;` 为 `;`

4. **修复后结果**：

```javascript
var x = 1;
```

#### Fix 流程分析

**为什么要加循环修复？**

因为多个 linting problem 之间的 range 也就是替换的范围可能是有重叠的，如果有重叠就放到下一次来修复，下一次修复则会根据当前修复过一次的代码再继续 verify，生成 linting problems，以此循环直至没有 problem 可以修复。

不过这样的循环最多修复 10 次，如果还有 linting problems 没修复就不修了。

## ESLint 配置 {#eslint-配置}

### 配置文件

ESLint 支持多种配置文件格式：

- `.eslintrc.js`（推荐）
- `.eslintrc.json`
- `.eslintrc.yaml`
- `.eslintrc.yml`
- `package.json` 中的 `eslintConfig` 字段

### 基本配置示例

```javascript
// .eslintrc.js
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module'
  },
  plugins: [
    '@typescript-eslint',
    'vue'
  ],
  rules: {
    'no-console': 'warn',
    'no-debugger': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    'vue/multi-word-component-names': 'off'
  }
};
```

### 配置项说明

#### 1. env（环境）

指定代码运行环境，每个环境都有一组特定的预定义全局变量。

```javascript
{
  env: {
    browser: true,    // 浏览器全局变量
    node: true,       // Node.js 全局变量
    es2021: true,     // ES2021 全局变量
    jest: true,       // Jest 全局变量
    jquery: true      // jQuery 全局变量
  }
}
```

#### 2. extends（继承）

继承其他配置文件。

```javascript
{
  extends: [
    'eslint:recommended',                    // ESLint 推荐规则
    'plugin:vue/vue3-recommended',           // Vue 3 推荐规则
    'plugin:@typescript-eslint/recommended', // TypeScript 推荐规则
    'prettier'                               // Prettier 规则（关闭冲突规则）
  ]
}
```

#### 3. parser（解析器）

指定 ESLint 使用的解析器。

```javascript
{
  parser: '@typescript-eslint/parser'
}
```

#### 4. parserOptions（解析器选项）

```javascript
{
  parserOptions: {
    ecmaVersion: 2021,        // ECMAScript 版本
    sourceType: 'module',     // 模块类型（script/module）
    ecmaFeatures: {
      jsx: true,              // 启用 JSX
      impliedStrict: true     // 启用严格模式
    }
  }
}
```

#### 5. plugins（插件）

加载第三方插件。

```javascript
{
  plugins: [
    '@typescript-eslint',
    'vue',
    'import'
  ]
}
```

#### 6. rules（规则）

配置具体规则。

```javascript
{
  rules: {
    'no-console': 'warn',                         // 警告
    'no-debugger': 'error',                       // 错误
    'no-unused-vars': 'off',                      // 关闭
    'quotes': ['error', 'single'],                // 强制单引号
    'semi': ['error', 'always'],                  // 强制分号
    'indent': ['error', 2],                       // 强制 2 空格缩进
    '@typescript-eslint/no-explicit-any': 'warn'  // 警告使用 any
  }
}
```

**规则级别：**

- `'off'` 或 `0`：关闭规则
- `'warn'` 或 `1`：警告（不会导致程序退出）
- `'error'` 或 `2`：错误（会导致程序退出）

#### 7. ignorePatterns（忽略模式）

```javascript
{
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    '*.min.js'
  ]
}
```

或使用 `.eslintignore` 文件：

```
node_modules/
dist/
build/
*.min.js
```

### 行内配置

```javascript
/* eslint-disable */
// 禁用所有规则
const a = 1;
/* eslint-enable */

/* eslint-disable no-console */
// 禁用特定规则
console.log('test');
/* eslint-enable no-console */

// eslint-disable-next-line no-console
console.log('test');  // 下一行禁用

const b = 1; // eslint-disable-line no-unused-vars
```

## 常用规则集

### ESLint 内置规则

```javascript
{
  rules: {
    // 可能的错误
    'no-console': 'warn',
    'no-debugger': 'error',
    'no-dupe-keys': 'error',
    'no-duplicate-case': 'error',
    'no-empty': 'error',
    'no-extra-semi': 'error',
    
    // 最佳实践
    'eqeqeq': ['error', 'always'],
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-with': 'error',
    
    // 变量
    'no-undef': 'error',
    'no-unused-vars': 'warn',
    'no-use-before-define': 'error',
    
    // 风格
    'indent': ['error', 2],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'comma-dangle': ['error', 'never']
  }
}
```

### TypeScript 规则

```javascript
{
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/ban-ts-comment': 'warn'
  }
}
```

### Vue 规则

```javascript
{
  rules: {
    'vue/multi-word-component-names': 'off',
    'vue/no-v-html': 'warn',
    'vue/require-default-prop': 'error',
    'vue/require-prop-types': 'error',
    'vue/order-in-components': 'error'
  }
}
```

## ESLint 与 Prettier 集成 {#eslint-与-prettier-集成}

### 安装依赖

```bash
npm install -D eslint prettier eslint-config-prettier eslint-plugin-prettier
```

### 配置 ESLint

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended'  // 必须放在最后
  ],
  rules: {
    'prettier/prettier': 'error'
  }
};
```

### 配置 Prettier

```javascript
// .prettierrc.js
module.exports = {
  semi: true,
  singleQuote: true,
  trailingComma: 'none',
  printWidth: 80,
  tabWidth: 2,
  endOfLine: 'lf'
};
```

## 在项目中使用

### 命令行使用

```bash
# 检查文件
npx eslint src/

# 检查并自动修复
npx eslint src/ --fix

# 检查特定文件
npx eslint src/index.js

# 输出格式化
npx eslint src/ --format stylish
```

### Package.json 脚本

```json
{
  "scripts": {
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix",
    "lint:report": "eslint src/ --format json --output-file eslint-report.json"
  }
}
```

### 编辑器集成

#### VS Code

安装 ESLint 插件，并在 `settings.json` 中配置：

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "vue"
  ]
}
```

### Git Hooks 集成

使用 husky 和 lint-staged 在提交前自动检查：

```bash
npm install -D husky lint-staged
```

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx,vue}": [
      "eslint --fix",
      "git add"
    ]
  }
}
```

## 自定义规则 {#自定义规则}

### 创建自定义规则

```javascript
// rules/no-chinese.js
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow chinese characters in code',
      category: 'Best Practices',
      recommended: false
    },
    fixable: null,
    schema: []
  },
  create(context) {
    return {
      Literal(node) {
        if (typeof node.value === 'string') {
          const hasChinese = /[\u4e00-\u9fa5]/.test(node.value);
          if (hasChinese) {
            context.report({
              node,
              message: 'Chinese characters are not allowed in code'
            });
          }
        }
      }
    };
  }
};
```

### 使用自定义规则

```javascript
// .eslintrc.js
module.exports = {
  plugins: ['custom'],
  rules: {
    'custom/no-chinese': 'error'
  }
};
```

## 最佳实践

### 1. 团队统一配置

使用共享配置包：

```bash
npm install -D @company/eslint-config
```

```javascript
module.exports = {
  extends: ['@company/eslint-config']
};
```

### 2. 渐进式启用规则

```javascript
{
  rules: {
    'no-console': 'warn',  // 先警告
    // 'no-console': 'error',  // 后期改为错误
  }
}
```

### 3. 合理使用禁用注释

```javascript
// 好的使用
/* eslint-disable-next-line no-console */
console.log('Important debug info');

// 不好的使用
/* eslint-disable */
// 大段代码...
```

### 4. 定期更新规则

```bash
# 检查过时的配置
npx eslint --print-config src/index.js

# 更新 ESLint 和插件
npm update eslint eslint-plugin-vue
```

## 延伸阅读

- [Babel 转译](./babel.md)
- [Prettier 代码格式化](https://prettier.io/)
- [ESLint 官方文档](https://eslint.org/)
- [TypeScript ESLint](https://typescript-eslint.io/)
- [Vue ESLint Plugin](https://eslint.vuejs.org/)
