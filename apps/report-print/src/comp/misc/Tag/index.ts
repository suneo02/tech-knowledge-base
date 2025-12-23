import { TagColors, TagSizes, TagTypes } from 'report-util/misc'
import styles from './index.module.less'

export interface TagProps {
  text: string
  color?: TagColors
  size?: TagSizes
  type?: TagTypes
  className?: string
  onClick?: (event) => void
}

/**
 * Tag function component
 * @param props Component properties
 * @returns JQuery element
 */
export function createTag(props: TagProps): JQuery {
  // Default props
  const { text, color, size = 'default', type = 'primary', className, onClick } = props

  // Create tag element
  const $element = $('<span>')
    .addClass(styles.tag)
    .addClass(styles[`tag-${size}`])
    .addClass(styles[`tag-${type}`])
    .text(text)

  // Add color class if specified
  if (color) {
    $element.addClass(styles[color])
  }

  // Add custom class if provided
  if (className) {
    $element.addClass(className)
  }

  // Add click handler
  if (onClick) {
    $element.on('click', onClick)
  }

  // Return the element directly
  return $element
}
