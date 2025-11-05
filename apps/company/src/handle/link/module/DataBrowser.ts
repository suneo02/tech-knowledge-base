import { generateCommonLink } from '../handle'
import { LinksModule } from './linksModule'

export const getDataBrowserLink = ({ value, title, type, params = {}, env }) => {
  return generateCommonLink({
    module: LinksModule.DATA_BROWSER,
    params: {
      ...(value || title ? { val: value || title } : {}),
      ...(type ? { type } : {}),
      ...params,
    },
    env,
  })
}
