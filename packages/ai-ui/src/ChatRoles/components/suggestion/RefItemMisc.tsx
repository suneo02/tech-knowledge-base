import { useRefLink } from '@/hooks/useRefLink'
import { AxiosInstance } from 'axios'
import { QueryReferenceSuggest, QueryReferenceSuggestType } from 'gel-api'
import { FC } from 'react'
import { RefModal } from './comp/modal'
import { RefItemCommon } from './comp/RefItemCommon'
interface ReferenceItemProps {
  data: QueryReferenceSuggest
  className?: string
  isDev: boolean
  wsid: string
  entWebAxiosInstance: AxiosInstance
}

/**
 * 老师，AliceChat参考资料模块涉及的终端跳转指令如下：
 *
 * 类型	type	跳转指令/URL	跳转执行方式
 * 新闻	N、RN	!CommandParam(1900,ID=${windcode},TITlE=${title}),LAN=${lan}	window.location.href
 * 公告	A	!CommandParam(1901,ID=${docIdEncry || windcode},TITlE=${title})
 * 研报	R	!CommandParam(1902,ID=${docIdEncry || windcode},TITlE=${title})
 * 法律法规	L	/SmartReaderWeb/SmartReader/?type=5&id=${windcode}	window.open
 * 舆情	YQ	GET ${HOST}/getRiskNewsUrl?id=${docId}&mode=1
 * 跳转URL是返回结果的data字段
 * 3C会议	3C	https://peacallServer/RTCWeb/pc/index.html#/liveRoom?liveId=${windcode}
 *
 *
 * 以上，type、windcode、docId、docIdEncry均为列表对象字段，title=encodeURIComponent(text)
 *
 * 舆情的跳转需要拼接docId，额外调用HTTP接口获取地址。
 *
 * 表格数据的EDE、EDB指标批量跳转指标数据浏览器：
 *       // EDE浏览器跳转指令
 * let codes = ''; // 证券代码
 *       if (windCodes && windCodes.length) {
 *         codes = `;SelectWindCode(WindCode=${windCodes.join(",")});query()`;
 *       }
 *       const inds = edeIndicators.map(id => `SelectIndicator(id=${id})`); // 指标ID
 *       return `!CommandFunc(ExecuteCmd(CMDID=1601);AddSheet();${inds.join(";")}${codes})`;
 *
 * // EDB跳转指令
 *       const inds = edbIndicators.map(id => `EDBFolder(code=${id})`); // 指标ID
 *       return `!CommandFunc(ExecuteCmd(CMDID=20005);${inds.join(";")};addin())`;
 */

export const RefItemMisc: FC<ReferenceItemProps> = ({ data, className, isDev, wsid, entWebAxiosInstance }) => {
  const { text = '', publishdate = '', type = '', sitename } = data

  const { refUrl, handleRefJump, showModal, closeModal, tagText } = useRefLink(data, isDev, wsid, entWebAxiosInstance)

  return (
    <>
      <RefItemCommon
        text={text}
        tagText={tagText}
        tagType={type as QueryReferenceSuggestType}
        sitename={sitename}
        publishdate={publishdate}
        className={className}
        canJump
        onItemClick={handleRefJump}
        dataUrl={refUrl}
      />
      <RefModal showModal={showModal} closeModal={closeModal} />
    </>
  )
}
