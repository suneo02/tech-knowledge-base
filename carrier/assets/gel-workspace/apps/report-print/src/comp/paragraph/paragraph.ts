import styles from './paragraph.module.less'

export const createParagraph = (content: string) => {
  return $('<p>').addClass(styles['paragraph']).html(content)
}
