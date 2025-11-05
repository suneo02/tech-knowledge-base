import React from 'react'
import { wftCommon } from '../../utils/utils'
import intl from '../../utils/intl'
import Links from '../../components/common/links/Links'
import InnerHtml from '../../components/InnerHtml'
import { Tag } from '@wind/wind-ui'
import Products from '../../components/selectbleTag'
import { LinksModule } from '@/handle/link'
import { StylePrefix } from '../BidSearch/bidSearchList'
import './bid.less'

/**
 * BidCard 组件用于展示招投标卡片。
 * @param {Object} props 组件属性对象。
 * @param {Object} props.item 招标信息对象，包含以下属性：
 * @param {string} props.item.detail_id 招标详情ID。
 * @param {string} props.item.productName 产品名称。
 * @param {Array} props.item.bidWinner 中标单位信息数组。
 * @param {boolean} props.item.attachCount 附件数量。
 * @param {string} props.item.title 招标标题。
 * @param {string} props.item.purchasing_unit 采购单位。
 * @param {string} props.item.bidding_type_name 招标类型名称。
 * @param {string} props.item.announcement_time 公告时间。
 * @param {string} props.item.purchasing_unit_region 采购单位地区。
 * @param {string} props.item.project_budget_money 项目预算金额。
 * @param {Array} props.item.proposedSupplier 拟定供应商数组。
 * @param {string} props.item.bid_winning_money 中标金额。
 * @returns {JSX.Element} 返回一个React组件，用于显示招标信息。
 */

