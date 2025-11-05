import { isDev } from '@/utils/env'
import { createMDIT } from 'ai-ui'

// 配置 markdown-it

// interface MarkdownProps {
//   content: string
//   className?: string
//   /** 溯源用 */
//   refTable?: RefTableData[]
//   refBase?: QueryReferenceSuggest[]
// }

export const md = createMDIT(isDev)

// const Markdown: React.FC<MarkdownProps> = (props) => {
//   return <MarkdownUI {...props} wsid={getWsid()} isDev={isDev} entWebAxiosInstance={entWebAxiosInstance} md={md} />
// }

// export default Markdown
