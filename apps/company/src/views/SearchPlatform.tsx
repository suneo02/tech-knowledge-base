import React, { useEffect, useState } from 'react'
import { GlobalSearchPlatform } from './GlobalSearchPlatform'
import SearchBrand from './SearchBrand'
import SearchFetured from './SearchFetured'
import SearchGroupDepartment from './SearchGroupDepartment'
import SearchPatent from './SearchPatent'

function SearchPlatform(props) {
  const { id } = props.match.params
  const [LoadComponent, setLoadComponent] = useState(null) // card展示数据

  useEffect(() => {
    let LoadComponent = () => {
      let idstr = ''
      if (id && id.toLowerCase) {
        idstr = id.toLowerCase()
      } else {
        idstr = props.routePathId?.toLowerCase() || ''
      }
      switch (idstr) {
        case 'searchbrand':
          return SearchBrand
        case 'globalsearch':
          return GlobalSearchPlatform
        case 'searchgroupdepartment':
          return SearchGroupDepartment
        case 'searchfetured':
          return SearchFetured
        case 'searchpatent':
        default:
          return SearchPatent
      }
    }
    setLoadComponent(LoadComponent)
  }, [])

  return <React.Fragment>{LoadComponent && <LoadComponent />}</React.Fragment>
}

export default SearchPlatform
