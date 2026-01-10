# reportReference

报告引用数据域，负责将引用源数据整理为渲染与侧栏可消费的结构。

## 目录结构

```
reportReference/
├── index.ts             # 域入口，导出引用相关工具
├── ordinalMap.ts        # 构建报告级引用序号映射
└── topFiles.ts          # 筛选报告级未引用的文件列表
```

## 职责

- **ordinalMap.ts**：根据 `apps/report-ai/docs/RPDetail/RPEditor/design.md` 中的引用展示规则，构建全局引用序号映射，供渲染与侧栏统一使用。
- **topFiles.ts**：结合报告文件状态与引用记录，筛选「未被引用的置顶文件」，用于章节详情页与引用侧栏展示。

## 依赖关系

```
chat/ref  ┐
chat      ├─> reportReference
report    ┘
```

- 仅依赖引用源数据的领域模型，不依赖 `reportEditor` 的渲染或编辑器实现。
- 渲染模块通过 `reportReference` 获取引用序号映射，再组合 HTML 输出。

---

> 📖 本文档遵循 [README 编写规范](../../docs/rule/doc-readme-structure-rule.md)

