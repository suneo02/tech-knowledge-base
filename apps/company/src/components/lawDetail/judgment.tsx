import { Card, Tag } from '@wind/wind-ui'
import Table from '@wind/wind-ui-table'
import React, { useMemo, useState } from 'react'
import CompanyLink from '../company/CompanyLink'
import { wftCommon } from '../../utils/utils'

import intl from '../../utils/intl'
import './judgment.less'
import { usePageTitle } from '../../handle/siteTitle'

const { HorizontalTable } = Table

function Judgment(props) {
  const { info, isLoading } = props
  usePageTitle('JudgmentDetails', info?.title)

  const formatterParties = (list) => {
    const obj = {}
    list.forEach((item) => {
      if (!obj[item.roleTypeCode]) {
        obj[item.roleTypeCode] = {}
        obj[item.roleTypeCode]['list'] = []
        obj[item.roleTypeCode]['roleType'] = item.roleType
        obj[item.roleTypeCode]['roleTypeCode'] = item.roleTypeCode
        obj[item.roleTypeCode]['list'].push({
          name: item.entityName,
          id: item.entityCode,
        })
      } else {
        obj[item.roleTypeCode]['list'].push({
          name: item.entityName,
          id: item.entityCode,
        })
      }
    })
    const result = []
    for (const key in obj) {
      result.push(obj[key])
    }
    console.log('obj', obj)
    return result
  }

  const parties =
    info && info.judgeRoles
      ? formatterParties(info.judgeRoles).map((item) => [
          {
            title: item.roleType,
            dataIndex: item.roleTypeCode,
            contentAlign: 'left',
            titleAlign: 'left',
            colSpan: 5,
            render: () => {
              return item.list.map((ele, index) => {
                const text = index === item.list.length - 1 ? ele.name : ele.name + ','
                return ele.id && ele.id.length ? <CompanyLink name={ele.name} id={ele.id} /> : text
                // return ele.id && ele.id.length?<a href={"../../Company/Company.html?companycode=" + item.id} target="_blank">{text}</a> :text
              })
              // return <a href={"./companyDetail?needtoolbar=1&companycode=" + item.id}>{item.name}</a>
              // return item.name
            },
          },
        ])
      : []

  const [showCateChild, setShowCateChild] = useState(true) //目录折叠相关

  const judgementCateCode = [
    '137025654',
    '137025395',
    '137025655',
    '137025396',
    '137025656',
    '137025397',
    '137025657',
    '137025398',
    '137025658',
    '137025399',
    '137025659',
    '137025400',
    '137025660',
  ]
  const judgementCateName = [
    '审理经过',
    '原告方诉求',
    '被告方答辩',
    '原审原告诉求',
    '原审被告答辩',
    '原审法院查明',
    '原审法院认为',
    '本院查明',
    '本院认为',
    '裁判结果',
    '执行经过',
    '法院人员',
    '裁判日期',
  ]

  console.log('info', info)

  const rowsConfig = [
    [
      {
        title: '案号',
        dataIndex: 'caseNo',
        titleWidth: '15%',
        contentWidth: '35%',
        titleAlign: 'left',
        contentAlign: 'left',
      },
      {
        title: '法院',
        dataIndex: 'courtName',
        titleWidth: '15%',
        contentWidth: '35%',
        titleAlign: 'left',
        contentAlign: 'left',
      },
    ],
    [
      { title: '案由', dataIndex: 'caseReason', titleAlign: 'left', contentAlign: 'left' },
      { title: '案件类型', dataIndex: 'caseName', titleAlign: 'left', contentAlign: 'left' },
    ],
    [
      { title: '审判程序', dataIndex: 'judgeName', titleAlign: 'left', contentAlign: 'left' },
      { title: '文书类型', dataIndex: 'contentName', titleAlign: 'left', contentAlign: 'left' },
    ],
  ]

  const scollFn = (id) => {
    //目录滚动
    document.querySelector('#link' + id).scrollIntoView()
  }

  const showContentText = () => {
    //正文显示
    if (info && info.content && info.content.includes(':') > 0) {
      //防止出现不是json字符串而只是普通字符串的判断
      const contentObj = JSON.parse(info.content)
      const keysArr = Object.keys(contentObj)
      const resetData = judgementCateCode.map((item, i) => {
        const oIndex = keysArr.indexOf(item)
        if (oIndex >= 0) {
          return (
            <>
              <div className="each-content-judgement" id={'link' + judgementCateCode[i]} key={judgementCateCode[i]}>
                <h3>{judgementCateName[i]}</h3>
                <div className="each-context-text">{contentObj[item]}</div>
              </div>
            </>
          )
        }
      })
      return <div>{resetData}</div>
    } else {
      return <div>{info.content || intl('132725', '暂无数据')}</div>
    }
  }

  const renderLContent = () => {
    return info ? (
      <div>
        <Card className="header-container">
          <h3>
            <span className="header-title">{info && info['title']}</span>

            <Tag className="isclose_tag" data-uc-id="S8iv3zYiqq" data-uc-ct="tag">
              {info && info['isClosed'] ? '已结案' : '未结案'}
            </Tag>

            <Tag className="type-case-tag" data-uc-id="1leahL3OUw" data-uc-ct="tag">
              {info && info['caseName']}
            </Tag>
          </h3>
          <div>
            <span className="tip-mar">
              {intl('138908', '发布日期')}:{wftCommon.formatTime(info['publishDate'])}
            </span>
            <span className="tip-mar">
              {intl('11061', '判决日期')}:{wftCommon.formatTime(info && info['judgeDate'])}
            </span>
          </div>
        </Card>
        <Card className="baseinfo-container" title={intl('205468', '基本信息')}>
          <HorizontalTable
            // @ts-expect-error ttt
            bordered={false}
            striped={true}
            // @ts-expect-error ttt
            rows={rowsConfig.concat(parties)}
            dataSource={info}
            data-uc-id="Hm1ArDgeeX"
            data-uc-ct="horizontaltable"
          />
        </Card>
        <Card className="baseinfo-container" title={intl('222856', '文书正文')}>
          {showContentText()}
        </Card>
      </div>
    ) : null
  }

  const showCate = useMemo(() => {
    //显示目录
    if (info && info.content && info.content.charAt(0) === '{') {
      //防止出现不是json字符串而只是普通字符串的判断
      try {
        const contentObj = JSON.parse(info.content)
        const keysArr = Object.keys(contentObj)
        const keyOrder = []
        const CodeOrder = []
        judgementCateCode.map((item, i) => {
          const oIndex = keysArr.indexOf(item)
          if (oIndex >= 0) {
            keyOrder.push(judgementCateName[i])
            CodeOrder.push(judgementCateCode[i])
          }
        })
        return (
          <Card className="cate-container" title="目录">
            <ul>
              <li>
                <h3>{intl('205468', '基本信息')}</h3>
              </li>
              <li className={showCateChild ? 'show-cate-li' : 'hide-cate-li'}>
                <h3>
                  <i
                    onClick={() => {
                      setShowCateChild(!showCateChild)
                    }}
                    data-uc-id="kkCDcWD7u"
                    data-uc-ct="i"
                  ></i>
                  {intl('222856', '文书正文')}
                </h3>
                <div className="cate-children">
                  {keyOrder.map((item, index) => (
                    <div
                      key={CodeOrder[index]}
                      className="each-cate-child"
                      onClick={() => scollFn(CodeOrder[index])}
                      data-uc-id="OSMRn2shz6"
                      data-uc-ct="div"
                      data-uc-x={CodeOrder[index]}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </li>
            </ul>
          </Card>
        )
      } catch {
        return ''
      }
    }
  }, [info ? info.content : null, showCateChild])

  return (
    <div className="detail-box">
      <div className="detail-container">
        <div className="left-detail-container">{renderLContent()}</div>
        <div className="right-detail-container">{info ? showCate : null}</div>
      </div>
    </div>
  )
}

export default Judgment
