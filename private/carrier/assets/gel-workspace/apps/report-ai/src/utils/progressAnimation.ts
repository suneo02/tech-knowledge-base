/**
 * 进度动画工具函数
 * 提供流畅的进度条动画功能
 */

/**
 * 缓动函数：easeOutQuart
 * 快速开始，然后逐渐减速，符合用户对加载过程的心理预期
 */
export const easeOutQuart = (t: number): number => {
  return 1 - Math.pow(1 - t, 4);
};

/**
 * 其他可选的缓动函数
 */
export const easingFunctions = {
  linear: (t: number) => t,
  easeOutQuad: (t: number) => 1 - (1 - t) * (1 - t),
  easeOutCubic: (t: number) => 1 - Math.pow(1 - t, 3),
  easeOutQuart: (t: number) => 1 - Math.pow(1 - t, 4),
  easeOutQuint: (t: number) => 1 - Math.pow(1 - t, 5),
} as const;

/**
 * 进度动画配置
 */
export interface ProgressAnimationConfig {
  /** 动画总时长（毫秒） */
  duration?: number;
  /** 最大进度值 */
  maxProgress?: number;
  /** 平滑因子 (0-1)，控制进度过渡的平滑程度 */
  smoothingFactor?: number;
  /** 进度精度（小数位数） */
  precision?: number;
  /** 缓动函数 */
  easingFunction?: (t: number) => number;
}

/**
 * 默认配置
 */
export const DEFAULT_PROGRESS_CONFIG: Required<ProgressAnimationConfig> = {
  duration: 2200,
  maxProgress: 95, // 提高到 95%，为真实上传完成留出空间
  smoothingFactor: 0.15,
  precision: 1,
  easingFunction: easeOutQuart,
};

/**
 * 进度动画控制器
 */
export class ProgressAnimationController {
  private animationId: number | null = null;
  private currentProgress = 0;
  private startTime = 0;
  private config: Required<ProgressAnimationConfig>;

  constructor(
    private onProgress: (progress: number) => void,
    private onComplete?: () => void,
    config: ProgressAnimationConfig = {}
  ) {
    this.config = { ...DEFAULT_PROGRESS_CONFIG, ...config };
  }

  /**
   * 开始动画
   */
  start(initialProgress?: number): void {
    this.stop(); // 清理之前的动画
    this.currentProgress = initialProgress ?? 0;
    this.startTime = Date.now();
    this.animate();
  }

  /**
   * 停止动画
   */
  stop(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  /**
   * 完成动画（跳转到最终状态）
   */
  complete(): void {
    this.stop();
    this.onProgress(this.config.maxProgress);
    this.onComplete?.();
  }

  /**
   * 获取当前进度
   */
  getCurrentProgress(): number {
    return this.currentProgress;
  }

  /**
   * 更新配置
   */
  updateConfig(config: Partial<ProgressAnimationConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * 动画循环
   */
  private animate = (): void => {
    const elapsed = Date.now() - this.startTime;
    const timeProgress = Math.min(elapsed / this.config.duration, 1);

    // 使用缓动函数计算目标进度
    const easedProgress = this.config.easingFunction(timeProgress);
    const targetProgress = easedProgress * this.config.maxProgress;

    // 平滑插值到目标进度
    const diff = targetProgress - this.currentProgress;
    this.currentProgress += diff * this.config.smoothingFactor;

    // 确保进度值的精度和范围
    const displayProgress = Math.min(
      Math.round(this.currentProgress * Math.pow(10, this.config.precision)) / Math.pow(10, this.config.precision),
      this.config.maxProgress
    );

    this.onProgress(displayProgress);

    if (timeProgress < 1) {
      // 继续动画
      this.animationId = requestAnimationFrame(this.animate);
    } else {
      // 动画完成
      this.animationId = null;
      this.onProgress(this.config.maxProgress);
      this.onComplete?.();
    }
  };
}

/**
 * 创建进度动画控制器的工厂函数
 */
export const createProgressAnimation = (
  onProgress: (progress: number) => void,
  onComplete?: () => void,
  config?: ProgressAnimationConfig
): ProgressAnimationController => {
  return new ProgressAnimationController(onProgress, onComplete, config);
};

/**
 * 简化的进度动画函数（用于简单场景）
 */
export const animateProgress = (
  onProgress: (progress: number) => void,
  config: ProgressAnimationConfig = {}
): Promise<void> => {
  return new Promise((resolve) => {
    const controller = createProgressAnimation(onProgress, () => resolve(), config);
    controller.start();
  });
};

/**
 * 计算指定时间点的进度值（用于测试或预览）
 */
export const calculateProgressAtTime = (elapsed: number, config: ProgressAnimationConfig = {}): number => {
  const finalConfig = { ...DEFAULT_PROGRESS_CONFIG, ...config };
  const timeProgress = Math.min(elapsed / finalConfig.duration, 1);
  const easedProgress = finalConfig.easingFunction(timeProgress);
  return easedProgress * finalConfig.maxProgress;
};

/**
 * 预设配置
 */
export const PROGRESS_PRESETS = {
  /** 快速上传（1.5秒） */
  fast: {
    duration: 1500,
    easingFunction: easingFunctions.easeOutCubic,
  },
  /** 正常上传（2.2秒） */
  normal: {
    duration: 2200,
    easingFunction: easingFunctions.easeOutQuart,
  },
  /** 慢速上传（3秒） */
  slow: {
    duration: 3000,
    easingFunction: easingFunctions.easeOutQuint,
  },
  /** 线性进度（测试用） */
  linear: {
    duration: 2000,
    easingFunction: easingFunctions.linear,
    smoothingFactor: 1, // 无平滑
  },
} as const;
