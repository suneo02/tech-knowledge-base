import { RPOutlineProgressState, RPOutlineProgressStep, RPOutlineStepInfo, RPOutlineStepStatus } from '@/types';

/**
 * 创建初始进度状态
 *
 * @description 创建包含所有步骤初始状态的进度对象
 * @returns 初始进度状态
 */
export const createInitialProgressState = (): RPOutlineProgressState => {
  const steps = Object.values(RPOutlineProgressStep).reduce(
    (acc, step) => {
      acc[step] = {
        step,
        status: RPOutlineStepStatus.NOT_STARTED,
      };
      return acc;
    },
    {} as Record<RPOutlineProgressStep, RPOutlineStepInfo>
  );

  return {
    steps,
    currentStep: undefined,
    overallProgress: 0,
    isCompleted: false,
    hasFailed: false,
  };
};

/**
 * 计算整体进度百分比
 *
 * @description 根据各步骤状态计算整体进度
 * @param steps 各步骤状态
 * @returns 整体进度百分比 (0-100)
 */
export const calculateOverallProgress = (steps: Record<RPOutlineProgressStep, RPOutlineStepInfo>): number => {
  const stepValues = Object.values(steps);
  const totalSteps = stepValues.length;

  if (totalSteps === 0) return 0;

  const completedSteps = stepValues.filter((step) => step.status === RPOutlineStepStatus.COMPLETED).length;

  const inProgressSteps = stepValues.filter((step) => step.status === RPOutlineStepStatus.IN_PROGRESS);

  let progressSum = completedSteps * 100;

  // 加上进行中步骤的进度
  inProgressSteps.forEach((step) => {
    progressSum += step.progress || 0;
  });

  return Math.round(progressSum / totalSteps);
};

/**
 * 步骤显示名称映射
 *
 * @description 用于UI显示的步骤名称
 */
export const RPOutlineStepDisplayNames: Record<RPOutlineProgressStep, string> = {
  [RPOutlineProgressStep.ANALYZE_PROBLEM]: '分析问题',
  [RPOutlineProgressStep.FILE_PARSING]: '文件解析',
  [RPOutlineProgressStep.DEEP_THINKING]: '深度思考',
  [RPOutlineProgressStep.GENERATE_OUTLINE]: '生成大纲',
};

/**
 * 状态显示名称映射
 *
 * @description 用于UI显示的状态名称
 */
export const RPOutlineStepStatusDisplayNames: Record<RPOutlineStepStatus, string> = {
  [RPOutlineStepStatus.NOT_STARTED]: '未开始',
  [RPOutlineStepStatus.IN_PROGRESS]: '进行中',
  [RPOutlineStepStatus.COMPLETED]: '已完成',
  [RPOutlineStepStatus.FAILED]: '失败',
};
