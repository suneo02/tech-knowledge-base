/**
 * Redux Hooks
 *
 * 提供类型安全的 Redux hooks
 */

import { useDispatch, useSelector } from 'react-redux';
import type { ReportContentState } from './types';

// 类型安全的 dispatch hook
export const useReportContentDispatch = () => useDispatch();

// 类型安全的 selector hook
export const useReportContentSelector = <T>(selector: (state: { reportContent: ReportContentState }) => T): T => {
  return useSelector(selector);
};
