# Quick Toolbar 菜单配置

Quick Toolbar 按钮、AI 菜单和快捷键的注册配置。

## 目录结构

```
menu/
├── index.ts                    # 统一导出
├── constants.ts                # 按钮配置、AI 菜单、快捷键
├── types.ts                    # 类型定义
├── aiMenuRegistry.ts           # AI 菜单注册
└── quickToolbarRegistry.ts     # Quick Toolbar 按钮注册
```

## 核心文件

| 文件                      | 职责                                  |
| ------------------------- | ------------------------------------- |
| `constants.ts`            | 定义 Quick Toolbar 按钮配置和 AI 菜单 |
| `aiMenuRegistry.ts`       | 注册 AI 改写菜单按钮和快捷键          |
| `quickToolbarRegistry.ts` | 注册标题样式按钮（H1/H2/H3）          |

## 依赖关系

```
editorConfig.ts
  ↓ 导入
index.ts
  ↓ 导出
aiMenuRegistry.ts + quickToolbarRegistry.ts
  ↓ 使用
constants.ts + types.ts
```

## 相关文档

- [Quick Toolbar 设计](../../../../docs/RPDetail/RPEditor/QuickToolbar.md)
