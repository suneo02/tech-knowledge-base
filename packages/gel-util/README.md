# @gel/util

Gel Web Utilities - Environment and Client Functions

## Installation

```bash
pnpm add @gel/util
```

## ❗ 重要提示 ❗

util 包中 misc 目录下如果加方法，需要注意 site title ，及 company 的网页标题是否正常，踩过一次坑，没查出来问题 。。。

## Usage

```typescript
import { getCurrentEnv, callClientFunc, type TGelEnv } from '@gel/util';

// Get current environment
const env: TGelEnv = getCurrentEnv();


// Call client function
callClientFunc({
  func: 'querydata',
  name: 'example',
  isGlobal: 1
}, (data) => {
  console.log('Response:', data);
});

```

## API Reference

### Environment Types

- `TGelEnv`: Union type of possible environments
  - `"terminal"` - Terminal environment
  - `"local"` - Local development environment
  - `"web"` - Web production environment
  - `"webTest"` - Web test environment
  - `"terminalWeb"` - Terminal web environment

### Functions

- `getCurrentEnv(): TGelEnv` - Get the current environment
- `usedInClient(): boolean` - Check if running in client environment
- `isDev(): boolean` - Check if in development environment
- `isWebTest(): boolean` - Check if in web test environment

### Client Functions

- `callClientFunc<T>(params: ClientFuncParams, callback: ClientFuncCallback<T>)` - Call client functions

## Development

```bash
# Install dependencies
pnpm install

# Development with watch mode
pnpm dev

# Build
pnpm build

# Type check
pnpm typecheck

# Lint
pnpm lint
```

## License

UNLICENSED - Private use only

## 重要变更 - 模块化导入

从版本 X.X.X 起，`gel-util` 已完全改为子模块导入方式，以提高应用打包性能和优化树摇（Tree Shaking）。

### 迁移指南

请将所有从主入口的导入：

```typescript
// ❌ 不再支持
import {  isDev, formatTime } from 'gel-util';
```

修改为相应子模块的导入：

```typescript 
// ✅ 正确方式
import {  isDev } from 'gel-util/env';
import { formatTime } from 'gel-util/format';
```

## 可用子模块

`gel-util` 包含以下子模块：

| 模块名 | 描述 | 主要函数/类型 |
|--------|------|--------------|
| `env` | 环境相关函数 |  `isDev`, `usedInClient`, `WindSessionHeader` |
| `intl` | 国际化相关 | `i18n`, `t`, `getLocale`, `SupportedLocale` |
| `link` | 链接生成 | `generateUrlByModule`, `LinkModule` |
| `format` | 格式化函数 | `formatTime`, `formatMoney`, `numberFormat` |
| `translate` | 翻译相关函数 | |
| `corp` | 企业相关函数和类型 | `TCorpArea` |
| `config` | 配置相关 | |
| `corpConfig` | 企业配置相关 | |
| `typeUtil` | 类型工具 | |

## 常用函数对照表

以下是常用函数所在的子模块：

| 函数名 | 子模块 |
|--------|------|
| `isDev` | `env` |
| `usedInClient` | `env` |
| `WindSessionHeader` | `env` |
| `i18n` | `intl` |
| `t` | `intl` |
| `getLocale` | `intl` |
| `isEn` | `intl` |
| `SupportedLocale` | `intl` |
| `formatTime` | `format` |
| `formatMoney` | `format` |
| `formatMoneyComma` | `format` |
| `numberFormat` | `format` |
| `generateUrlByModule` | `link` |
| `LinkModule` | `link` |
| `STATIC_FILE_PATH` | `download` |
| `TCorpArea` | `corp` |
| `makeTree` | `corp` |

## 使用问题

如果不确定某个函数属于哪个模块，请参考上面的对照表或查看相应模块的源代码。 