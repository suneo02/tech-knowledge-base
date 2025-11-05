import { generateCommonLink, GELSearchParam, LinksModule, TLinkOptions } from '@/handle/link'

export const getPatentDetailByUrl = ({ id, params = {}, type, env }: Pick<TLinkOptions, 'id' | 'params' | 'type' | 'env'>) => {
  if (!id) {
    return null
  }

  return generateCommonLink({
    module: LinksModule.PATENT,
    params: {
      [GELSearchParam.NoSearch]: '1',
      detailId: id,
      ...(type ? { type } : {}),
      ...params,
    },
    env,
  })
}

/** 专利类型 */
export const PatentTypeEnum = {
  FMSQ: '发明申请', // 发明申请
  SQFM: '授权发明', // 授权发明
  WGSJ: '外观设计', // 外观设计
  SYXX: '实用新型', // 实用新型
}
