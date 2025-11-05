import styles from './tableComment.module.less'

export const createTableComment = (content: string) => {
  return $('<div>').addClass(styles['table-comment']).text(content)
}
