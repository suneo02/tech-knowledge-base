import { generateCommonLink, LinksModule, TLinkOptions } from '@/handle/link'

export const getBidDetailUrl = ({ id, params = {}, env }: { id: string } & Pick<TLinkOptions, 'params' | 'env'>) => {
  if (!id) {
    return null
  }

  return generateCommonLink({
    module: LinksModule.BID,
    params: {
      detailid: id,
      type: 'bid',
      ...params,
    },
    env,
  })
}
