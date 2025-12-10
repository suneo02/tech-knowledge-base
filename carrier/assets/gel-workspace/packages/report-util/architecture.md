# report-util 架构说明

## 目录职责
本模块是报告相关的通用工具库，提供了报告数据处理、格式化、URL处理、常量等多种按功能划分的工具函数。

## 目录结构
```
├── src/                      # 源代码
│   ├── constants/            # 报告相关的常量
│   ├── format/               # 格式化函数
│   ├── table/                # 表格处理工具
│   ├── tree/                 # 树结构处理工具
│   ├── url/                  # URL 处理函数
│   └── ...                   # 其他多种工具函数
├── dist/                     # Vite 打包后的产物
├── vite.config.ts            # Vite 构建配置文件
└── package.json              # 项目依赖和脚本配置
```

## 文件职责说明
- **src/**: 包含了多种与报告相关的工具函数，每个子目录代表一个功能模块。
- **package.json**: `exports` 字段定义了多个模块入口点（如 `report-util/format`, `report-util/table`），实现了精细化的按需加载。
- **vite.config.ts**: 将多个源文件分别打包成独立的模块化产物。

## 模块依赖
- **gel-types**: 依赖共享的 TypeScript 类型。
- 主要被 `apps/report-preview` 和 `packages/report-preview-ui` 等与报告相关的应用和包所依赖。
