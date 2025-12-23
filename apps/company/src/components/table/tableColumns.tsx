/** @format */

import Brand from '@/assets/imgs/logo/brand80.png'
import Links from '@/components/common/links/Links'
import intl from '@/utils/intl'
import { Popover, Progress, Tooltip, Tree } from '@wind/wind-ui'

import { PatentLawStatusTitle } from '@/components/company/comp/intellectual/patent/patentLawStatusTitle.tsx'
import { TableColLinkRender } from '@/components/table/columns/link/common.tsx'
import { LinksModule } from '@/handle/link'
import { getWsid } from '@/utils/env/index.ts'
import { ColumnProps } from '@wind/wind-ui-table'
import React from 'react'
import { pointBuriedByModule } from '../../api/pointBuried/bury'
import no_photo_list from '../../assets/imgs/group/default_group.png'
import { useGroupStore } from '../../store/group'
import { TConfigDetailTableColumn } from '../../types/configDetail/table.ts'
import { formatCurrency } from '../../utils/common'
import { hashParams } from '../../utils/links'
import { wftCommon } from '../../utils/utils'
import Expandable from '../common/expandable/Expandable'
import SimpleModal from '../common/modal/SimpleModal'
import { CompanyLinks } from '../company/context'
import { InfoCircleButton } from '../icons/InfoCircle/index.tsx'
import TableNew from './TableNew'
import { handleCompanyLinkArr, handleTableColumnDateType, handleTableColumnTitle, TableColumnTags } from './columns'
import { handleColBidProductRender } from './columns/custom/bidProcuct.tsx'
import { handleColumnCorpLinkArrStrRender } from './columns/custom/corpLinkArrStr.tsx'
import ExpandableText from './components/expandableText/ExpandableText'
import './table.less'
import { useDataIndex } from './tableDataIndex'
import { tableTips } from './tableDictionary'

