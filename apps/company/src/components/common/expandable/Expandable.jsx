import React from 'react'
import TextExpandable from './textExpandable/TextExpandable'
import './expandable.less'

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
const Expandable = ({ content, maxLines, type, marginBottom }) => {
  const Text = <TextExpandable content={content} maxLines={maxLines} marginBottom={marginBottom} />
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