export const BidCard = ({ item }) => {
  const {
    detail_id,
    productName,
    bidWinner,
    attachCount,
    title: rawTitle,
    purchasing_unit,
    bidding_type_name,
    announcement_time,
    purchasing_unit_region,
    project_budget_money,
    proposedSupplier,
    bid_winning_money,
    highlight,
  } = item
  //搜索列表展示
  let detailid = detail_id ? detail_id : ''
  let noEmTitle = rawTitle ? rawTitle : '--'
  let regex = /<em>/g
  let regex2 = /<\/em>/g
  noEmTitle = noEmTitle.replace(regex, '').replace(regex2, '')
  // let jumpUrl = 'index.html?nosearch=1#/biddingDetail?detailid=' + detailid + '&title=' + (noEmTitle ? noEmTitle : '')
  let jumpUrl = 'index.html#/biddingDetail?type=bid&detailid=' + detailid + '&title=' + (noEmTitle ? noEmTitle : '')

  let title = highlight?.['title.search']?.[0] || rawTitle || ''

  let products = highlight?.['product_name'] || productName || []

  let companyStrArr = purchasing_unit && typeof purchasing_unit === 'string' ? purchasing_unit.split('|') : ''
  let companyStr = ''
  if (companyStrArr[1]) {
    companyStr = (
      <span className="underline-company" onClick={(e) => wftCommon.linkCompany('Bu3', companyStrArr[1])}>
        {companyStrArr[0] ? companyStrArr[0] : '--'}
      </span>
    )
  } else {
    companyStr = companyStrArr[0] ? companyStrArr[0] : '--'
  }
  let eachSearchlistItem = <></>

  switch (bidding_type_name) {
    case '单一来源公告':
      eachSearchlistItem = (
        <div className="each-searchlist-item">
          <span className="searchitem-work">
            {intl('138774', '发布时间')}：{announcement_time ? wftCommon.formatTime(announcement_time) : '--'}
          </span>
          <span className="searchitem-work">
            {intl('451213', '省份地区')}：{purchasing_unit_region ? purchasing_unit_region : '--'}
          </span>
          {project_budget_money && (
            <span className="searchitem-work">
              {intl('437303', '招标项目金额')}：
              {project_budget_money ? wftCommon.formatMoney(project_budget_money, [2, intl('23334', '元')]) : '--'}
            </span>
          )}
          <br />
          <span className="searchitem-work">
            {intl('142476', '采购单位')}：{companyStr}
          </span>
          {proposedSupplier?.length ? (
            <span className="searchitem-work">
              {intl('372353', '拟定供应商')}：
              {Array.isArray(proposedSupplier) &&
                proposedSupplier?.map(({ companyCode, companyName }) => {
                  return <Links useUnderline module={LinksModule.COMPANY} id={companyCode} title={companyName}></Links>
                })}
            </span>
          ) : (
            <></>
          )}
        </div>
      )
      break
    // 结果阶段（除废标流标外） 展示中标单位、中标金额
    case '中标公告':
    case '成交公告':
    case '竞价结果公告':
    case '开标公告':
    case '合同及验收公告':
      eachSearchlistItem = (
        <div className="each-searchlist-item">
          <span className="searchitem-work">
            {intl('138774', '发布时间')}：{announcement_time ? wftCommon.formatTime(announcement_time) : '--'}
          </span>
          <span className="searchitem-work">
            {intl('451213', '省份地区')}：{purchasing_unit_region ? purchasing_unit_region : '--'}
          </span>
          {project_budget_money && (
            <span className="searchitem-work">
              {intl('437303', '招标项目金额')}：
              {project_budget_money ? wftCommon.formatMoney(project_budget_money, [2, intl('23334', '元')]) : '--'}
            </span>
          )}
          <br />
          <span className="searchitem-work">
            {intl('142476', '采购单位')}：{companyStr}
          </span>
          {bidWinner?.length ? (
            <span className="searchitem-work">
              {intl('257823', '中标单位')}：
              {Array.isArray(bidWinner) &&
                bidWinner?.map(({ companyCode, companyName }, index, arr) => {
                  return (
                    <>
                      <Links useUnderline module={LinksModule.COMPANY} id={companyCode} title={companyName}></Links>
                      {index !== arr.length - 1 ? '; ' : ''}
                    </>
                  )
                })}
            </span>
          ) : (
            <></>
          )}
          {bid_winning_money && (
            <span className="searchitem-work">
              {intl('257701', '中标金额')}：
              {bid_winning_money ? wftCommon.formatMoney(bid_winning_money, [2, intl('23334', '元')]) : '--'}
            </span>
          )}
        </div>
      )
      break
    default:
      eachSearchlistItem = (
        <div className="each-searchlist-item">
          <span className="searchitem-work">
            {intl('138774', '发布时间')}：{announcement_time ? wftCommon.formatTime(announcement_time) : '--'}
          </span>
          <span className="searchitem-work">
            {intl('451213', '省份地区')}：{purchasing_unit_region ? purchasing_unit_region : '--'}
          </span>
          {project_budget_money && (
            <span className="searchitem-work">
              {intl('437303', '招标项目金额')}：
              {project_budget_money ? wftCommon.formatMoney(project_budget_money, [2, intl('23334', '元')]) : '--'}
            </span>
          )}
          <br />
          <span className="searchitem-work">
            {intl('142476', '采购单位')}：{companyStr}
          </span>
        </div>
      )
      break
  }

  return (
    <div id="div_Card" key={detailid}>
      <div className="div_Card_title">
        <h5 className="searchtitle-brand wi-link-color" onClick={() => wftCommon.jumpJqueryPage(jumpUrl)}>
          {title ? <InnerHtml className="bid-title" style={{ display: 'inline' }} html={title}></InnerHtml> : '--'}
          &nbsp;
        </h5>
        {attachCount ? (
          <Tag
            color="color-3"
            type="primary"
            style={{
              fontWeight: 'normal',
              cursor: 'pointer',
            }}
            onClick={(e) => {
              console.log('🚀 ~ SearchBidNew ~ e:', e)
              e.stopPropagation()
              wftCommon.jumpJqueryPage(jumpUrl + '&jumpAttach=1')
            }}
          >
            {intl('309242', '有附件') + `(${+attachCount})`}
          </Tag>
        ) : (
          <></>
        )}
        {
          <Tag className="div-Card-tag" type="primary" color="color-3">
            {bidding_type_name
              ? wftCommon.type2enStage(bidding_type_name) + wftCommon.type2Stage(bidding_type_name)
              : null}
          </Tag>
        }
      </div>
      <Products data={products}></Products>
      {eachSearchlistItem}
    </div>
  )
}
