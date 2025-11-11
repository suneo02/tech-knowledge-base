// 主要的六个参数

import { functionCodesMap, OptionsForCode, postPointBuriedWithAxios } from 'gel-api';
import { entWebAxiosInstance } from '../entWeb';

// 功能点埋点，集中发送请求
// 超过20条直接抛弃
export const postPointBuried = <T extends keyof typeof functionCodesMap>(
  code: T,
  options: OptionsForCode<T> = {} as OptionsForCode<T>
) => {
  return postPointBuriedWithAxios(entWebAxiosInstance, code, options);
};
