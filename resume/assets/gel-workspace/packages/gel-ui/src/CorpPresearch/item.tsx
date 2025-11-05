import { InnerHtml } from '@/InnerHtml'
import { CorpPreSearchResult } from 'gel-types'
import { isEn, t } from 'gel-util/intl'
import { FC } from 'react'

interface CorpSearchRowProps {
  item: CorpPreSearchResult
  onClick?: (id: string) => void
}

export const CorpSearchRow: FC<CorpSearchRowProps> = ({ item, onClick }) => {
  const { corpName, corpId, corpNameEng, aiTransFlag, highlight } = item || {}
  const matchType = highlight?.[0]?.label
  const handleClick = () => {
    onClick?.(corpId)
  }

  return (
    <div className="searchRow" onClick={handleClick}>
      {isEn() ? (
        <div className="resultList ">
          <InnerHtml className="name zhName" html={corpName} />
          <p
            className="name enName"
            title={corpNameEng + '   ' + ((aiTransFlag && t('362293', '该翻译由AI提供')) || '')}
          >
            <InnerHtml html={corpNameEng}></InnerHtml>
            {aiTransFlag && corpNameEng && <span className="foot">{t('362293', '该翻译由AI提供')}</span>}
          </p>
        </div>
      ) : (
        <InnerHtml className="resultList" html={corpName}></InnerHtml>
      )}
      {matchType ? <div className="comIntro">{matchType}</div> : ''}
    </div>
  )
}
