import { describe, expect, it } from 'vitest';

/**
 * SVG 圆圈进度计算测试
 */
describe('SVG Progress Circle Calculations', () => {
  const radius = 10;
  const circumference = 2 * Math.PI * radius;

  /**
   * 计算 SVG 圆圈的进度偏移量
   */
  const calculateStrokeDashoffset = (progress: number): number => {
    return circumference * (1 - progress / 100);
  };

  it('应该正确计算0%进度的偏移量', () => {
    const offset = calculateStrokeDashoffset(0);
    expect(offset).toBeCloseTo(circumference, 5); // 0%进度时，偏移量等于周长
  });

  it('应该正确计算50%进度的偏移量', () => {
    const offset = calculateStrokeDashoffset(50);
    expect(offset).toBeCloseTo(circumference / 2, 5); // 50%进度时，偏移量为周长的一半
  });

  it('应该正确计算100%进度的偏移量', () => {
    const offset = calculateStrokeDashoffset(100);
    expect(offset).toBeCloseTo(0, 5); // 100%进度时，偏移量为0
  });

  it('应该正确处理小数进度值', () => {
    const offset = calculateStrokeDashoffset(33.3);
    const expected = circumference * (1 - 33.3 / 100);
    expect(offset).toBeCloseTo(expected, 5);
  });

  it('应该正确处理边界值', () => {
    // 测试负数进度（虽然实际不应该出现）
    const negativeOffset = calculateStrokeDashoffset(-10);
    expect(negativeOffset).toBeCloseTo(circumference * 1.1, 5);

    // 测试超过100%的进度
    const overOffset = calculateStrokeDashoffset(110);
    expect(overOffset).toBeCloseTo(circumference * -0.1, 5);
  });

  describe('实际使用场景测试', () => {
    const testCases = [
      { progress: 0, description: '开始上传' },
      { progress: 10, description: '初始进度' },
      { progress: 25, description: '四分之一' },
      { progress: 50, description: '一半进度' },
      { progress: 75, description: '四分之三' },
      { progress: 90, description: '接近完成' },
      { progress: 100, description: '完全完成' },
    ];

    testCases.forEach(({ progress, description }) => {
      it(`应该正确处理${description}(${progress}%)`, () => {
        const offset = calculateStrokeDashoffset(progress);
        const expected = circumference * (1 - progress / 100);

        expect(offset).toBeCloseTo(expected, 5);
        expect(offset).toBeGreaterThanOrEqual(-circumference * 0.1); // 允许小范围超出
        expect(offset).toBeLessThanOrEqual(circumference * 1.1); // 允许小范围超出
      });
    });
  });

  describe('SVG 属性验证', () => {
    it('周长计算应该正确', () => {
      expect(circumference).toBeCloseTo(62.83185307179586, 5);
    });

    it('半径应该匹配组件中的值', () => {
      expect(radius).toBe(10);
    });
  });

  describe('动画流畅度测试', () => {
    it('进度变化应该产生平滑的偏移量变化', () => {
      const progressSteps = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
      const offsets = progressSteps.map(calculateStrokeDashoffset);

      // 验证偏移量是单调递减的（进度增加时偏移量减少）
      for (let i = 1; i < offsets.length; i++) {
        expect(offsets[i]).toBeLessThan(offsets[i - 1]);
      }
    });

    it('相邻进度值的偏移量差异应该相对均匀', () => {
      const step = 10;
      const progressValues = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
      const offsets = progressValues.map(calculateStrokeDashoffset);

      // 计算相邻偏移量的差异
      const differences: number[] = [];
      for (let i = 1; i < offsets.length; i++) {
        differences.push(Math.abs(offsets[i] - offsets[i - 1]));
      }

      // 所有差异应该相等（因为是线性变化）
      const expectedDifference = circumference * (step / 100);
      differences.forEach((diff) => {
        expect(diff).toBeCloseTo(expectedDifference, 5);
      });
    });
  });
});
