import React from 'react'
import MultiSelect from './MultiSelect'
import SingleSelect from './SingleSelect'
import { WSelectProps } from './type'

export type WSelectAbstractProps = WSelectProps & { mode?: 'multiple' | 'single' }

const WSelect: React.FC<WSelectAbstractProps> = (props) => {
  const { mode = 'single', ...otherProps } = props

  if (mode === 'multiple') {
    return <MultiSelect {...otherProps} />
  } else {
    return <SingleSelect {...otherProps} />
  }
}

export default WSelect
