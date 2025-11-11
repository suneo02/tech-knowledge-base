/**
 * PDF 查看器工具函数模块
 * 提供缩放相关的配置和工具函数
 */

/**
 * 缩放比例模型
 * 定义 PDF 查看器的缩放选项
 */
export interface ScaleModel {
  /** 缩放比例数值（1 表示 100%） */
  value: number;
  /** 缩放比例显示名称 */
  name: string;
}

/**
 * 预定义的缩放比例选项列表
 * 从 25% 到 200%，共 8 个档位
 */
export const ScaleItems: ScaleModel[] = [
  {
    value: 0.25,
    name: '25%',
  },
  {
    value: 0.5,
    name: '50%',
  },
  {
    value: 0.75,
    name: '75%',
  },
  {
    value: 1,
    name: '100%',
  },
  {
    value: 1.25,
    name: '125%',
  },
  {
    value: 1.5,
    name: '150%',
  },
  {
    value: 1.75,
    name: '175%',
  },
  {
    value: 2,
    name: '200%',
  },
];

// 注意：PDF 加载相关的函数已移至 pdfLoader.ts
// 请使用：import { fetchPdfAndCreateLocalUrl } from './pdfLoader';
