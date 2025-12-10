# ReportEditor 配置模块

TinyMCE 编辑器配置集合，负责初始化、样式注入、菜单注册和运行时行为绑定。

## 目录结构

```
config/
├── editorConfig.ts             # 主配置：静态初始化 + 运行时绑定
├── contentCss.ts               # 样式文件列表（注入 iframe）
├── menu/                       # Quick Toolbar 按钮、AI 菜单、快捷键
├── contextMenuConfig.md        # Context Menu 说明（已废弃）
└── menubarConfig.md            # Menubar 配置参考
```

## 核心文件

| 文件              | 职责                                                 |
| ----------------- | ---------------------------------------------------- |
| `editorConfig.ts` | 导出 `createStaticEditorInit` 和 `bindEditorRuntime` |
| `contentCss.ts`   | 返回编辑器内容样式路径数组                           |
| `menu/`           | 注册 Quick Toolbar 按钮、AI 菜单、快捷键             |

## 依赖关系

```
ReportEditor 组件
  ↓ 调用
editorConfig.ts
  ↓ 引用
menu/ + contentCss.ts
  ↓ 注册到
TinyMCE 实例
```

## 相关文档

- [Quick Toolbar 设计](../../../docs/RPDetail/RPEditor/QuickToolbar.md) - 编辑入口设计
- [样式规范](../../../../docs/rule/style-rule.md)
