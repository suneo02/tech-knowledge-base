# editor

编辑器工具模块，提供 TinyMCE 编辑器的统一访问接口、DOM 查找和内容清洗

## 目录结构

```
editor/
├── index.ts              # 统一导出
├── types.ts              # 类型定义
├── editorFacade.ts       # Editor Facade（统一访问接口、调试追踪）
├── contentSanitizer.ts   # 内容清洗（移除外部渲染节点）
└── domFinders.ts         # DOM 查找（Section、引用、内容容器）
```

## 关键说明

- **editorFacade**: 编辑器实例访问的唯一入口，封装所有 TinyMCE 操作，提供类型安全和调用链路追踪
  - 所有类型从 TinyMCE 自动推断（`Parameters<>` / `ReturnType<>`）
  - 参数透传，与 TinyMCE API 保持一致
  - 支持 `console.trace` 调用链路追踪和性能监控
  - 业务代码不直接依赖 TinyMCE，便于未来迁移
- **domFinders**: DOM 查找工具，定位 Section、引用、内容容器等元素
- **contentSanitizer**: 清洗编辑器内容，移除外部渲染节点（用于保存/导出）

## 依赖关系

```
editorFacade → TinyMCE Editor (类型推断)
domFinders → editorFacade → foundation
contentSanitizer → foundation
```

## 相关文档

- [编辑器内容管理设计](../../../../../docs/RPDetail/ContentManagement/README.md)
- [流式更新设计](../../../../../docs/RPDetail/RPEditor/streaming-update.md)

---

> 📖 本文档遵循 [README 编写规范](../../../../../docs/rule/doc-readme-structure-rule.md)

