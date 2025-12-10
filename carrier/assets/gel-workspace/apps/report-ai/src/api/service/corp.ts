/**
 * 使用模板的 Hook
 * 管理模板使用弹窗的状态和业务逻辑
 * @see apps/report-ai/docs/specs/template-use-with-corp-selection/spec-design-v1.md
 */

import { wfcCorpPreSearchPayload } from 'gel-api';
import { createWFCRequest } from '../helper';

/**
 * 企业预搜索API方法
 */
export const searchCompanies = async ({ queryText }: wfcCorpPreSearchPayload) => {
  const request = createWFCRequest('search/company/getGlobalCompanyPreSearch');
  const res = await request({ queryText });
  return res || { Data: { search: [], searchkey: queryText } };
};
