# 外部系统链接模块

提供与外部系统交互的链接生成能力。

## 目录结构

```
├── WKG.ts              # WKG系统链接
├── __tests__/          # 测试目录
│   └── baiFen.test.ts  # 百分系统测试
├── alice.ts            # Alice系统链接
├── baiFen.ts           # 百分系统链接
├── index.ts            # 外部系统入口
├── payweb.ts           # 支付系统链接
├── rime.ts             # Rime系统链接
└── risk.ts             # 风险系统链接
```

## 核心功能

- 生成外部系统链接
- 处理跨系统参数传递
- 提供系统间跳转能力