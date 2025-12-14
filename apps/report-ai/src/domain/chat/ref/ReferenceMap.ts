import { generateChatRefKey, getReferenceUniqueKey } from './referenceUtils';
import { RPReferenceItem, RPReferenceType } from './type';

/**
 * 类型安全的引用资料映射表
 *
 * @description
 * 封装引用资料的查找逻辑，确保外部调用时必须同时提供 type 和 id，
 * 避免因 ID 在不同类型间不唯一而导致的查找错误
 *
 * @example
 * ```ts
 * const refMap = new ReferenceMap(references);
 *
 * // ✅ 类型安全的查找
 * const ref = refMap.get('dpu', 'table-123');
 *
 * // ✅ 检查是否存在
 * if (refMap.has('rag', 'suggest-456')) {
 *   // ...
 * }
 * ```
 */
export class ReferenceMap {
  private map: Map<string, RPReferenceItem>;

  constructor(references: RPReferenceItem[] = []) {
    this.map = new Map();
    for (const ref of references) {
      this.set(ref);
    }
  }

  /**
   * 根据类型和 ID 获取引用资料
   * @param type 引用类型
   * @param id 引用 ID
   * @returns 引用资料项，如果不存在则返回 undefined
   */
  get(type: RPReferenceType, id: string): RPReferenceItem | undefined {
    const key = generateChatRefKey(type, id);
    return this.map.get(key);
  }

  /**
   * 检查指定类型和 ID 的引用资料是否存在
   * @param type 引用类型
   * @param id 引用 ID
   * @returns 是否存在
   */
  has(type: RPReferenceType, id: string): boolean {
    const key = generateChatRefKey(type, id);
    return this.map.has(key);
  }

  /**
   * 添加引用资料到映射表
   * @param reference 引用资料项
   */
  private set(reference: RPReferenceItem): void {
    const key = getReferenceUniqueKey(reference);
    this.map.set(key, reference);
  }

  /**
   * 获取所有引用资料
   * @returns 引用资料数组
   */
  getAll(): RPReferenceItem[] {
    return Array.from(this.map.values());
  }

  /**
   * 获取映射表大小
   * @returns 引用资料数量
   */
  get size(): number {
    return this.map.size;
  }

  /**
   * 清空映射表
   */
  clear(): void {
    this.map.clear();
  }
}
