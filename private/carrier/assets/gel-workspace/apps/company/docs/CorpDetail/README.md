# 企业详情页（AI增强版）文档索引

## 一句话定位
企业详情页AI增强版，提供企业信息展示、智能问答和数据分析功能。

## 目录树

```
CorpDetail/
├── design.md              # 整体架构设计
├── layout-container.md    # 主容器布局管理
├── layout-header.md       # 顶部操作栏设计
├── layout-left.md         # 左侧内容区设计
├── layout-middle.md       # 核心业务逻辑设计
├── layout-right.md        # 右侧AI面板设计
└── README.md              # 文档索引（本文件）
```

## 关键文件说明

| 文档 | 作用 |
|------|------|
| **design.md** | 整体架构、四区域协调机制、响应式策略 |
| **layout-container.md** | 上左右三区域布局管理、状态协调 |
| **layout-header.md** | 企业信息展示、操作控制、用户交互 |
| **layout-left.md** | 左侧内容区布局、菜单导航、数据展示 |
| **layout-right.md** | 智能对话、上下文感知、界面控制 |

## 依赖示意

- **上游依赖**：企业基本信息API、AI服务接口
- **下游影响**：企业报告生成、数据导出功能
- **关联组件**：企业组件库、AI对话组件

## 相关文档

- [设计文档编写规范](../../../docs/rule/design-doc.md)
- [React开发规范](../../../docs/rule/react-rule.md)
- [企业详情需求文档](./requirements.md)

---

**架构师维护**：文档结构清晰，关联关系准确。修改建议请联系架构师评估影响范围。