/** 未来需要优化，传参不统一，导致大量的冗余 */
export const useTableColumns = () => {
  const basicInfo = useGroupStore((store) => store.basicInfo)
  const { handleDataIndex } = useDataIndex()
  /**
   * 处理 Columns
   * 支持 Table 和 HorizontalTable
   * @returns columns
   */
  const handleColumns = (columns) => {
    /** recursion function */
    const handleParams = (params) => {
      return params?.map((par) => {
        if (Array.isArray(par)) {
          return handleParams(par)
        }
        if (par.children) {
          par.children = handleParams(par.children)
        }
        return handleColumn(par)
      })
    }
    return handleParams(columns)
  }

  /**
   * 集成处理所有column
   * 以后关于Column的全部都在这里！！！
   * @param {object} column
   * @returns column<Object>
   */
  const handleColumn = (column: TConfigDetailTableColumn & ColumnProps) => {
    handleTableColumnTitle(column)
    /** 这里未来需要优化下，应该都先render */
    /** 针对特殊的render作处理 */
    if (column?.customId) {
      /** 人物合作企业 */
      switch (column.customId) {
        case 'character_hzhb_1':
          column.render = (res, row) => {
            const collaborateCorpTxt = intl('419808', '共合作%家企业').replace('%', row.total)
            if (row?.total > 1) {
              return (
                <>
                  <Links module={LinksModule.COMPANY} title={res} id={row?.companyCode} />
                  {` ${window.en_access_config ? 'and' : '等'} `}
                  <strong>{row.total}</strong>
                  {` ${intl('417532', '家企业，点击查看')}`}
                  <SimpleModal
                    width={800}
                    title={
                      <>
                        {basicInfo.personName}
                        {` ${window.en_access_config ? 'and' : '和'} `}
                        <Links title={row.personName} module={LinksModule.CHARACTER} id={row.personId} />
                        {` ${collaborateCorpTxt}`}
                      </>
                    }
                    trigger={
                      <a onClick={() => pointBuriedByModule(922602101110)} data-uc-id="SmL_S7s5P7" data-uc-ct="a">
                        {intl('40513', '详情')}
                      </a>
                    }
                  >
                    {renderT(column, row)}
                  </SimpleModal>
                </>
              )
            } else {
              return (
                <>
                  <Links module={LinksModule.COMPANY} title={res} id={row?.companyCode} />
                  {`，${intl('437736', '点击查看')}`}
                  <SimpleModal
                    width={800}
                    title={
                      <>
                        {basicInfo.personName}
                        {` ${window.en_access_config ? 'and' : '和'} `}
                        <Links title={row.personName} module={LinksModule.CHARACTER} id={row.personId} />
                        {` ${collaborateCorpTxt}`}
                      </>
                    }
                    trigger={<a>{intl('40513', '详情')}</a>}
                  >
                    {renderT(column, row)}
                  </SimpleModal>
                </>
              )
            }
          }
          break
        case 'CorpLinkArrStr':
          column.render = handleColumnCorpLinkArrStrRender
          break
        case 'bidProduct':
          column.render = handleColBidProductRender
          break
        case 'patentLawStatus':
          // @ts-expect-error ttt
          column.title = <PatentLawStatusTitle />
          break
      }
      return column
    }
    if (column.render) {
      return column
    } else if (column.arrayKeys) {
      handleArray(column)
    } else {
      handleDataIndex(column)
      if (column.type === 4) {
        handleNumberColumn(column)
      }
      if (column.type === 13) {
        handleChainModal(column)
      }
      if (column.type === 12) {
        handleInfo(column)
      }
      if (column.type === 5) {
        column.render = (res) => wftCommon.formatPercent(res)
      }
      if (column.type === 6) {
        handleCurrency(column)
      }
      if (column.type == 20) {
        column.render = (txt) => wftCommon.formatMoney(txt, [4, '元'])
      }
      if (column.type === 7) {
        handleTableColumnDateType(column)
      }
      if (column.type === 'array') {
        column.render = (res) => (Array.isArray(res) && res.length ? res?.join('，') : '--')
      }
      if (column.windLinks) handleWindLinks(column)
      if (column.isExpand) handleExpand(column)
      if (column.innerHtml) handleInnerHtml(column)
      if (column.companyLinks) handleCompanyLinks(column)
      /** 股权链处理 */
      if (column.isStockChain) handleStockChain(column)
      /** 股权链特殊处理，可以弹窗展示股权链 */
      if (column.isStockChainModal) handleStockChainModal(column)
      /** 是否是树形结构 */
      if (column.treeKeys) handleTree(column)
      /** 弹窗说明文案 */
      if (column.isToolTips) handleTooltip(column)
      /** 图片 */
      if (column.isImage || column.image) handleImage(column)
      /** 招标信息 */
      if (column.biddingLinks) handleBiddingLinks(column)
      /** 长文本 */
      if (column.longText) handleLongText(column)
      /** 分数 */
      if (column.score) handleScore(column)
      /** 产品链接 */
      if (column.productLinks) handleProductLinks(column)

      /** 可怕，简直美如画 */
      if (column.companyLinksArray) handleCompanyLinksArray(column)
      /** 呵呵 */
      if (column.hehe) handleHehe(column)
      /** 呵呵2 */
      if (column.hehe2) handleHehe2(column)
      /** 呵呵3 */
      if (column.map) handleMap(column)
      /** 是否是组织机构代码 */
      if (column.orgCode) handleOrgCode(column)
      /** 呵呵4 */
      if (column.applicant_and_id) handleApplicant_and_id(column)

      // 带链接的部分 有可能链接
      if (column.links) {
        handleLinks(column)
      } else if (column.tagInfo) {
        column.render = (txt, record) => (
          <>
            {txt}
            <TableColumnTags record={record} tagInfo={column.tagInfo} />
          </>
        )
      }

      /** 多个公司特殊处理 , 公司信息为 obj */
      if (column.companyLinkArr) handleCompanyLinkArr(column)
    }
    return column
  }

  const handleInfo = (col) => {
    const infoType = col?.info?.type
    if (infoType === 2) {
      showModal(col)
    }
  }

  const handleNumberColumn = (col) => {
    col.render = (txt) => wftCommon.formatMoneyComma(txt)
  }

  const handleCurrency = (col) => {
    col.render = (currency, row) => {
      return formatCurrency(currency, row?.[col?.currencyUnit])
    }
  }

  const handleWindLinks = (col) => {
    col.render = (txt, row) => {
      const linksParams = { ...col.windLinks }
      if (col.windLinks.id) linksParams.id = row[col.windLinks.id]
      if (col.windLinks.extraId) linksParams.extraId = row[col.windLinks.extraId]
      return <Links title={txt} {...linksParams} />
    }
  }

  /**
   * 当下全部使用这个方法
   */
  const handleLinks = (col: TConfigDetailTableColumn & ColumnProps) => {
    col.render = (txt, row) => <TableColLinkRender txt={txt} row={row} col={col} />
  }

  const handleApplicant_and_id = (col) => {
    col.render = (list, row) => {
      return list.map((res) => {
        if (!res) return null
        const textArr = res.split(',')
        return textArr.map((txt, index) => {
          const txtArr = txt.split('|')
          return <CompanyLinks key={index} name={txtArr[0]} id={txtArr[1]} {...row} />
        })
      })
    }
  }

  const handleOrgCode = (col) => {
    col.render = (txt) => (txt ? txt.substr(8, 9) : '--')
  }

  const handleMap = (col, fromBGDZ = 1) => {
    col.render = (txt, row) => {
      const id = row.corp || row.corp_id
      return id ? (
        <a
          onClick={() => {
            if (wftCommon.usedInClient()) {
              // console.log('我在客客户端里面')
              window.open(
                'https://GOVWebSite/govmap/index.html?mode=2&pureMode&title=万寻地图&right=4C203DE15&companyId=' +
                  id +
                  (fromBGDZ ? '&addressType=businessAddress&1=1' : '') +
                  '#/'
              )
            } else {
              const wsidStr = getWsid()
              // console.log()
              window.open(
                'http://dgov.wind.com.cn/govmap/index.html?mode=2&pureMode&title=万寻地图 &right=4C203DE15&companyId=' +
                  id +
                  (fromBGDZ ? '&addressType=businessAddress&1=1' : '') +
                  '&wind.sessionid=' +
                  wsidStr
              )
            }
          }}
          data-uc-id="iQbXiDJ1sf"
          data-uc-ct="a"
        >
          {txt}
        </a>
      ) : (
        txt
      )
    }
  }

  const handleHehe2 = (col) => {
    col.render = (res, row) => {
      // console.log(res)
      if (!res) return null
      const textArr = res.split(',')
      return textArr.map((txt, index) => {
        const txtArr = txt.split('|')
        return <CompanyLinks key={index} name={txtArr[0]} id={txtArr[1]} {...row} />
      })
    }
  }

  const handleHehe = (col) => {
    col.render = (res, row) => {
      const renderMap = (list, title) =>
        list.map((txt, index) => {
          const txtArr = txt.split('|')
          return (
            <span key={index}>
              {index ? ',' : `${title}-`}
              <CompanyLinks name={txtArr[0]} id={txtArr[1]} {...row} />
            </span>
          )
        })

      return (
        <span>
          {Object.keys(res).map((key) => {
            return <div key={key}>{renderMap(res[key], key)}</div>
          })}
        </span>
      )
    }
  }

  const handleCompanyLinksArray = (col) => {
    col.render = (res, row) =>
      res.map((txt) => {
        const txtArr = txt.split('|')
        return (
          <div key={txtArr[1]}>
            <CompanyLinks name={txtArr[0]} id={txtArr[1]} {...row} />
          </div>
        )
      })
  }

  const handleScore = (col) => {
    col.render = (txt) => {
      const persent = Math.floor((Number(txt) / Number(col?.score?.total ? col.score.total : 10)) * 100)
      // console.log(txt, persent);
      return <Progress width={40} type="circle" percent={persent} format={() => `${txt}`} />
    }
  }

  const handleLongText = (col) => {
    col.render = (txt) => <Expandable content={txt} maxLines={2} data-uc-id="3XLW4Sjjam" data-uc-ct="expandable" />
  }

  /** @deprecated */
  const handleExpand = (col) => {
    col.render = (res) => <ExpandableText text={res} />
  }

  const handleInnerHtml = (col) => {
    col.render = (res) => {
      return <div style={{ verticalAlign: 'top' }} dangerouslySetInnerHTML={{ __html: res }}></div>
    }
  }

  const handleStockChain = (col) => {
    col.render = (res, row) =>
      Array.isArray(res) ? handleStockChainByArray(res, row) : handleStockChainBySplit(res, row)
  }

  /** 股权链处理（通过分号隔离处理） */
  const handleStockChainBySplit = (res, row) => {
    const chainInfo = (chain, index) => {
      const [id, name, ratio] = chain.split(',')
      return (
        <span key={index}>
          <span className="stock-chain">
            <b>{ratio}</b>
            <i></i>
          </span>
          <span>
            <CompanyLinks name={name} id={id} {...row} />
          </span>
        </span>
      )
    }
    const chains = res.split(';')
    return (
      <div>
        {/* todo ... 未来这块需要处理 */}
        <span>{basicInfo.corp_name}</span>
        {chains.map((chain, index) => {
          return chainInfo(chain, index)
        })}
      </div>
    )
  }

  /** 股权链处理（通过数组处理） */
  const handleStockChainByArray = (stocks, row) => {
    return (
      <div>
        {stocks.map((res, index) => (
          <span key={index}>
            <span>
              {/* 这块的字段未来必须统一成 name 和 id */}
              <CompanyLinks name={res.shareholderName} id={res.shareholderId} {...row} />
            </span>
            {res.percent ? (
              <span className="stock-chain">
                <b>{wftCommon.formatPercent(res.percent)}</b>
                <i></i>
              </span>
            ) : null}
          </span>
        ))}
      </div>
    )
  }

  const showChain = (col, rate, row) => {
    if (window.en_access_config) {
      return wftCommon.formatPercent(rate) // 临时处理
    }
    if (row?.isShareRoute) {
      const shareRate = wftCommon.formatPercent(rate)
      return (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: 140 }}>{shareRate ? (shareRate == 0 ? '--' : shareRate) : '--'}</div>
          <div
            className="share-route"
            onClick={() => {
              if (col?.shareRouteParams) {
                const { getParamValue } = hashParams()
                let apiParams = {}
                const { api, params } = col.shareRouteParams
                if (params?.length) apiParams = getRouteApiParams(row, params)
                console.log('🚀 ~ showChain ~ routeParams:', apiParams)
                wftCommon.showRoute(row.shareRoute, false, { api: `${api}/${getParamValue('id')}`, params: apiParams })
              } else {
                wftCommon.showRoute(row.shareRoute || [])
              }
            }}
            data-uc-id="yGhSiE0qxT"
            data-uc-ct="div"
          ></div>
        </div>
      )
    } else {
      return wftCommon.formatPercent(rate)
    }
  }

  const getRouteApiParams = (row, params) => {
    const apiParams = {}
    params?.forEach((par) => {
      if (par.type === 'dynamic') {
        if (row?.key && par?.apiKey) apiParams[par.apiKey] = row?.[par.key]
        console.log(apiParams)
      } else {
        if (par?.apiKey && par?.value) apiParams[par.apiKey] = par.value
      }
    })
    return apiParams
  }

  /** 股权链特殊处理，可以弹窗展示股权链人物 */
  const handleChainModal = (col) => {
    col.render = (_, row) => {
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          {/* wftCommon.formatPercent(res) */}
          {/* <span>{wftCommon.formatPercent(row?.shareholdRatio)}</span> */}
          {showChain(col, row?.shareholdRatio, row)}
        </div>
      )
    }
  }

  /** 股权链特殊处理，可以弹窗展示股权链 */
  const handleStockChainModal = (col) => {
    col.render = (_, row) => {
      const splitColumns = col.dataIndex.split('|')
      const txt =
        row[splitColumns[0]] && wftCommon[splitColumns[1]]
          ? wftCommon[splitColumns[1]](row[splitColumns[0]])
          : col.noDataIndex || '--'
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          <span>{txt}</span>
          {row.shareRoute?.length ? (
            <span
              className="share-route"
              onClick={() => wftCommon.showRoute(row.shareRoute || [])}
              data-uc-id="pC_uhxO0zD"
              data-uc-ct="span"
            ></span>
          ) : null}
        </div>
      )
    }
  }

  /** 数组处理 */
  const handleArray = (col) => {
    col.render = (res) => {
      if (res) return res.map((res, index) => <div key={index}>{res[col.arrayKeys.title]}</div>)

      // return null
    }
  }

  /** tree处理 */
  const handleTree = (col) => {
    /**
     * 后端传参很幽默，没有tree结构，暂时先满足他们的需求吧
     * 1.纯字符串
     * 2.平铺list 但是数据是{0: []}这种奇葩结构（真可以拖出去斩了）
     */
    col.render = (res) => {
      if (!res) return null
      const treeData = buildTree(col, res)
      // // console.log(treeData);
      return (
        <Tree
          className="table-tree"
          treeData={treeData}
          defaultExpandAll={true}
          data-uc-id="HQk_NbTyA6"
          data-uc-ct="tree"
        />
      )
    }
  }

  /** 平铺的list转换成tree */
  const buildTree = (col, res) => {
    const stringList = () => {
      const strs = res.split('-')
      return strs.map((str) => ({ title: str }))
    }
    const stringFlag = typeof res === 'string'
    const list = stringFlag ? stringList() : res[0]
    list.map((item, index) => {
      item.key = index + 1
      item.title = item.title || item[col.treeKeys.title]
      if (index + 1 < list.length) {
        item.children = [list[index + 1]]
      }
      // // console.log(data);
      return item
    })
    // // console.log(list)
    return [list[0]]
  }

  const handleTooltip = (col) => {
    col.render = (txt, row) => (
      <div>
        {`${txt}`}
        <Tooltip
          overlayStyle={{ maxWidth: '40vw' }}
          placement="top"
          title={
            <div className="tooltip-content">
              {tableTips.find((res) => (res.title = window.en_access_config ? row.state_zh : txt))?.tips}
            </div>
          }
        >
          <InfoCircleButton />
        </Tooltip>
      </div>
    )
  }

  /** @deprecated */
  const handleCompanyLinks = (col) => {
    const { name_key, id_key } = col.companyLinks
    if (id_key) {
      col.render = (txt, row) => <CompanyLinks name={name_key ? row[name_key] : txt} id={row[id_key]} {...row} />
    }
  }
  /** @deprecated */
  const handleBiddingLinks = (col) => {
    const { name_key, id_key } = col.biddingLinks
    if (id_key) {
      col.render = (txt, row) => (
        <a
          onClick={() => {
            wftCommon.jumpJqueryPage(`index.html?nosearch=1#/biddingDetail?detailid=${row[id_key]}`)
          }}
          rel="noreferrer"
          data-uc-id="kF7pTkC2z0"
          data-uc-ct="a"
        >
          {row[name_key] || txt}
        </a>
      )
    }
  }
  /** @deprecated */
  const handleProductLinks = (col) => {
    const { name_key, id_key } = col.productLinks
    if (id_key) {
      col.render = (txt, row) => (
        <a
          onClick={() => {
            wftCommon.jumpJqueryPage(`showItemDetail.html?type=product&detailid=${row[id_key]}`)
          }}
          rel="noreferrer"
          data-uc-id="Z6CsYDRwtei"
          data-uc-ct="a"
        >
          {row[name_key] || txt}
        </a>
      )
    }
  }

  /**
   * 头像或图片 这块需要优化
   * @param {*} col
   */
  const handleImage = (col) => {
    col.render = (res) => {
      let defaultSrc = no_photo_list
      switch (col.image?.defaultSrc) {
        case 'brand':
          defaultSrc = Brand
          break
        default:
          defaultSrc = no_photo_list
          break
      }
      // }
      return (
        <div className="company-table-logo">
          <Popover
            placement="rightBottom"
            content={
              <img
                width="140"
                src={res}
                onError={(e) => {
                  // @ts-expect-error ttt
                  e.target.src = defaultSrc
                }}
                data-uc-id="YkmrhEWtgmX"
                data-uc-ct="img"
              />
            }
            data-uc-id="g0SfolCAHM"
            data-uc-ct="popover"
          >
            <img
              src={res}
              onError={(e) => {
                // @ts-expect-error ttt
                e.target.src = defaultSrc
              }}
              data-uc-id="6XgbU02w5e1"
              data-uc-ct="img"
            />
          </Popover>
        </div>
      )
    }
  }

  const renderT = (col, row) => {
    const _data = col?.info?.component
    if (_data) {
      return <TableNew bordered {..._data} params={{ ..._data?.params, id: row[col?.info?.id] }} />
    }
    return null
  }

  const showModal = (col) => {
    col.render = (txt, row) =>
      Array.isArray(txt) && txt.length ? (
        <SimpleModal
          width={800}
          title={
            <>
              {basicInfo.personName}
              {' 和 '}
              <Links title={row.personName} module={3} id={row.personId} />
              {` 共合作${row.total}家企业`}
            </>
          }
          trigger={<a>{intl('40513', '详情')}</a>}
        >
          {renderT(col, row)}
        </SimpleModal>
      ) : (
        '--'
      )
  }

  return {
    handleColumns,
  }
}
