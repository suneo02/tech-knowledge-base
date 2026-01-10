# 样式资源管理

提供全局样式、混入、共享样式等样式资源，支撑组件库的视觉设计和主题系统。

## 目录结构

```
styles/
├── mixin/                          # Less 混入文件
│   ├── flex.less                   # 弹性布局混入
│   ├── typography.less             # 文字排版混入
│   ├── animation.less              # 动画效果混入
│   ├── responsive.less             # 响应式设计混入
│   └── index.less                  # 混入统一导出
├── shared/                         # 共享样式文件
│   ├── variables.less              # 全局变量定义
│   ├── reset.less                  # 样式重置
│   ├── base.less                   # 基础样式
│   ├── utilities.less              # 工具类样式
│   └── themes/                     # 主题样式
│       ├── light.less              # 浅色主题
│       ├── dark.less               # 深色主题
│       └── index.less              # 主题导出
├── index.less                      # 样式统一导出
├── globals.less                    # 全局样式
└── antd-custom.less                # Ant Design 定制样式
```

## 关键文件说明

- **mixin/**: Less 混入集合，提供可复用的样式模式，如 flex 布局、动画等
- **shared/variables.less**: 全局样式变量，包含颜色、字体、间距等设计令牌
- **shared/themes/**: 主题系统，支持浅色、深色主题切换
- **shared/utilities.less**: 工具类样式，提供常用的样式类
- **antd-custom.less**: Ant Design 组件库的定制样式

## 依赖关系

```
styles/
├── 上游依赖
│   ├── less: Less 预处理器
│   └── antd: Ant Design 样式变量
├── 内部依赖
│   ├── 变量间的相互引用
│   └── 混入和主题的组合
└── 被依赖关系
    ├── 所有组件模块: 样式消费方
    ├── biz: 业务组件样式
    ├── common: 基础组件样式
    └── layout: 布局组件样式
```

## 相关文档

- [样式规范](../../../docs/rule/code-style-less-bem-rule.md) - Less Module 样式指南
- [React 规范](../../../docs/rule/code-react-component-rule.md) - 组件样式集成指南
