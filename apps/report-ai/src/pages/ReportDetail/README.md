# 报告详情页面

报告AI的报告详情展示页面，提供报告查看、编辑、聊天交互和模板保存等功能。

## 目录结构

```
ReportDetail/
├── ChatTab/                      # 聊天标签页
│   ├── index.module.less         # 聊天标签页样式
│   └── index.tsx                 # 聊天标签页组件
├── Header/                       # 页面头部
│   ├── components/               # 头部组件
│   │   ├── TemplateSaveModal.tsx # 模板保存模态框
│   │   └── index.ts              # 组件入口
│   ├── hooks/                    # 头部钩子
│   │   ├── index.ts              # 钩子入口
│   │   └── useTemplateSave.ts    # 模板保存钩子
│   ├── index.module.less         # 头部样式
│   └── index.tsx                 # 头部组件
├── LeftPanelToggle/              # 左侧面板切换
│   ├── index.module.less         # 切换按钮样式
│   └── index.tsx                 # 切换按钮组件
├── LeftPanel/                    # 左侧面板
│   ├── index.module.less         # 左侧面板样式
│   └── index.tsx                 # 左侧面板组件
├── ReportContent/                # 报告内容
│   ├── COMPONENT_README.md       # 组件说明文档
│   ├── README.md                 # 组件文档
│   ├── ReportContentHeader/      # 报告内容头部
│   │   ├── ReferencePrioritySelector.tsx # 引用优先级选择器
│   │   ├── index.module.less     # 头部样式
│   │   └── index.tsx             # 头部组件
│   ├── SaveStatusIndicator.tsx   # 保存状态指示器
│   ├── index.module.less         # 内容样式
│   ├── index.tsx                 # 内容组件
│   ├── useEditorInitialValue.ts  # 编辑器初始值钩子
│   └── useFileParsingCompletePrompt.ts # 文件解析完成提示钩子
├── RightPanel/                   # 右侧面板
│   ├── index.module.less         # 右侧面板样式
│   └── index.tsx                 # 右侧面板组件
├── hook.tsx                      # 主钩子
├── hooks/                        # 钩子目录
│   └── useAutoGenerate.ts        # 自动生成钩子
├── index.module.less             # 主样式
└── index.tsx                     # 入口组件
```

## 关键文件说明

- `index.tsx` - 报告详情页面的主入口组件
- `ChatTab/` - 聊天交互功能标签页
- `Header/` - 页面头部，包含模板保存功能
- `LeftPanel/` - 左侧面板，可能用于导航或工具
- `RightPanel/` - 右侧面板，可能用于辅助信息
- `ReportContent/` - 报告内容展示和编辑区域
- `hooks/` - 页面级钩子函数

## 依赖示意

```
报告详情页面
├── 依赖: gel-ui组件库
├── 依赖: 报告编辑器
├── 依赖: 聊天组件
├── 依赖: 模板管理API
└── 依赖: 路由配置
```

## 相关文档

- [报告内容组件文档](./ReportContent/)
- [聊天API文档](../../../packages/gel-api/src/chat/)
- [报告AI文档](../../README.md)