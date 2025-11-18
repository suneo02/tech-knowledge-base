# Report-AI 报告生成应用 | 2024.03 - 2024.10

**角色**：项目负责人 & 核心开发（51,314 行代码）

**项目背景**：企业级 AI 报告生成应用，服务金融、咨询行业。日均生成 500+ 份报告，单份 10-50 页。

## 技术挑战

- **并发控制**：AI 生成、用户编辑、保存操作的状态冲突
- **数据一致性**：多层状态同步、并发保存、网络异常恢复
- **性能优化**：50+ 页文档编辑卡顿、频繁保存的网络开销
- **AI 集成**：流式响应处理、生成中断恢复

## 🏗️ 核心设计

### 三层状态设计

[📄](resume/assets/gel-workspace/apps/report-ai/docs/RPDetail/ContentManagement/三层状态设计.md)

- **Canonical 层**：服务端数据作为唯一真相源
- **Draft 层**：本地缓冲 + 文档级哈希判定变更
- **UI 层**：LiveOutline 双向同步 + 用户交互
- **数据流向**：UI → Draft → Canonical 单向同步

### 代码组织

[📄](resume/assets/gel-workspace/apps/report-ai/docs/RPDetail/ContentManagement/横纵文档体系.md)

- **横向分层**：Store/Service/Component/Utils 技术分层
- **纵向场景**：初始化/生成/编辑保存/守卫业务流程
- **领域驱动**：reportContentStore/useFullDocGeneration 等清晰边界
- **文档索引**：矩阵式文档导航

### 外部组件渲染与定位

[📄](resume/assets/gel-workspace/apps/report-ai/docs/RPDetail/RPEditor/external-component-rendering.md)

- **双域挂载**：TinyMCE iframe 内渲染加载占位，`document.body` 挂载 AIGC 按钮与改写预览，互不干扰核心编辑器
- **定位策略**：统一位置计算，结合 iframe 偏移 + `requestAnimationFrame`，保障流式更新与悬停检测的稳定性
- **滚动跟随**：占位与浮层随章节滚动更新位置，避免长文档滚动导致错位
- **降级与守卫**：容器/定位失败时静默降级，不阻断编辑体验

### 数据管理与一致性

[📄](resume/assets/gel-workspace/apps/report-ai/docs/RPDetail/ContentManagement/文档哈希与增量保存.md) · [📄](resume/assets/gel-workspace/apps/report-ai/docs/RPDetail/ContentManagement/Hydration注水机制.md)

- **数据流闭环**：Canonical 拉取 → Hydration 注水到 Draft → UI 编辑产生 delta → 文档哈希判定变更 → Single-Flight 序列化保存 → 更新 Canonical
- **增量保存流水**：Draft 层基于文档哈希产出 delta，Single-Flight 序列化保存，失败回退到全量同步
- **版本冲突守卫**：ETag + txId + Correlation ID 组合校验，发现漂移即拉取 Canonical 并重放 Draft 变更
- **多源一致性**：AIGC/编辑/批量注水统一经过状态机决策层，保证单一写入入口与互斥执行
- **异常恢复**：网络中断保留已生成内容，恢复后对齐 Draft → Canonical，避免重复写入

### AI 生成功能

[📄](resume/assets/gel-workspace/apps/report-ai/docs/AIGC流程设计.md)

- **全文生成**：基于大纲批量生成所有章节
- **单章节生成**：生成特定章节，保持上下文连贯
- **文本改写**：选区级重写，支持语气调整
- **通用核心**：统一的前置校验、流式处理、状态管理

## 💡 核心技术

### 1. 文档级哈希算法

[📄](resume/assets/gel-workspace/apps/report-ai/docs/RPDetail/ContentManagement/文档哈希与增量保存.md)

