# report-print 复盘档案

## 0. 受众与用途
- 受众：我自己。
- 用途：用于个人优化复盘与面试备忘。
- 叙述人称：我。

## 1. 全景（Situation & Task）
- 业务背景：我面对的业务是将报告数据与配置动态生成可打印的静态 HTML，并在 wkhtmltopdf 环境输出 PDF。
- 任务目标：我需要保证可分页、样式可控、内容完整，同时在老旧 JS 引擎中稳定执行。
- 架构描述（文字，包含组件关系与数据流）：我用入口页完成配置与语言初始化，渲染器驱动数据拉取与内容生成，分页由页面管理器与表格处理器完成，极端行交给行内拆分器。
- 技术选型对比（文字）：我依据《核心架构设计》的兼容性原则选择 ES5 + jQuery，以避免 wkhtmltopdf 的兼容性静默失败，并把“导出 PDF”作为唯一验收；替代方案取舍细节暂无证据，TODO 补充。
- 边界与非目标：我不引入 React 等现代框架，不做交互渲染，只聚焦静态输出与分页可靠性。
- 证据锚点（设计文档章节或指标来源，1-3 条）：《核心架构设计》(private/carrier/assets/gel-workspace/apps/report-print/docs/core-architecture.md) / 核心原则，《核心渲染流程》(private/carrier/assets/gel-workspace/apps/report-print/docs/core-rendering-flow.md) / 阶段详解，《PDF 自动分页流程与实现》(private/carrier/assets/gel-workspace/apps/report-print/docs/pdf-pagination-process.md) / 步骤详解

## 2. 设计文档引用与要点（必须）
- 设计文档名称/版本：核心架构设计、核心渲染流程、PDF 自动分页架构设计、PDF 自动分页流程与实现、DOM 行分割问题与目标、DOM 行分割算法与实现、开发指南、report-print 技术文档 README。
- 设计文档清单：以上文档集合覆盖架构、流程、分页与行拆分。
- 设计文档路径（关键条目）：private/carrier/assets/gel-workspace/apps/report-print/docs/core-architecture.md；private/carrier/assets/gel-workspace/apps/report-print/docs/core-rendering-flow.md；private/carrier/assets/gel-workspace/apps/report-print/docs/pdf-pagination-architecture.md；private/carrier/assets/gel-workspace/apps/report-print/docs/pdf-pagination-process.md；private/carrier/assets/gel-workspace/apps/report-print/docs/dom-based-row-algorithm-implementation.md
- 关键章节引用（章节标题 + 关联要点）：
- 核心架构设计 > 核心原则：ES5 兼容与 wkhtmltopdf 约束是最高优先级。
- 核心架构设计 > 多层职责分离架构：渲染器、页面管理器、表格处理器、行内拆分器的职责拆分与调用链。
- 核心渲染流程 > 阶段详解/关键决策点：初始化、并行数据获取、内容构建与分页渲染、完成事件。
- PDF 自动分页架构设计 > 核心问题与目标：自动分页、表头重复、极端行处理。
- PDF 自动分页流程与实现 > 步骤详解：逐行添加、溢出判断与极端行拆分。
- DOM 行分割问题与目标/算法与实现：从纯文本估算转为 HTML 单元迭代适配。

## 3. 核心功能与实现（Action - Construction）
- 功能 1：我实现了渲染编排与数据汇聚，入口完成配置后并行拉取表格数据，再统一生成内容序列。
- 功能 2：我搭建了三层分页体系，由页面管理器负责基准高度与页眉页脚，表格处理器逐行追加并检测溢出，常规溢出时移除行并创建新页重建表头，极端行交给行内拆分器拆分后回填剩余行继续处理。
- 功能 3：我实现 DOM 感知的行拆分，先以 HTML 单元迭代适配，再进入细粒度文本拆分以保持标签完整性，并在无法适配时兜底返回空首行。
- 实现流程（文字步骤）：我先完成配置与语言初始化，再并行拉取表格数据，随后由渲染器按封面、说明、正文、附录顺序生成内容，正文表格进入分页逻辑，分页完成后统一更新总页码。
- 分页分支与取舍：当非空表体出现溢出时，我先移除该行再判断页面是否“接近满”（默认阈值 80%，以内容区高度与页面基准高度比较），若页面已接近满则整行移动到新页；若页面未接近满则在当前页尝试行内拆分，以减少空洞并保证信息连续性。
- 阈值解释与案例：我用 80% 作为“接近满”的经验阈值，是在“减少页面空洞”和“避免频繁拆分”之间取平衡；当剩余空间不足以稳定容纳整行时优先整行迁移，避免出现一页只放几行的视觉断裂。TODO：补充具体样例 PDF 或日志统计作为证据。
- 数据结构与复杂度说明：我用章节配置与扁平化配置描述章节与表格，用接口缓存保存表格数据，用单元格数据、HTML 单元与拆分结果表示行拆分过程；请求按配置条目线性遍历，行拆分按 HTML 单元迭代测试并按文本长度逐步试探。
- 证据锚点（设计文档章节或指标来源，1-3 条）：《核心渲染流程》(private/carrier/assets/gel-workspace/apps/report-print/docs/core-rendering-flow.md) / 阶段详解，《PDF 自动分页架构设计》(private/carrier/assets/gel-workspace/apps/report-print/docs/pdf-pagination-architecture.md) / 核心架构，《PDF 自动分页流程与实现》(private/carrier/assets/gel-workspace/apps/report-print/docs/pdf-pagination-process.md) / 步骤详解

