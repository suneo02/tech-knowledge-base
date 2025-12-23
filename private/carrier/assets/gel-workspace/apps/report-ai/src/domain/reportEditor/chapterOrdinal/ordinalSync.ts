import type { EditorFacade } from '../editor/editorFacade';
import { getHeadingLevel, HEADING_SELECTOR } from '../foundation';
import { applyChapterOrdinalToSection } from './ops';

/**
 * 章节序号同步工具（纯函数）
 *
 * 职责：
 * - 遍历编辑器中的所有章节标题
 * - 根据层级计算章节序号（如 1.2.3）
 * - 将序号渲染到 DOM 中
 *
 * 设计原则：
 * - 纯函数设计，无副作用，易于测试
 * - 与章节 ID 维护逻辑解耦
 * - 幂等操作，多次调用结果一致
 */

/** 章节标题选择器：匹配所有标题元素 */
const TITLE_SELECTOR = HEADING_SELECTOR;

/** 章节序号更新选项 */
export interface UpdateChapterOrdinalsOptions {
  /** 是否打印调试信息 */
  debug?: boolean;
}

/** 章节序号更新结果 */
export interface UpdateChapterOrdinalsResult {
  /** 扫描到的标题总数 */
  totalHeadings: number;
  /** 成功更新的标题数量 */
  updatedCount: number;
  /** 跳过的标题数量（无效标题） */
  skippedCount: number;
}

/**
 * 更新所有章节序号
 *
 * 核心算法：
 * 1. 遍历所有章节标题（按 DOM 顺序）
 * 2. 使用计数器栈维护当前路径（如 [1, 2, 3] 表示 1.2.3）
 * 3. 根据标题层级调整计数器栈
 * 4. 生成层级序号字符串（如 "1.2.3"）
 * 5. 调用 applyChapterOrdinalToSection 渲染序号
 *
 * 计数器栈算法：
 * - 遇到更深层级（如 h2 → h3）：扩展栈，初始化新层级为 0
 * - 遇到更浅层级（如 h3 → h2）：截断栈，移除多余层级
 * - 同一层级（如 h2 → h2）：递增当前层级计数器
 *
 * 示例：
 * ```
 * h1 → counters = [1]       → "1"
 * h2 → counters = [1, 1]    → "1.1"
 * h2 → counters = [1, 2]    → "1.2"
 * h3 → counters = [1, 2, 1] → "1.2.1"
 * h1 → counters = [2]       → "2"
 * ```
 *
 * 特性：
 * - 纯函数：无副作用，易于测试
 * - 幂等操作：多次调用结果一致
 * - 性能优化：只更新变化的序号
 *
 * @param editor - EditorFacade 实例
 * @param options - 更新选项
 * @returns 更新结果统计
 */
export const updateChapterOrdinals = (
  editor: EditorFacade,
  options: UpdateChapterOrdinalsOptions = {}
): UpdateChapterOrdinalsResult => {
  const { debug = false } = options;

  // 检查编辑器是否就绪
  if (!editor.isReady()) {
    return { totalHeadings: 0, updatedCount: 0, skippedCount: 0 };
  }

  const body = editor.getBody();
  if (!body) {
    return { totalHeadings: 0, updatedCount: 0, skippedCount: 0 };
  }

  // 查找所有章节标题（按 DOM 顺序）
  const headings = Array.from(body.querySelectorAll(TITLE_SELECTOR));
  if (headings.length === 0) {
    return { totalHeadings: 0, updatedCount: 0, skippedCount: 0 };
  }

  // 计数器栈：维护当前路径，例如 [1, 2, 3] 表示序号 1.2.3
  const counters: number[] = [];
  let updatedCount = 0;
  let skippedCount = 0;

  headings.forEach((heading) => {
    // 获取标题层级（1-6）
    const level = getHeadingLevel(heading);
    if (level === 0) {
      skippedCount++;
      return; // 跳过无效标题
    }

    // 根据标题层级调整计数器栈
    if (level > counters.length) {
      // 情况 1：进入更深层级（如 h2 → h3）
      // 扩展栈，初始化新层级为 0
      while (counters.length < level) {
        counters.push(0);
      }
    } else {
      // 情况 2：回到更浅层级（如 h3 → h2）
      // 截断栈，移除多余层级
      counters.splice(level);
    }

    // 递增当前层级的计数器
    const current = counters[level - 1] ?? 0;
    counters[level - 1] = current + 1;

    // 生成层级序号字符串（如 "1.2.3"）
    const hierarchicalNumber = counters.slice(0, level).join('.');

    // 将序号直接渲染到标题元素中
    const result = applyChapterOrdinalToSection(editor, heading, hierarchicalNumber, { debug });

    if (result.success && result.changed) {
      updatedCount++;
    }

    // 调试输出：记录成功更新的章节
    if (debug && result.success && result.changed) {
      console.log('[updateChapterOrdinals] updated', heading.tagName, hierarchicalNumber);
    }
  });

  if (debug) {
    console.log('[updateChapterOrdinals] result', {
      totalHeadings: headings.length,
      updatedCount,
      skippedCount,
    });
  }

  return {
    totalHeadings: headings.length,
    updatedCount,
    skippedCount,
  };
};
