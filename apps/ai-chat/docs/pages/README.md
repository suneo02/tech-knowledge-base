# AI Chat 页面组件

## 定位
定义应用的页面级组件和路由结构，负责页面布局、业务逻辑组织和用户交互流程。

## 目录结构
```
pages/
├── Demo/              # 演示页面
│   └── component/     # 页面级组件
│       └── MultiTable/ # 表格页面组件
└── README.md         # 本文档
```

## 页面功能
- **Demo**: 展示组件功能和交互的演示页面
- **MultiTable**: 大数据量表格处理页面

## 设计原则
- **页面职责清晰**: 每个页面专注于特定业务场景
- **组件复用**: 优先使用 components 中的可复用组件
- **状态管理**: 合理使用 hooks 和 contexts 管理页面状态
- **用户体验**: 优化页面加载性能和交互体验

## 关联文件
- [Demo MultiTable design](./Demo/component/MultiTable/design.md)
- @see apps/ai-chat/src/pages/