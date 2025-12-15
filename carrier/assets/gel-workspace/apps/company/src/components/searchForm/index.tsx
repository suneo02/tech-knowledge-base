import React from 'react'
import MultiSearch from './MultiSearch'
import SingleSearch from './SingleSearch'

import { SearchFormBaseProps, SearchFormProps } from '@/components/searchForm/type.ts'
import classNames from 'classnames'
import './index.less'

/**
 * @depre
 * @param param0
 * @returns
 */
function SearchForm({ wrapperClassName, ...props }: SearchFormProps) {
  if (props.type === 'multi') {
    return <SearchFormMulti {...props} />
  }
  return <SearchFormSingle {...props} />
}

export function SearchFormSingle({ wrapperClassName, ...props }: SearchFormBaseProps) {
  return (
    <div className={classNames('search-form-new', wrapperClassName)}>
      <SingleSearch {...props} />
    </div>
  )
}

export function SearchFormMulti({ wrapperClassName, ...props }: SearchFormBaseProps) {
  return (
    <div className={classNames('search-form-new', wrapperClassName)}>
      <MultiSearch {...props} />
    </div>
  )
}

export default SearchForm
