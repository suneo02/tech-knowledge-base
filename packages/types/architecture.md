# gel-types 架构说明

## 目录职责
本模块是整个 monorepo 的共享 TypeScript 类型定义中心，旨在确保跨应用和跨包的数据结构一致性。

## 目录结构
```
├── src/                      # TypeScript 类型定义源文件
│   ├── api/                  # API 请求/响应相关的类型
│   ├── biz/                  # 业务相关的类型
│   ├── common.ts             # 通用基础类型
│   └── index.ts              # 主入口，统一导出所有类型
├── dist/                     # 打包后的类型声明文件 (.d.ts)
├── scripts/                  # 脚本 (如: 从 TS 类型生成 JSON Schema)
├── vite.config.ts            # Vite 构建配置文件
└── package.json              # 项目依赖和脚本配置
```

## 文件职责说明
- **src/**: 存放所有共享的 TypeScript `interface` 和 `type` 定义。
- **scripts/gen:schema**: 用于从 TypeScript 类型自动生成 JSON Schema，以供其他系统（如后端）使用。
- **dist/**: 只包含类型声明文件 (`.d.ts`)，用于在其他项目中进行类型检查和智能提示。

## 模块依赖
- 本模块无生产环境依赖。
- 被项目内几乎所有其他应用和包所依赖。
