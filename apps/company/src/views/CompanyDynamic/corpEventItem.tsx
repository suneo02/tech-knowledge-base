import { getUrlByLinkModule, LinksModule } from '@/handle/link'
import { Link } from '@wind/wind-ui'
import React from 'react'

export const mapText2JSXInCorpDynamic = ({
  event_type_raw,
  text,
  event_id,
  event_source_id,
  corp_id,
  event_abstract,
}: {
  event_type_raw: string
  text: string
  event_id: string
  event_source_id: string
  corp_id: string
  event_abstract: { years: string }
}) => {
  switch (event_type_raw) {
    case '招投标公告':
      return (
        <Link
          // @ts-expect-error ttt
          target="_blank"
          href={`index.html?nosearch=1#/biddingDetail?detailid=${event_source_id}`}
          data-uc-id="-DwOF2X0Xld"
          data-uc-ct="link"
        >
          {text}
        </Link>
      )
    case '招聘信息':
      return (
        <Link
          // @ts-expect-error ttt
          target="_blank"
          href={`index.html#/jobDetail?type=jobs&detailid=${event_source_id}&jobComCode=${corp_id}`}
          data-uc-id="bK35o8mJyao"
          data-uc-ct="link"
        >
          {text}
        </Link>
      )

    // 法律诉讼
    case '裁判文书':
      return (
        <Link
          // @ts-expect-error ttt

          target="_blank"
          href={`index.html#/lawdetail?reportName=Judgment&id=${event_source_id}`}
          data-uc-id="7wYS4CZYP6y"
          data-uc-ct="link"
        >
          {text}
        </Link>
      )
    case '开庭公告':
      return (
        <Link
          // @ts-expect-error ttt

          target="_blank"
          href={`index.html#/lawdetail?reportName=CourtSession&id=${event_source_id}`}
          data-uc-id="XMPrcvN8gGY"
          data-uc-ct="link"
        >
          {text}
        </Link>
      )
    case '法院公告':
      return (
        <Link
          // @ts-expect-error ttt

          target="_blank"
          href={`index.html#/lawdetail?reportName=CourtAnnouncement&id=${event_source_id}`}
          data-uc-id="MJNp4SJnUnB"
          data-uc-ct="link"
        >
          {text}
        </Link>
      )

    // 知识产权
    case '商标信息':
      return (
        <Link
          // @ts-expect-error ttt

          target="_blank"
          href={`index.html?type=brand&expover=${0}&detailid=${event_source_id}#/logoDetail`}
          data-uc-id="Far5X1Ri8eY"
          data-uc-ct="link"
        >
          {text}
        </Link>
      )
    case '专利信息':
      return (
        <Link
          // @ts-expect-error ttt
          target="_blank"
          href={`index.html#/patentDetail?nosearch=1&detailId=${event_id}`}
          data-uc-id="t2gK5ATFtKv"
          data-uc-ct="link"
        >
          {text}
        </Link>
      )
    case '企业公告':
      return (
        <Link
          // @ts-expect-error ttt
          target="_blank"
          href={getUrlByLinkModule(LinksModule.ANNUAL_REPORT, {
            params: {
              year: event_abstract.years,
              companyCode: corp_id,
            },
          })}
          data-uc-id="t2gK5ATFtKv"
          data-uc-ct="link"
        >
          {text}
        </Link>
      )
    default:
      return text
  }
}
