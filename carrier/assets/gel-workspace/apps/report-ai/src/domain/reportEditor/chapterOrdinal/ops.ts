import type { EditorFacade } from '../editor/editorFacade';
import { findChapterOrdinalNode } from './find';
import { createChapterOrdinalNode, formatChapterOrdinal } from './render';

/**
 * 应用结果接口
 */
export interface ApplyChapterOrdinalResult {
  /** 是否成功应用序号 */
  success: boolean;
  /** 序号是否发生变化 */
  changed: boolean;
  /** 错误信息（如果失败） */
  error?: string;
}

/**
 * 应用选项接口
 */
export interface ApplyChapterOrdinalOptions {
  /** 是否打印调试信息 */
  debug?: boolean;
}

/**
 * 章节序号 DOM 操作工具
 *
 * 职责：
 * - 将序号应用到标题元素中
 *
 * 设计原则：
 * - 纯函数设计：所有函数无副作用，易于测试
 * - 复用共享工具：序号节点的创建和查找逻辑统一管理
 * - 直接操作标题：编号只依赖标题层级，与章节 ID 无关
 */

/**
 * 将计算好的层级序号应用到标题元素中
 *
 * 核心逻辑：
 * 1. 查找或创建序号节点
 * 2. 更新序号内容（如果变化）
 * 3. 将序号节点插入到标题最前面
 *
 * 更新策略：
 * - 如果序号节点已存在且内容相同，跳过更新（避免不必要的 DOM 操作）
 * - 如果序号节点已存在但内容不同，更新文本内容
 * - 如果序号节点不存在，创建新节点并插入到标题最前面
 *
 * 设计原则：
 * - 编号只依赖标题层级，与章节 ID 无关
 * - 直接操作标题元素，不需要查找容器
 *
 * @param editor - EditorFacade 实例
 * @param titleElement - 标题元素（h1-h6）
 * @param hierarchicalNumber - 层级序号字符串（如 "1.2.3"）
 * @param options - 应用选项
 * @returns 应用结果
 */
export const applyChapterOrdinalToSection = (
  editor: EditorFacade,
  titleElement: Element,
  hierarchicalNumber: string,
  options: ApplyChapterOrdinalOptions = {}
): ApplyChapterOrdinalResult => {
  try {
    // 步骤 1：查找现有的序号节点
    const existingOrdinalNode = findChapterOrdinalNode(titleElement);

    // 计算新的序号内容（使用统一的格式化函数）
    const nextContent = formatChapterOrdinal(hierarchicalNumber);

    // 步骤 2：更新或创建序号节点
    if (existingOrdinalNode) {
      // 情况 1：序号节点已存在
      const current = existingOrdinalNode.textContent ?? '';

      // 如果序号内容相同，跳过更新
      if (current.trim() === hierarchicalNumber) {
        return { success: true, changed: false };
      }

      // 序号内容不同，更新文本
      existingOrdinalNode.textContent = nextContent;
      return { success: true, changed: true };
    }

    // 情况 2：序号节点不存在，创建新节点
    const ordinalNode = createChapterOrdinalNode(editor, hierarchicalNumber);

    // 步骤 3：将序号节点插入到标题最前面
    titleElement.insertBefore(ordinalNode, titleElement.firstChild);

    return { success: true, changed: true };
  } catch (error) {
    // 捕获异常，返回失败结果
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (options.debug) {
      console.error('[applyChapterOrdinalToSection] Failed to update chapter ordinal:', error);
    }
    return { success: false, changed: false, error: errorMessage };
  }
};
