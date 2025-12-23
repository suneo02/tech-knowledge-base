import { Col, Link, Row, Tree } from '@wind/wind-ui'
import React from 'react'
import { STATIC_FILE_PATH } from '../../../locales/constants'
import intl from '../../../utils/intl'
import { downloadFile } from '../../../utils/utils'

function makeCorpTechScoreTree(data, item) {
  data.children.push(item)
}

export const corpTechScoreIndustryRender = (_txt, backData) => {
  const dataList = backData.industry
  if (!dataList || !dataList.length) return '--'

  return Object.keys(dataList).map((k) => {
    const dataItem = dataList[k]
    const d = dataItem?.industry || []
    d.sort((x, y) => x.level - y.level)
    let data = ''
    d.map((t) => {
      data = data ? data + '-' + t.industryName : t.industryName
    })
    if (!data) return '--'
    const list = data.split('-')
    const treeStr: { title: string; key: string; children?: any[] }[] = [{ title: list[0], key: '0-0' }]
    let tmp = treeStr[0]
    if (list.length > 1) {
      for (let i = 1; i < list.length; i++) {
        const k = '-0'
        tmp.children = []
        const item = { title: list[i], key: tmp.key + k }
        makeCorpTechScoreTree(tmp, item)
        tmp = item
      }
    }
    return (
      <Row className="techScoreRankRow" key={k}>
        <Col span={16}>
          <Tree
            className="corp-industry-tree"
            showLine={true}
            defaultExpandedKeys={[tmp.key]}
            treeData={treeStr}
            data-uc-id="bO1DEtYjpb"
            data-uc-ct="tree"
          />
        </Col>
        <Col span={8}>
          <span>{intl('30635', '排名')}：</span>
          <span>
            {dataItem.ranking} / {dataItem.total}
          </span>
        </Col>
      </Row>
    )
  })
}
export const TechScoreHint = () => {
  return window.en_access_config ? (
    intl(
      '400793',
      '万得科创分从企业实力、社会影响力、技术质量、技术布局及研发规模5个维度出发，综合评估企业的科技创新能力。'
    )
  ) : (
    <>
      <span>
        {intl(
          '400793',
          '万得科创分从企业实力、社会影响力、技术质量、技术布局及研发规模5个维度出发，综合评估企业的科技创新能力。'
        )}
      </span>
      <div>该结果仅供用户参考，并不代表万得的任何观点或保证。</div>
      <div>
        <Link
          // @ts-expect-error ttt
          onClick={() => {
            downloadFile(
              STATIC_FILE_PATH + 'Wind-GEL-Corporate-Technology-Innovation-Capability-Model-Description.pdf',
              intl('', '万得企业库企业科创能力模型说明')
            )
          }}
          underline
          data-uc-id="CkgKg60l3f"
          data-uc-ct="link"
        >
          {intl('400794', '点击下载模型说明')}
        </Link>
        。
      </div>
    </>
  )
}
