# misc

杂项组件库，包含首页按钮、侧边栏等辅助组件

## 目录结构

```
misc/
├── HomeBtn/                   # 首页按钮
│   └── index.tsx              # 首页按钮组件
├── SiderMain/                 # 侧边栏主体
│   └── index.tsx              # 侧边栏组件
└── index.ts                   # 统一导出
```

## 核心组件职责

### HomeBtn

首页按钮组件，提供返回首页的快捷入口

### SiderMain

侧边栏主体组件，提供侧边栏布局和导航功能

## 模块依赖

```
页面布局
  ├─> HomeBtn (首页按钮)
  └─> SiderMain (侧边栏)
```
