import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  animateProgress,
  calculateProgressAtTime,
  createProgressAnimation,
  DEFAULT_PROGRESS_CONFIG,
  easeOutQuart,
  easingFunctions,
  PROGRESS_PRESETS,
  ProgressAnimationController,
} from '../progressAnimation';

// Mock requestAnimationFrame and cancelAnimationFrame
const mockRequestAnimationFrame = vi.fn();
const mockCancelAnimationFrame = vi.fn();

Object.defineProperty(window, 'requestAnimationFrame', {
  value: mockRequestAnimationFrame,
  writable: true,
});

Object.defineProperty(window, 'cancelAnimationFrame', {
  value: mockCancelAnimationFrame,
  writable: true,
});

describe('progressAnimation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('缓动函数', () => {
    it('easeOutQuart 应该正确计算缓动值', () => {
      expect(easeOutQuart(0)).toBe(0);
      expect(easeOutQuart(1)).toBe(1);
      expect(easeOutQuart(0.5)).toBeCloseTo(0.9375, 4);
    });

    it('easingFunctions 应该包含所有预期的函数', () => {
      expect(typeof easingFunctions.linear).toBe('function');
      expect(typeof easingFunctions.easeOutQuad).toBe('function');
      expect(typeof easingFunctions.easeOutCubic).toBe('function');
      expect(typeof easingFunctions.easeOutQuart).toBe('function');
      expect(typeof easingFunctions.easeOutQuint).toBe('function');
    });

    it('linear 缓动应该返回线性值', () => {
      expect(easingFunctions.linear(0)).toBe(0);
      expect(easingFunctions.linear(0.5)).toBe(0.5);
      expect(easingFunctions.linear(1)).toBe(1);
    });
  });

  describe('ProgressAnimationController', () => {
    let onProgress: ReturnType<typeof vi.fn>;
    let onComplete: ReturnType<typeof vi.fn>;
    let controller: ProgressAnimationController;

    beforeEach(() => {
      onProgress = vi.fn();
      onComplete = vi.fn();
      controller = new ProgressAnimationController(onProgress, onComplete);
    });

    it('应该正确初始化', () => {
      expect(controller.getCurrentProgress()).toBe(0);
    });

    it('start() 应该开始动画', () => {
      mockRequestAnimationFrame.mockImplementation((callback) => {
        setTimeout(callback, 16);
        return 1;
      });

      controller.start();
      expect(controller.getCurrentProgress()).toBe(0);
      expect(mockRequestAnimationFrame).toHaveBeenCalled();
    });

    it('stop() 应该停止动画', () => {
      mockRequestAnimationFrame.mockReturnValue(123);
      controller.start();
      controller.stop();
      expect(mockCancelAnimationFrame).toHaveBeenCalledWith(123);
    });

    it('complete() 应该跳转到最终状态', () => {
      controller.complete();
      expect(onProgress).toHaveBeenCalledWith(DEFAULT_PROGRESS_CONFIG.maxProgress);
      expect(onComplete).toHaveBeenCalled();
    });

    it('应该支持自定义配置', () => {
      const customController = new ProgressAnimationController(onProgress, onComplete, {
        maxProgress: 100,
        duration: 1000,
      });
      customController.complete();
      expect(onProgress).toHaveBeenCalledWith(100);
    });

    it('updateConfig() 应该更新配置', () => {
      controller.updateConfig({ maxProgress: 100 });
      controller.complete();
      expect(onProgress).toHaveBeenCalledWith(100);
    });
  });

  describe('工厂函数', () => {
    it('createProgressAnimation 应该创建控制器实例', () => {
      const onProgress = vi.fn();
      const controller = createProgressAnimation(onProgress);
      expect(controller).toBeInstanceOf(ProgressAnimationController);
    });

    it('animateProgress 应该返回 Promise', async () => {
      const onProgress = vi.fn();
      mockRequestAnimationFrame.mockImplementation((callback) => {
        // 模拟动画完成
        setTimeout(() => {
          callback();
        }, 0);
        return 1;
      });

      const promise = animateProgress(onProgress, { duration: 100 });
      expect(promise).toBeInstanceOf(Promise);

      // 模拟时间流逝
      vi.advanceTimersByTime(100);
      await promise;
    });
  });

  describe('计算函数', () => {
    it('calculateProgressAtTime 应该正确计算指定时间的进度', () => {
      const progress = calculateProgressAtTime(1100, { duration: 2200, maxProgress: 90 });
      expect(progress).toBeCloseTo(45, 0); // 大约一半时间，应该接近一半进度
    });

    it('calculateProgressAtTime 应该在时间超出时返回最大进度', () => {
      const progress = calculateProgressAtTime(3000, { duration: 2200, maxProgress: 90 });
      expect(progress).toBe(90);
    });

    it('calculateProgressAtTime 应该在时间为0时返回0', () => {
      const progress = calculateProgressAtTime(0, { duration: 2200, maxProgress: 90 });
      expect(progress).toBe(0);
    });
  });

  describe('预设配置', () => {
    it('PROGRESS_PRESETS 应该包含所有预设', () => {
      expect(PROGRESS_PRESETS.fast).toBeDefined();
      expect(PROGRESS_PRESETS.normal).toBeDefined();
      expect(PROGRESS_PRESETS.slow).toBeDefined();
      expect(PROGRESS_PRESETS.linear).toBeDefined();
    });

    it('各预设应该有不同的持续时间', () => {
      expect(PROGRESS_PRESETS.fast.duration).toBeLessThan(PROGRESS_PRESETS.normal.duration!);
      expect(PROGRESS_PRESETS.normal.duration).toBeLessThan(PROGRESS_PRESETS.slow.duration!);
    });

    it('linear 预设应该使用线性缓动', () => {
      expect(PROGRESS_PRESETS.linear.easingFunction).toBe(easingFunctions.linear);
      expect(PROGRESS_PRESETS.linear.smoothingFactor).toBe(1);
    });
  });

  describe('默认配置', () => {
    it('DEFAULT_PROGRESS_CONFIG 应该有合理的默认值', () => {
      expect(DEFAULT_PROGRESS_CONFIG.duration).toBe(2200);
      expect(DEFAULT_PROGRESS_CONFIG.maxProgress).toBe(90);
      expect(DEFAULT_PROGRESS_CONFIG.smoothingFactor).toBe(0.15);
      expect(DEFAULT_PROGRESS_CONFIG.precision).toBe(1);
      expect(DEFAULT_PROGRESS_CONFIG.easingFunction).toBe(easeOutQuart);
    });
  });

  describe('边界情况', () => {
    it('应该处理极小的 smoothingFactor', () => {
      const controller = new ProgressAnimationController(vi.fn(), undefined, { smoothingFactor: 0.001 });
      expect(controller.getCurrentProgress()).toBe(0);
    });

    it('应该处理极大的 smoothingFactor', () => {
      const controller = new ProgressAnimationController(vi.fn(), undefined, { smoothingFactor: 1 });
      expect(controller.getCurrentProgress()).toBe(0);
    });

    it('应该处理 0 持续时间', () => {
      const progress = calculateProgressAtTime(0, { duration: 0, maxProgress: 90 });
      expect(progress).toBe(90); // 0持续时间应该立即完成
    });

    it('应该处理负数时间', () => {
      const progress = calculateProgressAtTime(-100, { duration: 2200, maxProgress: 90 });
      expect(progress).toBe(0);
    });
  });
});
