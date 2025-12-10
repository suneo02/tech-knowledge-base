import React, { FC } from 'react'
import './expandable.less'
import TextExpandable from './textExpandable/TextExpandable'

// for ts
// export enum ExpandType {
//   ICON = 'icon',
//   TEXT = 'text',
// }

// export interface ExpandableProps {
//   maxLines: number
//   content: string
//   type?: ExpandType
// }

// for ts
// const Expandable: React.FC<ExpandableProps> = ({ content, maxLines, type }) => {
/**
 *
 * @param param
 * @returns
 */
const Expandable: FC<{
  content: string
  maxLines: number
  type?: 'text' | 'icon'
}> = ({ content, maxLines, type }) => {
  const Text = (
    <TextExpandable content={content} maxLines={maxLines} data-uc-id="AX5nPIt2lJ" data-uc-ct="textexpandable" />
  )
  const renderExpand = () => {
    switch (type) {
      case 'text': //ExpandType.TEXT
        return Text
      case 'icon': //ExpandType.ICON
        return null
      default:
        return Text
    }
  }

  return renderExpand()
}

export default Expandable
