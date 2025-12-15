import { useCallback, useMemo } from 'react';

/**
 * 标签筛选 Hook
 *
 * @description 处理带"全部"选项的标签筛选逻辑
 *
 * 业务规则：
 * - 空数组 [] 表示"全部"（不筛选）
 * - 有值的数组表示按标签筛选
 *
 * 所有可能的操作场景：
 * 1. 初始状态（全部）-> 点击"全部" -> 保持全部（无变化）
 * 2. 初始状态（全部）-> 点击"财务报告" -> 选中"财务报告"，取消"全部"
 * 3. 已选"财务报告" -> 点击"全部" -> 清空所有，回到全部状态
 * 4. 已选"财务报告" -> 点击"法律合规" -> 同时选中"财务报告"和"法律合规"
 * 5. 已选"财务报告"和"法律合规" -> 点击"财务报告" -> 只保留"法律合规"
 * 6. 已选"财务报告" -> 再次点击"财务报告" -> 回到全部状态（取消所有选择）
 *
 * @param tags 当前选中的标签数组
 * @param onChange 标签变化回调
 * @returns 显示值和变化处理函数
 */
export const useTagFilter = (tags: string[] | undefined, onChange: (tags: string[]) => void) => {
  // 获取显示值：空数组或 undefined 时显示"全部"
  const displayValue = useMemo(() => {
    return !tags || tags.length === 0 ? ['all'] : tags;
  }, [tags]);

  // 处理标签变化
  const handleChange = useCallback(
    (checkedValues: string[]) => {
      const hasAll = checkedValues.includes('all');
      const currentTags = tags || [];
      const currentIsAll = currentTags.length === 0;
      const otherTags = checkedValues.filter((v) => v !== 'all');

      // 场景 1: 当前是"全部"，点击"全部" -> 保持全部
      if (currentIsAll && hasAll && otherTags.length === 0) {
        return;
      }

      // 场景 2: 当前是"全部"，点击其他标签 -> 选中该标签
      if (currentIsAll && otherTags.length > 0) {
        onChange(otherTags);
        return;
      }

      // 场景 3: 当前有标签，点击"全部" -> 清空回到全部
      if (!currentIsAll && hasAll) {
        onChange([]);
        return;
      }

      // 场景 4/5/6: 当前有标签，点击其他标签 -> 更新标签列表
      // 如果取消了所有标签，回到全部状态
      onChange(otherTags);
    },
    [tags, onChange]
  );

  return {
    displayValue,
    handleChange,
  };
};