## 4. 个人执行与成果（Action & Result）
- 执行范围与边界：我覆盖渲染编排、分页与 DOM 行拆分等核心模块；缺少 commit/PR 佐证，TODO 补充。
- 关键决策与执行：我以三层职责拆分分页逻辑，并将行拆分从纯文本估算迁移为 HTML 感知；替代方案取舍仍需补证。
- 量化结果与证据锚点（指标来源/文档章节，1-3 条）：暂无硬指标，TODO 补充分页正确率、导出成功率、导出耗时或 PDF 体积；证据锚点：《开发指南》(private/carrier/assets/gel-workspace/apps/report-print/docs/development.md) / 开发验证流程

## 5. 深挖案例（Action - Optimization & Result）
- 现象：我遇到单行内容高度超过页面高度的问题，纯文本估算会破坏 HTML 结构且高度预测不准。
- 排查过程：我在逐行追加流程中用页面高度对比判断溢出，若当前页非空且首行溢出则移除整表并创建新页重建表头，若在空页上首行溢出则识别为极端行进入拆分，否则走常规分页路径并重建表头。
- 方案 V1（失败）：我尝试按纯文本长度估算分割点，出现结构破坏与预测不准的问题。
- 方案 V2（最终）：我采用 HTML 单元迭代适配，先批量追加单元测试高度，溢出时回退并对单个单元做细粒度拆分，直至得到可适配的首段内容，并按“首段填充当前页、剩余内容回填到新页”的顺序继续处理。
- 分支与回填顺序：我在非首行溢出时先移除溢出行，再根据页面接近满阈值判断是否整行迁移；整行迁移则新页重建表头后重新追加该行，行内拆分则先渲染首段，再把剩余内容作为新行插回处理队列头部递归处理。
- 关键机制说明（不贴代码，1-3 条）：《PDF 自动分页流程与实现》(private/carrier/assets/gel-workspace/apps/report-print/docs/pdf-pagination-process.md) / 步骤详解，《DOM 行分割算法与实现》(private/carrier/assets/gel-workspace/apps/report-print/docs/dom-based-row-algorithm-implementation.md) / 核心方法
- 失败路径与兜底：当无内容适配时我返回空首行并保留剩余内容，避免渲染中断，并在剩余内容非空时创建新页继续处理。
- 局限性：我对单元格内 DOM 拆分只做两次递归遍历，目前两次递归已经覆盖主要场景。
- 量化结果：暂无硬指标，TODO 补充对比样例 PDF 或日志统计。

## 11. 面试追问准备（Q&A 草案）
- 问：为什么选择“接近满”再整行迁移的策略？答：我需要在可读性与页面利用率之间取平衡；接近满时迁移可避免一页只剩少量内容导致视觉断裂。TODO：补充样例或日志支持。
- 问：为什么行内拆分只做两次递归？答：我以“收益递减”为判断，两次递归已覆盖主要场景，继续递归会增加复杂度与性能成本。TODO：补充边界样例与数据验证。

## 6. 过程记录（可选）
- 关键里程碑：TODO 补充版本节点与发布记录。
- 重要权衡与取舍：TODO 补充选型对比与拒绝方案依据。
- 交付节奏或流程改进：TODO 补充流水线或工单记录。

## 7. 事故复盘（可选）
- 时间线：暂无事故记录，TODO 补充证据。
- 根因：暂无事故记录，TODO 补充证据。
- 行动项：暂无事故记录，TODO 补充证据。

## 8. 知识库（Legacy）
- 片段 1（文字说明）：我将 wkhtmltopdf 兼容性置为最高优先级，所有变更以导出脚本产出 PDF 作为验收。
- 片段 2（文字说明）：我用三层职责拆分分页逻辑，将页面管理、行处理与行内拆分解耦以降低复杂度。
- 注意事项：我必须在 wkhtmltopdf 环境中回归验证分页与样式，浏览器调试仅作辅助。
- 证据锚点（设计文档章节或指标来源，1-3 条）：《核心架构设计》(private/carrier/assets/gel-workspace/apps/report-print/docs/core-architecture.md) / 核心原则，《开发指南》(private/carrier/assets/gel-workspace/apps/report-print/docs/development.md) / 开发验证流程

## 9. 质量协议清单
- [ ] 证据锚点检查（每节 1-3 条，避免长列表）
- [x] 文字化检查（无代码块/图表/表格）
- [ ] 逻辑检查（技术选择与业务关联）
- [x] 设计文档引用检查（名称/章节明确）
- [x] 受众检查（面试者个人复盘与备考用途）
- [x] 第一人称叙述检查（我...）
- [ ] 深挖复盘版检查（权衡、失败路径、回滚条件）

## 10. TODO 与问题
- TODO：提供 commit/PR 或变更记录，用于证明我覆盖的核心模块与关键决策。
- TODO：补充分页正确率、导出成功率、平均导出时长、PDF 体积等指标基线与改变量化数据，并给出日志或仪表盘来源。
- TODO：补充选型对比与拒绝方案依据，例如 CSS 分页或后端分页的取舍。
- TODO：补充回滚策略与触发条件。
- 问题：最脆弱的边界场景是什么，我用什么样例或日志覆盖它。
- 问题：是否存在生产监控或报警面板作为分页异常证据来源。
