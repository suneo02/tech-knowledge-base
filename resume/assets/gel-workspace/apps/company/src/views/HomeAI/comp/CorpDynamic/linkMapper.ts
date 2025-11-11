interface LinkMapperProps {
  event_type_raw: string
  text: string
  event_id: string
  event_source_id: string
  corp_id: string
  event_abstract: {
    years?: string
  }
}

/**
 * 根据事件类型生成对应的链接组件
 */
export const mapText2JSX = ({
  event_type_raw,
  text,
  event_id,
  event_source_id,
  corp_id,
  event_abstract,
}: LinkMapperProps) => {
  switch (event_type_raw) {
    case '企业公告':
      return {
        href: `index.html?companyCode=${corp_id}&year=${event_abstract.years}#/annualReportDetail`,
        text,
      }

    case '招投标公告':
      return {
        href: `index.html?nosearch=1#/biddingDetail?detailid=${event_source_id}`,
        text,
      }

    case '招聘信息':
      return {
        href: `index.html#/jobDetail?type=jobs&detailid=${event_source_id}&jobComCode=${corp_id}`,
        text,
      }

    // 法律诉讼
    case '裁判文书':
      return {
        href: `index.html#/lawdetail?reportName=Judgment&id=${event_source_id}`,
        text,
      }

    case '开庭公告':
      return {
        href: `index.html#/lawdetail?reportName=CourtSession&id=${event_source_id}`,
        text,
      }

    case '法院公告':
      return {
        href: `index.html#/lawdetail?reportName=CourtAnnouncement&id=${event_source_id}`,
        text,
      }

    // 知识产权
    case '商标信息':
      return {
        href: `index.html?type=brand&expover=${0}&detailid=${event_source_id}#/logoDetail`,
        text,
      }

    case '专利信息':
      return {
        href: `index.html#/patentDetail?nosearch=1&detailId=${event_id}`,
        text,
      }

    default:
      return {
        text,
        href: '',
      }
  }
}
