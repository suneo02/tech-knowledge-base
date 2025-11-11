import { EIsSeparate } from 'gel-util/link'
import { generateCommonLink } from '../handle'
import { LinksModule } from './linksModule'

export const getCompanyLink = ({ id, target, params, env }) => {
  if (!id) {
    return null
  }
  if (window.is_terminal) {
    return `!CommandParam[8514,CompanyCode=${id},SubjectID=4778,grid=${target}]`
  }

  return generateCommonLink({
    module: LinksModule.COMPANY,
    params: {
      ...params,
      ...(target != null && { grid: target }),
      CompanyCode: id,
      isSeparate: EIsSeparate.True,
    },
    env,
  })
}

export const getCompanyNewLink = ({ id, target, params, env }) => {
  if (!id) {
    return null
  }
  if (window.is_terminal) {
    return `!CommandParam[8514,CompanyCode=${id},SubjectID=4778,grid=${target}]`
  }

  return generateCommonLink({
    module: LinksModule.CompanyNew,
    params: {
      ...params,
      ...(target != null && { grid: target }),
      CompanyCode: id,
    },
    env,
  })
}
