/**
 * 选区操作函数
 *
 * 提供选区级别的编辑器操作，用于文本 AI 改写场景
 *
 * @see apps/report-ai/docs/specs/text-ai-rewrite-implementation/spec-design-v1.md
 */

import type { SelectionContent, SelectionSnapshot, SerializedBookmark } from '@/types/editor';
import type { EditorFacade } from '../editor/editorFacade';
import { RP_DATA_ATTRIBUTES } from '../foundation';

/**
 * 获取选中文本及上下文
 *
 * 用于文本 AI 改写场景，获取选中文本及前后文上下文
 *
 * @param editor - EditorFacade 实例
 * @returns 选中文本信息，如果编辑器未就绪则返回 null
 */
export function getSelectedText(editor: EditorFacade): SelectionContent | null {
  if (!editor.isReady()) {
    return null;
  }

  const text = editor.getSelectedContent({ format: 'text' }) || '';
  const html = editor.getSelectedContent({ format: 'html' }) || '';

  // 获取上下文
  const editorBody = editor.getBody();
  let contextBefore = '';
  let contextAfter = '';

  if (editorBody) {
    const fullText = editorBody.textContent || '';
    const selectionStart = fullText.indexOf(text);

    if (selectionStart >= 0) {
      // 获取前文（最多 100 字符）
      const beforeStart = Math.max(0, selectionStart - 100);
      contextBefore = fullText.slice(beforeStart, selectionStart);

      // 获取后文（最多 100 字符）
      const afterStart = selectionStart + text.length;
      contextAfter = fullText.slice(afterStart, afterStart + 100);
    }
  }

  return {
    text,
    html,
    contextBefore,
    contextAfter,
  };
}

/**
 * 替换选中文本
 *
 * 用于文本 AI 改写完成后替换选区内容
 * 替换后触发 change 事件标记文档为脏状态
 *
 * @param editor - EditorFacade 实例
 * @param content - 要替换的文本内容（纯文本或 HTML）
 * @param format - 内容格式，默认 'text'
 * @throws 如果替换失败则抛出错误
 */
export function replaceSelectedText(editor: EditorFacade, content: string, format: 'text' | 'html' = 'text'): void {
  if (!editor.isReady()) {
    throw new Error('Editor not available');
  }

  // 替换选中内容
  if (format === 'html') {
    editor.setSelectedContent(content);
  } else {
    // 纯文本需要转义 HTML
    const escapedContent = content
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br/>');
    editor.setSelectedContent(escapedContent);
  }

  // 标记文档为脏状态（通过触发 change 事件）
  editor.fire('change');
}

/**
 * 序列化 TinyMCE 书签对象
 *
 * 将复杂 DOM 对象转换为可安全存储的格式
 *
 * @param bookmark - TinyMCE 书签对象
 * @returns 序列化的书签
 */
function serializeBookmark(bookmark: unknown): SerializedBookmark | null {
  if (!bookmark) {
    return null;
  }

  try {
    // 将书签对象序列化为 JSON 字符串，再解析为纯对象
    // 这样可以去除所有 DOM 引用，避免 Imber 冲突
    const serialized = JSON.parse(JSON.stringify(bookmark));

    // 尝试检测书签类型
    let type: SerializedBookmark['type'] = 'stringpath';

    if (typeof serialized === 'object' && serialized !== null) {
      if ('rng' in serialized && 'start' in serialized && 'end' in serialized) {
        type = 'range';
      } else if ('id' in serialized) {
        type = 'id';
      } else if ('index' in serialized) {
        type = 'index';
      } else if ('path' in serialized) {
        type = 'path';
      }
    }

    return {
      type,
      data: serialized,
      isValid: true,
    };
  } catch (error) {
    console.warn('[serializeBookmark] Failed to serialize bookmark:', error);
    return {
      type: 'stringpath',
      data: null,
      isValid: false,
    };
  }
}

/**
 * 获取选区快照
 *
 * 保存当前选区状态，用于失败恢复
 * 快照包含：文本、HTML、上下文、书签（用于恢复位置）
 *
 * @param editor - EditorFacade 实例
 * @returns 选区快照，如果没有选区则返回 null
 */
export function getSelectionSnapshot(editor: EditorFacade): SelectionSnapshot | null {
  if (!editor.isReady()) {
    return null;
  }

  const content = getSelectedText(editor);
  if (!content) {
    return null;
  }

  // 创建书签（用于恢复选区位置）
  // 使用 EditorFacade 的 getSelectionBookmark 方法
  // 类型 2 表示使用 ID 书签，true 表示保留选区
  const rawBookmark = editor.getSelectionBookmark(2, true);
  const serializedBookmark = serializeBookmark(rawBookmark);

  return {
    ...content,
    timestamp: Date.now(),
    bookmark: serializedBookmark,
  };
}

/**
 * 验证快照是否有效
 *
 * @param snapshot - 选区快照
 * @param timeoutMs - 超时时间（毫秒），默认 60 秒
 * @returns 验证结果
 */
