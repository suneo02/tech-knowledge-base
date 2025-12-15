# 解决方案 - Undo/Redo 状态轮询问题

> 📖 [返回问题概览](./README.md) | 遵循 [Issue 文档编写规范](../../../../../docs/rule/issue-doc-rule.md)

## 推荐方案

**采用事件驱动机制替代定时器轮询**

### 方案要点

1. **扩展 EditorFacade 事件类型**：监听 `undoManager` 事件
2. **创建 useUndoRedoState Hook**：封装事件监听逻辑
3. **替换轮询逻辑**：在 `ReportContent` 中使用新的 Hook

### 实施步骤

#### 步骤 1：扩展 EditorFacade 事件类型（0.5 天）

在 `EditorFacade` 中添加 undo/redo 事件监听：

```typescript
// domain/reportEditor/editor/editorFacade.ts

// 1. 扩展事件类型
export type EditorEventType =
  | 'contentChange'
  | 'undoStateChange'  // 新增
  | 'redoStateChange'; // 新增

// 2. 监听 undoManager 事件
private setupUndoRedoEvents() {
  this.editor.on('Undo Redo', () => {
    this.emit('undoStateChange', this.hasUndo());
    this.emit('redoStateChange', this.hasRedo());
  });
}
```

#### 步骤 2：创建 useUndoRedoState Hook（0.5 天）

封装事件监听逻辑：

```typescript
// hooks/useUndoRedoState.ts

export const useUndoRedoState = (facade: EditorFacade | null) => {
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  useEffect(() => {
    if (!facade) return;

    const handleUndoChange = (state: boolean) => setCanUndo(state);
    const handleRedoChange = (state: boolean) => setCanRedo(state);

    facade.on('undoStateChange', handleUndoChange);
    facade.on('redoStateChange', handleRedoChange);

    // 初始化状态
    setCanUndo(facade.hasUndo());
    setCanRedo(facade.hasRedo());

    return () => {
      facade.off('undoStateChange', handleUndoChange);
      facade.off('redoStateChange', handleRedoChange);
    };
  }, [facade]);

  return { canUndo, canRedo };
};
```

#### 步骤 3：替换 ReportContent 中的轮询逻辑（0.5 天）

```typescript
// pages/ReportDetail/ReportContent/index.tsx

// 移除轮询逻辑
- useEffect(() => {
-   const timer = setInterval(() => {
-     setCanUndo(facade?.hasUndo() ?? false);
-     setCanRedo(facade?.hasRedo() ?? false);
-   }, 500);
-   return () => clearInterval(timer);
- }, [facade]);

// 使用新的 Hook
+ const { canUndo, canRedo } = useUndoRedoState(facade);
```

### 备选方案

**直接在 ReportContent 中监听 TinyMCE 事件**

**放弃理由**：

- 破坏封装性，绕过 EditorFacade
- 无法复用，其他组件需要重复实现
- 违反架构设计原则

## 预期效果

- **性能提升**：消除 95% 的无效调用
- **响应速度**：状态更新无延迟（从 500ms 降至 0ms）
- **资源占用**：CPU 占用显著降低
- **代码质量**：符合事件驱动原则，可复用性强

## 更新记录

| 日期       | 修改人 | 更新内容             |
| ---------- | ------ | -------------------- |
| 2025-10-29 | Kiro   | 从主文档拆分解决方案 |
