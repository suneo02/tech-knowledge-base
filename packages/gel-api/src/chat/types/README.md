# 聊天类型定义

定义聊天功能相关的TypeScript类型，包括聊天实体、枚举、数据结构、报告类型和SPL类型等。

## 目录结构

```
types/
├── agent.ts                          # 代理类型
├── base.ts                           # 基础类型
├── dpu.ts                            # DPU类型
├── entity.ts                         # 实体类型
├── enums.ts                          # 枚举类型
├── gelData.ts                        # GEL数据类型
├── identfiers.ts                     # 标识符类型
├── index.ts                          # 入口文件
├── question.ts                       # 问题类型
├── rag.ts                            # RAG类型
├── report/                           # 报告类型目录
│   ├── common.ts                     # 通用报告类型
│   ├── detail.ts                     # 报告详情类型
│   ├── file.ts                       # 报告文件类型
│   ├── index.ts                      # 报告类型入口
│   ├── outline.ts                    # 报告大纲类型
│   ├── report.ts                     # 报告核心类型
│   └── template.ts                   # 报告模板类型
└── spl/                              # SPL类型目录
    ├── index.ts                      # SPL类型入口
    └── tableData.ts                  # SPL表格数据类型
```

## 关键文件说明

- `index.ts` - 聊天类型定义的入口文件
- `base.ts` - 定义聊天功能的基础类型
- `entity.ts` - 定义聊天实体相关的类型
- `enums.ts` - 定义聊天功能中使用的枚举
- `agent.ts` - 定义代理相关的类型
- `dpu.ts` - 定义DPU相关的类型
- `gelData.ts` - 定义GEL数据相关的类型
- `identfiers.ts` - 定义标识符相关的类型
- `question.ts` - 定义问题相关的类型
- `rag.ts` - 定义RAG相关的类型
- `report/` - 报告相关类型目录
  - `index.ts` - 报告类型入口
  - `report.ts` - 报告核心类型定义
  - `common.ts` - 报告通用类型
  - `detail.ts` - 报告详情类型
  - `outline.ts` - 报告大纲类型
  - `template.ts` - 报告模板类型
  - `file.ts` - 报告文件类型
- `spl/` - SPL相关类型目录
  - `index.ts` - SPL类型入口
  - `tableData.ts` - SPL表格数据类型

## 依赖示意

```
聊天类型定义
├── 依赖: TypeScript基础类型
├── 依赖: 通用类型库
├── 依赖: 实体类型库
└── 依赖: 工具类型库
```

## 相关文档

- [聊天基础API文档](../base/)
- [GEL API文档](../../README.md)
- [聊天API文档](../README.md)