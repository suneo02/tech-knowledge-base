import { getInfoFromCompanyTag } from '../../components/company/intro/tag/handle'

/**
 *
 * @param searchList {SearchResObj[]}
 */
export const handleCompanySearchListData = (searchList) => {
  try {
    return searchList.map((searchObj) => ({
      ...searchObj,
      corporation_tags3: searchObj.corporation_tags3.map(getInfoFromCompanyTag),
    }))
  } catch (e) {
    console.error(e)
    return null
  }
}