- **算法实现**：对规范化 HTML 计算 SHA-256 哈希，O(n) 时间复杂度
- **防抖优化**：300-500ms 防抖，避免频繁计算
- **变更检测**：比较哈希值判断内容是否变更
- **增量保存**：仅保存变更内容，减少网络开销

### 2. Hydration 注水机制

[📄](resume/assets/gel-workspace/apps/report-ai/docs/RPDetail/ContentManagement/Hydration注水机制.md)

- **Correlation ID**：为每个操作生成 UUID，支持全链路追踪
- **状态机分离**：决策层与执行层解耦
- **批量合并**：合并相邻章节的注水任务，减少 API 调用
- **失败恢复**：单章节失败不影响整体，支持重试

### 3. Single-Flight 保存

- **串行化**：通过队列确保同一时间只有一个保存操作
- **并发控制**：使用 inFlight 标志位，避免重复请求
- **幂等性**：通过 txId 追踪，确保操作可重试
- **冲突检测**：基于 version/ETag 识别版本冲突

### 4. 状态机管理

[📄](resume/assets/gel-workspace/apps/report-ai/docs/RPDetail/ContentManagement/AIGC核心流程.md)

- **状态机**：idle ↔ full_generation/chapter_generation/text_rewrite/saving 互斥
- **互斥控制**：AI 生成期间编辑器只读
- **状态切换**：处理未保存内容，无缝切换
- **状态展示**：UI 实时展示操作状态
- **错误恢复**：异常时回到 idle 状态

## 🚀 AI 生成功能

### 流式处理

- **实时预览**：SSE 流式接收 AI 内容，逐字渲染到编辑器
- **进度追踪**：显示"正在生成第 3/10 章"
- **中断恢复**：通过 AbortController 取消请求，保存已生成内容
- **质量控制**：过滤敏感词和格式错误

### 选区操作

- **DOM 操作**：使用 Selection API 创建选区 < 50 ms
- **选区扩展**：扩展到完整段落或句子边界
- **批量处理**：合并多个选区操作，减少 API 调用
- **交互反馈**：高亮选区，显示操作按钮

### 叶子章节队列

- **章节筛选**：遍历大纲树，筛选出叶子章节
- **依赖管理**：按章节顺序生成，保持上下文连贯
- **优先级调度**：用户点击的章节优先生成
- **并发控制**：限制同时生成 3 个章节

### 文本改写交互

[📄](resume/assets/gel-workspace/apps/report-ai/docs/RPDetail/ContentManagement/text-ai-rewrite-flow.md)

- **选区验证**：10-2000 字符有效性与上下文检查，自动扩展至完整句子
- **流式预览**：挂载于 `body` 的悬浮预览 100 ms 节流更新，跟随滚动定位
- **结果应用**：一键接受/撤销改写，TinyMCE selection API 直接替换并标记脏状态触发保存
- **光标与状态恢复**：改写中断或失败自动恢复原选区与光标，保持编辑连续性

## 📊 量化成果

### 性能指标

- **编辑响应**：DOM 更新批量处理+节流(50-100 ms)，50+ 页文档编辑流畅度提升 70%
- **保存效率**：文档级哈希算法使变更检测<10 ms，增量保存减少 60% 网络开销
- **内存优化**：单章节消息缓存限制 50 条，长时间使用内存增长<20 MB
- **AI 响应**：SSE 首字节响应<2 秒，流式延迟<500 ms

### 稳定性

- **数据安全**：三层状态+Single-Flight 保存成功率 99.5%
- **错误恢复**：章节级 → 文档级 → 系统级分级处理
- **并发控制**：状态机管理 AI 生成与编辑互斥
- **监控**：Sentry 监控保存成功率、P95 延迟(<300 ms)

### 业务价值

- **生成效率**：AI 生成 10 页报告耗时 2-3 分钟，效率提升 80%
- **用户体验**：实时预览+流式响应，满意度 4.5/5
- **系统容量**：支持 100+ 并发用户，单实例处理 500+ 报告/天
