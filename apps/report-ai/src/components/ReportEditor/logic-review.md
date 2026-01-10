# ReportEditor 逻辑审查

## 审查目标

审查组件设计合理性、职责边界、性能优化与潜在问题。

## 整体架构评估

### ✅ 优点

1. **职责分离清晰**：组件层（UI）→ Hook 层（逻辑）→ Domain 层（TinyMCE 封装）
2. **半受控模式合理**：内容命令式注入，行为 props 受控，符合富文本编辑器最佳实践
3. **性能优化到位**：RAF 批量渲染、静默注水、Props 轻量化
4. **扩展性良好**：外部组件注册器模式，新增浮层无需修改核心逻辑

### ⚠️ 潜在问题

| 问题                          | 严重性 | 影响                                  |
| ----------------------------- | ------ | ------------------------------------- |
| textRewriteState 必填但可选用 | 中     | 强制传入，即使不使用文本改写功能      |
| initialValue 重复设置         | 中     | TinyMCE prop 与 onInit 中可能重复设置 |
| mode 切换时序问题             | 低     | onInit 与 useEffect 中都有 mode 判断  |
| 回调闭包处理不一致            | 低     | 仅 onContentChange 使用 ref 避免闭包  |

## 分模块审查

### 1. Props 设计

| 问题                          | 建议                     |
| ----------------------------- | ------------------------ |
| textRewriteState 必填但可选用 | 改为可选，提供默认空状态 |
| aigcLoadingChapters 默认值    | 已有默认值 `[]`，合理    |
| 缺少 onError 回调             | 考虑添加统一错误处理回调 |

### 2. Ref 方法设计

| 方法                   | 评估                                      |
| ---------------------- | ----------------------------------------- |
| setContent             | 会触发 onChange，可能导致回环，文档已说明 |
| updateChapterContent   | 静默操作，设计合理                        |
| setFullContent         | 静默操作，避免污染撤销栈，设计合理        |
| updateStreamingSection | 需要外部节流，建议内部实现                |
| applyIdMap             | 返回详细结果，便于调试，设计合理          |

### 3. 生命周期管理

#### onInit 流程分析

```typescript
onInit={(_evt, ed) => {
  attachEditor(ed);                          // 1. 创建 facade
  facade.on('ContentSet', ...);              // 2. 监听事件
  initializeHoverDetection();                // 3. 初始化 hover
  facade.setContent(initialValue || '');     // 4. 设置内容（可能重复）
  if (mode === 'edit') bindEditorRuntime();  // 5. 绑定运行期（可能冲突）
  if (mode === 'preview') setMode('readonly'); // 6. 设置预览（可能冲突）
  onEditorReady?.();                         // 7. 通知就绪
}
```

**问题**：

- 步骤 4 可能与 TinyMCE 的 `initialValue` prop 重复
- 步骤 5-6 的 mode 判断可能与后续 useEffect 冲突

**建议**：移除步骤 4，统一使用 ref 方法；将 mode 逻辑统一到 useEffect

### 4. 外部组件渲染

#### 调度机制评估

**优点**：

- microtask 确保 DOM 更新完成
- RAF 批量渲染，性能优化到位
- 错误隔离，单个渲染器失败不影响其他

**问题**：

- 渲染器执行时间过长可能阻塞主线程
- 缺少执行时间监控

**建议**：

- 添加渲染器执行时间监控（超过 16ms 输出警告）
- 考虑使用 `requestIdleCallback` 处理低优先级渲染

### 5. 性能优化评估

| 优化点       | 状态 | 说明                                    |
| ------------ | ---- | --------------------------------------- |
| Props 轻量化 | ✅   | 不传递 HTML，仅传递控制状态             |
| 静默注水     | ✅   | 使用 `editor.ignore()`，不触发 onChange |
| 批量渲染     | ✅   | RAF 统一调度，microtask 延迟            |
| 流式节流     | ⚠️   | 文档提到 50-100ms，但实际在外部实现     |

## 关键问题与改进建议

### 1. textRewriteState 必填问题

**现状**：Props 定义中标记为必填

**建议**：改为可选，提供默认值

```typescript
textRewriteState?: TextRewriteState;

// 组件内部
const defaultState = { isRewriting: false, correlationId: null, ... };
useTextRewritePreview(editorFacadeRef.current, {
  rewriteState: textRewriteState ?? defaultState,
  ...
});
```

### 2. initialValue 重复设置问题

**现状**：TinyMCE 的 `initialValue` prop 与 `onInit` 中的 `setContent` 可能重复

**建议**：移除 TinyMCE 的 `initialValue`，统一使用 ref 方法

```typescript
<Editor
  // 移除 initialValue prop
  onInit={(_evt, ed) => {
    attachEditor(ed);
    editorFacadeRef.current?.setFullContent(initialValue || '');
    ...
  }
/>
```

**理由**：与注水策略一致，便于追踪内容设置来源

### 3. 回调闭包问题

**现状**：仅 `onContentChange` 使用 ref 避免闭包，其他回调未做类似处理

**建议**：统一使用 ref 处理所有回调

```typescript
const onAIInvokeRef = useRef(onAIInvoke);
const onReferenceClickRef = useRef(onReferenceClick);

useEffect(() => {
  onAIInvokeRef.current = onAIInvoke;
  onReferenceClickRef.current = onReferenceClick;
}, [onAIInvoke, onReferenceClick]);
```

### 4. mode 切换竞态问题

**现状**：`onInit` 与 `useEffect` 中都有 mode 判断

**建议**：移除 `onInit` 中的 mode 判断，统一在 useEffect 处理

```typescript
useEffect(() => {
  if (!editorFacadeRef.current) return;
  if (mode === 'preview') {
    editorFacadeRef.current.setMode('readonly');
  } else {
    editorFacadeRef.current.setMode(readonly ? 'readonly' : 'design');
  }
}, [readonly, mode, editorFacadeRef]);
```

## 改进建议优先级

### 高优先级（建议立即修复）

1. **textRewriteState 改为可选** - 影响使用体验，工作量小，风险低
2. **统一 initialValue 设置** - 影响性能与一致性，工作量小，风险中
3. **统一 mode 切换逻辑** - 影响状态一致性，工作量小，风险低

### 中优先级（建议近期优化）

1. **统一回调闭包处理** - 潜在 bug，工作量中，风险低
2. **添加渲染器性能监控** - 可观测性，工作量小，风险低
3. **内置流式更新节流** - 性能与易用性，工作量中，风险低

### 低优先级（可选优化）

1. **添加统一错误处理回调** - 错误处理，工作量中，风险低
2. **使用 requestIdleCallback** - 性能优化，工作量大，风险中

## 总结

组件整体设计合理，职责分离清晰，性能优化到位。主要问题集中在：

1. Props 设计细节（textRewriteState 必填）
2. 初始化流程的重复操作（initialValue）
3. 状态切换的竞态条件（mode）
4. 回调闭包的一致性处理

这些问题都不是致命缺陷，但修复后可以提升代码质量和维护性。建议按优先级逐步优化。
