import { getPrefixUrl, handleAppendUrlPath } from '../../handle'

export const MiscDetailTypeMap = {
  RECRUIT: 'jobDetail',
}

export const getMiscDetailBySubModule = ({ subModule, id, params, env }) => {
  const baseUrl = new URL(
    getPrefixUrl({
      envParam: env,
    })
  )
  baseUrl.pathname = handleAppendUrlPath(baseUrl.pathname)
  switch (subModule) {
    case MiscDetailTypeMap.RECRUIT:
      if (!id) {
        return null
      }
      baseUrl.hash = MiscDetailTypeMap.RECRUIT
      baseUrl.search = new URLSearchParams({
        detailId: id,
        type: 'jobs',
        ...params,
      }).toString()
      break
  }

  return baseUrl.toString()
}