export function validateSnapshot(
  snapshot: SelectionSnapshot,
  timeoutMs: number = 60000
): { isValid: boolean; error?: string } {
  const now = Date.now();
  if (now - snapshot.timestamp > timeoutMs) {
    return { isValid: false, error: 'Snapshot expired' };
  }
  return { isValid: true };
}

/**
 * 反序列化书签对象
 *
 * 将序列化的书签恢复为 TinyMCE 可用的格式
 *
 * @param serializedBookmark - 序列化的书签
 * @returns TinyMCE 书签对象
 */
function deserializeBookmark(serializedBookmark: SerializedBookmark): unknown {
  if (!serializedBookmark || !serializedBookmark.isValid) {
    return null;
  }

  return serializedBookmark.data;
}

/**
 * 恢复选区
 *
 * 从快照恢复选区位置
 * 用于改写失败时恢复原始选区
 *
 * @param editor - EditorFacade 实例
 * @param snapshot - 选区快照
 * @throws 如果恢复失败则抛出错误
 */
export function restoreSelection(editor: EditorFacade, snapshot: SelectionSnapshot): void {
  if (!editor.isReady()) {
    throw new Error('Editor not available');
  }

  // 恢复选区位置
  if (snapshot.bookmark) {
    const bookmark = deserializeBookmark(snapshot.bookmark);
    if (bookmark) {
      // 使用类型断言，因为我们知道反序列化的数据应该是有效的书签格式
      editor.moveToBookmark(bookmark as any);
    }
  }
}

/**
 * 从元素中提取章节 ID
 *
 * @param element - 要检查的元素
 * @returns 章节 ID（持久化 ID 或临时 ID），如果未找到则返回 null
 */
function extractChapterId(element: Element): string | null {
  // 优先读取持久化 ID
  const chapterId = element.getAttribute(RP_DATA_ATTRIBUTES.CHAPTER_ID)?.trim();
  if (chapterId) {
    return chapterId;
  }

  console.error("chapter don't have a real id");

  // 如果没有持久化 ID，尝试读取临时 ID
  const tempId = element.getAttribute(RP_DATA_ATTRIBUTES.TEMP_CHAPTER_ID)?.trim();
  if (tempId) {
    return tempId;
  }

  return null;
}

/**
 * 向前查找最近的标题元素（兄弟节点）
 *
 * @param node - 起始节点
 * @returns 最近的标题元素，如果未找到则返回 null
 */
function findPreviousHeading(node: Node): Element | null {
  let current: Node | null = node;

  // 向前遍历兄弟节点
  while (current) {
    if (current.nodeType === Node.ELEMENT_NODE) {
      const element = current as Element;
      const tagName = element.tagName.toLowerCase();

      // 检查是否为标题元素（h1-h6）
      if (/^h[1-6]$/.test(tagName)) {
        return element;
      }
    }

    current = current.previousSibling;
  }

  return null;
}

/**
 * 获取选区所属的章节 ID
 *
 * 从当前选区节点查找所属章节的 ID，支持以下场景：
 * 1. 选区在标题元素内：向上查找父级标题
 * 2. 选区在内容节点内：向前查找兄弟标题（标题与内容是平级关系）
 * 3. 递归向上查找父级容器，重复上述逻辑
 *
 * 查找优先级：
 * - 优先返回持久化的 chapterId（data-chapter-id）
 * - 如果没有持久化 ID，返回临时 ID（data-temp-chapter-id）
 *
 * @param editor - EditorFacade 实例
 * @returns 章节 ID（持久化 ID 或临时 ID），如果未找到则返回空字符串
 *
 * @see apps/report-ai/src/domain/reportEditor/document/parse.ts - 参考章节解析逻辑
 * @see apps/report-ai/src/domain/reportEditor/foundation/chapterStructure.ts - 标题与内容是平级关系
 */
export function getSelectionChapterId(editor: EditorFacade): string {
  if (!editor.isReady()) {
    return '';
  }

  try {
    // 获取选区的锚定节点
    const selectionNode = editor.getSelectionNode();
    if (!selectionNode) {
      return '';
    }

    let currentNode: Node | null = selectionNode;

    // 向上遍历 DOM 树
    while (currentNode && currentNode !== document.body) {
      // 场景 1：当前节点是元素节点，检查是否为标题或包含章节 ID
      if (currentNode.nodeType === Node.ELEMENT_NODE) {
        const element = currentNode as Element;

        // 检查当前元素是否有章节 ID
        const chapterId = extractChapterId(element);
        if (chapterId) {
          return chapterId;
        }
      }

      // 场景 2：向前查找兄弟节点中的标题元素
      // 因为标题与内容是平级关系，选区可能在内容节点中
      const heading = findPreviousHeading(currentNode);
      if (heading) {
        const chapterId = extractChapterId(heading);
        if (chapterId) {
          return chapterId;
        }
      }

      // 向上移动到父节点
      currentNode = currentNode.parentNode;
    }

    return '';
  } catch (err) {
    console.warn('[getSelectionChapterId] Failed to get chapter ID:', err);
    return '';
  }
}
