import { Markdown } from '@/md'
import { AIMsgBaseContent } from '@/types/message/parsed'
import { AxiosInstance } from 'axios'
import MarkdownIt from 'markdown-it'
import { RoleTypeCore } from '../../type'
import styles from './index.module.less'
/**
 *
 * @param param0 ai content 类型检查
 * @returns
 */

const isAIMsgBaseContent = (content: unknown): content is AIMsgBaseContent => {
  return typeof content === 'object' && content !== null && 'answer' in content
}

export const createAIMessageRender = (
  isDev: boolean,
  md: MarkdownIt,
  wsid: string,
  entWebAxiosInstance: AxiosInstance
): RoleTypeCore['messageRender'] => {
  return function AIMessageRender(content) {
    if (!isAIMsgBaseContent(content)) {
      console.error('content is not AIMsgBaseContent', content)
      return null
    }
    return (
      <div>
        {content.reasonContent && (
          <div className={styles.reasonContent}>
            <Markdown
              content={content.reasonContent}
              className={styles.reasonMD}
              isDev={isDev}
              md={md}
              wsid={wsid}
              entWebAxiosInstance={entWebAxiosInstance}
            />
          </div>
        )}
        <div className={styles.answerContent}>
          <Markdown
            content={content.answer}
            className={styles.answerMD}
            refTable={content.refTable}
            refBase={content.refBase}
            isDev={isDev}
            md={md}
            wsid={wsid}
            entWebAxiosInstance={entWebAxiosInstance}
          />
          {/* {!!content.error && <div className={styles.error}>{content.error}</div>} */}
        </div>
      </div>
    )
  }
}
