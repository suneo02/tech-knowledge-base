# gel-util 架构说明

## 目录职责
本模块是项目最核心的通用工具库，提供大量按功能划分的、可按需导入的工具函数。它是一个典型的 "barrel" 包，聚合了各种功能。

## 目录结构
```
├── src/                      # 源代码
│   ├── biz/                  # 业务相关工具函数
│   ├── common/               # 通用工具函数
│   ├── env/                  # 环境判断函数
│   ├── format/               # 格式化函数
│   ├── hooks/                # 通用 React Hooks
│   ├── intl/                 # 国际化相关功能
│   ├── storage/              # 浏览器存储 (localStorage/sessionStorage) 封装
│   └── ...                   # 其他多种工具函数
├── dist/                     # Vite 打包后的产物
├── vite.config.ts            # Vite 构建配置文件
└── package.json              # 项目依赖和脚本配置
```

## 文件职责说明
- **src/**: 包含了数十种不同类别的工具函数，每个子目录代表一个功能模块。
- **package.json**: `exports` 字段定义了大量的模块入口点（如 `gel-util/format`, `gel-util/hooks`），这是该模块的核心设计，旨在实现精细化的按需加载。
- **vite.config.ts**: 将数量众多的源文件分别打包成独立的模块化产物。

## 模块依赖
- **gel-api**: 依赖 API 层。
- **gel-types**: 依赖共享类型定义。
- **lodash, i18next**: 依赖第三方库提供基础功能。
- 被项目内几乎所有其他应用和包所依赖。
