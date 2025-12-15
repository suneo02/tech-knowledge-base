import React, { ReactNode } from 'react'
import brand120 from '../assets/imgs/logo/brand120.png'
import intl from '../utils/intl'
import { wftCommon } from '../utils/utils'
import { lawStatus } from '../views/singleDetail/patentDetail/patentConfig'
import './SearchList/index.less'

export const searchCommon = {
  allFilterAdd: (allFilter, select, value, type, multiple?) => {
    let flag = 0
    if (value) {
      for (let i = 0; i < allFilter.length; i++) {
        if (allFilter[i].type === select) {
          if (multiple) {
            allFilter[i].value = allFilter[i].value ? allFilter[i].value + '、' + value : value
          } else {
            allFilter[i].value = value
          }
          flag = 1
        }
      }
      if (!flag) {
        allFilter.push({ type: select, value: value, filter: type })
      }
    } else {
      let deleteIndex = 0
      for (let i = 0; i < allFilter.length; i++) {
        if (allFilter[i].filter == type) {
          deleteIndex = i
          flag = 1
        }
      }
      if (flag) {
        allFilter.splice(deleteIndex, 1)
      }
    }
    return allFilter
  },
  showIntelluctalBlock: (item, type) => {
    const tag = item.search_tag
    let topContent: ReactNode = ''
    let bottomContent: ReactNode = ''
    let state: ReactNode = ''
    let showTag = ''
    let title = ''
    let h5Id = ''
    let jumpUrl = ''
    let canClick = ''
    let corpUrl = ''
    let titleEnName = ''
    if (tag == '商标' || type == 'trademark_search') {
      let ImgSrc = '../assets/imgs/no_photo.png'
      const imgId = item.trademark_image ? item.trademark_image : ''
      corpUrl = wftCommon.getCompanyUrlForF9(item.applicant_ch_name_id)
      const url = corpUrl
        ? `<a href="${corpUrl}" class='underline' ${corpUrl.indexOf('CommandParam') == -1 ? 'target="blank"' : ''} > ${
            item.applicant_ch_name ? item.applicant_ch_name : '--'
          } </a>`
        : item.applicant_ch_name
          ? item.applicant_ch_name
          : '--'
      if (imgId) {
        ImgSrc = '//news.windin.com/ns/imagebase/6710/' + imgId
      }
      topContent = (
        <div className="searchpic-brand">
          <img
            onError={(e) => {
              // @ts-expect-error ttt
              e.target.src = brand120
            }}
            className="big-logo"
            width="60"
            src={wftCommon.addWsidForImg(ImgSrc)}
            data-uc-id="w6BNqeloqYP"
            data-uc-ct="img"
          />
        </div>
      )
      state = <span className="state-yes">{item.trademark_status ? item.trademark_status : '--'}</span>
      bottomContent = `<span class="searchitem-work">${intl('138156', '申请时间')}：${
        item.application_date ? wftCommon.formatTime(item.application_date) : '--'
      }</span><span class="searchitem-work">${intl('138476', '注册号')}：${
        item.application_number ? item.application_number : '--'
      }</span><br/><span class="searchitem-work">${intl('138349', '国际类别')}：${
        item.international_classification ? item.international_classification : '--'
      }</span><span class="searchitem-work">${intl('58656', '申请人')}：  ${url}   </span>`
      showTag = intl('138799', '商标')
      title = item.trademark_name ? item.trademark_name : '--'
      titleEnName = item.trademark_name_en
      h5Id = 'brandH5'
      jumpUrl = `index.html?type=brand&detailid=${item.detail_id}#/logoDetail`
    } else if (tag == '专利' || type == 'patent_search') {
      let jumpSQR = ''
      let jumpZLQR = ''
      const a = wftCommon.getPathByKey(item.lawStatus, 'code', lawStatus)
      let content = ''
      if (a && a.length > 0) {
        content = intl(a[a.length - 1].enCode, a[a.length - 1].name)
      }
      content = wftCommon.formatCont(content)
      if (item.assignee && item.assignee.length > 0) {
        for (let i = 0; i < item.assignee.length; i++) {
          if (item.assignee[i].mainBodyId) {
            corpUrl = wftCommon.getCompanyUrlForF9(item.assignee[i].mainBodyId)
            const jump = `<a class="mar-r-5 underline search-work-link" ${corpUrl.indexOf('CommandParam') == -1 ? 'target="blank"' : ''} href="${corpUrl}">${
              item.assignee[i].mainBodyName ? item.assignee[i].mainBodyName : '--'
            }</a>`
            jumpZLQR += jump
          } else {
            const jump = `<span class="mar-r-5">${item.assignee[i].mainBodyName ? item.assignee[i].mainBodyName : '--'}</span>`
            jumpZLQR += jump
          }
        }
      }
      if (item.applicant && item.applicant.length > 0) {
        for (let i = 0; i < item.applicant.length; i++) {
          if (item.applicant[i].mainBodyId) {
            corpUrl = wftCommon.getCompanyUrlForF9(item.applicant[i].mainBodyId)
            const jump = `<a class="mar-r-5 underline search-work-link" ${corpUrl.indexOf('CommandParam') == -1 ? 'target="blank"' : ''} href="${corpUrl}">${
              item.applicant[i].mainBodyName ? item.applicant[i].mainBodyName : '--'
            }</a>`
            jumpSQR += jump
          } else {
            const jump = `<span class="mar-r-5">${item.applicant[i].mainBodyName ? item.applicant[i].mainBodyName : '--'}</span>`
            jumpSQR += jump
          }
        }
      }

      jumpSQR = jumpSQR || '--'
      jumpZLQR = jumpZLQR || '--'
      bottomContent = `<span class="searchitem-work">${intl('149732', '公开公告日')}：${
        item.publicAnnouncementDate ? wftCommon.formatTime(item.publicAnnouncementDate) : '--'
      }</span><span class="searchitem-work">${intl('138169', '授权号')}：${
        item.publicAnnouncementNumber ? item.publicAnnouncementNumber : '--'
      }</span><span class="searchitem-work">${intl('138372', '法律状态')}：${item.lawStatus ? item.lawStatus : '--'}</span><br/><span class="searchitem-work">${intl(
        '138430',
        '专利类型'
      )}：${item.patentType ? item.patentType : '--'}</span><span class="searchitem-work">${intl('58656', '申请人')}：${jumpSQR}</span><span class="searchitem-work">${intl(
        '',
        intl('383123', '专利权人')
      )}：${jumpZLQR}</span>`
      showTag = intl('138749', '专利')
      title = item.patentName ? item.patentName : '--'
      titleEnName = item.patentName_en
      jumpUrl = `#/patentDetail?nosearch=1&detailId=${item.dataId}&type=${item.patentType}`
    } else if (tag == '软件著作权' || type == 'software_search') {
      let jump = ''
      corpUrl = wftCommon.getCompanyUrlForF9(item.owner_id)
      if (item.owner_id) {
        jump = corpUrl
          ? `<a href="${corpUrl}" class='underline' ${corpUrl.indexOf('CommandParam') == -1 ? 'target="blank"' : ''} > ${item.owner_name ? item.owner_name : '--'} </a>`
          : item.owner_name
            ? item.owner_name
            : '--'
      } else {
        jump = `<span>${item.owner_name ? item.owner_name : '--'}</span>`
      }
      bottomContent = `<span class="searchitem-work">${intl('138158', '登记批准日期')}：${
        item.approval_date ? wftCommon.formatTime(item.approval_date) : '--'
      }</span><span class="searchitem-work">${intl('138482', '登记号')}：${item.registration_number ? item.registration_number : '--'}</span><span class="searchitem-work">${intl(
        '138573',
        '版本号'
      )}：${item.version_number ? item.version_number : '--'}</span><br/><span class="searchitem-work">${intl('437397', '软件著作权人')}：${jump}</span>`
      showTag = intl('138788', '软件著作权')
      title = item.software_copyright_name ? item.software_copyright_name : '--'
      titleEnName = item.software_copyright_name_en
      canClick = 'no-click'
    } else if (tag == '作品著作权' || type == 'production_search') {
      const name_id = item.new_owner_name_and_id
      let person = ''
      if (name_id && name_id.length > 0) {
        for (let i = 0; i < name_id.length; i++) {
          const tmpName = name_id[i].name
          const tmpId = name_id[i].id
          if (tmpId) {
            corpUrl = wftCommon.getCompanyUrlForF9(tmpId)
            person += `<a class="mar-r-5 underline search-work-link" ${corpUrl.indexOf('CommandParam') == -1 ? 'target="blank"' : ''}  href="${corpUrl}">${
              tmpName ? tmpName : '--'
            }</a>`
          } else {
            person += `<span class="mar-r-5">${tmpName ? tmpName : '--'}</span>`
          }
        }
      }
      bottomContent = `<span class="searchitem-work">${intl('87749', '登记日期')}：${
        item.registration_date ? wftCommon.formatTime(item.registration_date) : '--'
      }</span><span class="searchitem-work">${intl('138482', '登记号')}：${
        item.registration_number ? item.registration_number : '--'
      }</span><br/><span class="searchitem-work">${intl('138195', '作品类别')}：${item.work_category ? item.work_category : '--'}</span><span class="searchitem-work">${intl(
        '437329',
        '作品著作权人'
      )}：${person}</span>`
      showTag = intl('138756', '作品著作权')
      title = item.work_title ? item.work_title : '--'
      titleEnName = item.work_title_en
      canClick = 'no-click'
    }
    return (
      <div className="div_Card" id="IntellectualCard">
        <div className="card-content">
          <div className="content-top">
            {topContent}
            <h5
              className={`searchtitle-intellectual wi-link-color ${canClick}`}
              id={h5Id}
              onClick={() => searchCommon.jumpIntelluctalDetail(type, jumpUrl)}
              data-uc-id="GhLtOeA7bLG"
              data-uc-ct="h5"
            >
              {title}
            </h5>
            {window.en_access_config && titleEnName ? (
              <div className="div_Card_name_en">
                {' '}
                <span> {titleEnName} </span> {<i>{intl('362293', '该翻译由AI提供')} </i>}{' '}
              </div>
            ) : null}
            {state}
          </div>
          <div className="content-bottom" dangerouslySetInnerHTML={{ __html: bottomContent }}></div>
        </div>
        <span className="card-tag">{showTag}</span>
      </div>
    )
  },
  jumpIntelluctalDetail: (type, url) => {
    if (type == 'patent_search') {
      wftCommon.jumpJqueryPage('index.html' + url)
    } else {
      wftCommon.jumpJqueryPage(url)
    }
  },
  showTextfromCountry: (country, item) => {
    let keyArr = []
    let valArr = []
    switch (country) {
      case 'usa':
        keyArr = [intl('2823', '成立日期'), intl('259205', '归档编号')]
        valArr = ['establish_date', 'biz_reg_no']
        break
      case 'eng':
        keyArr = [intl('2823', '成立日期'), intl('6228', '公司编号')]
        valArr = ['establish_date', 'biz_reg_no']
        break
      case 'kor':
        keyArr = [intl('2823', '成立日期'), intl('138476', '注册号')]
        valArr = ['establish_date', 'biz_reg_no']
        break
      case 'jpn':
        keyArr = [intl('2823', '成立日期'), intl('138476', '注册号'), intl('206096', '片假名')]
        valArr = ['establish_date', 'biz_reg_no', 'kata_name']
        break
      case 'deu':
        keyArr = [intl('2823', '成立日期'), intl('138476', '注册号')]
        valArr = ['establish_date', 'biz_reg_no']
        break
      case 'fra':
        keyArr = [intl('138908', '发布日期'), intl('6228', '公司编号')]
        valArr = ['establish_date', 'biz_reg_no']
        break
      // case "hkg":
      //     keyArr = [intl("138276","英文名"), intl('6228',"公司编号"), intl("138860","成立日期")];
      //     valArr = ["eng_name<br>", "biz_reg_no", "establish_date"];
      //     break;
      // case "twn":
      //     keyArr = [intl('6228',"公司编号"), intl("35779","注册资本"), intl("451206","法定代表人"), intl("138860","成立日期")];
      //     valArr = ["biz_reg_no", "capital_amount<br>", "artificial_person_name", "establish_date"];
      //     break;
      case 'sgp':
        keyArr = [intl('138908', '发布日期'), intl('138476', '注册号')]
        valArr = ['establish_date', 'biz_reg_no']
        break
      case 'ita':
        keyArr = []
        valArr = []
        break
      case 'can':
        keyArr = [intl('2823', '成立日期'), intl('6228', '公司编号')]
        valArr = ['establish_date', 'biz_reg_no']
        break
      default:
        keyArr = [intl('2823', '成立日期')]
        valArr = ['establish_date']
        break
    }
    const arr = []
    for (let i = 0; i < valArr.length; i++) {
      var isBr = false
      if (valArr[i].indexOf('<br>') > 0) {
        valArr[i] = valArr[i].replace('<br>', '')
        var isBr = true
      }
      switch (valArr[i]) {
        case 'establish_date':
          arr.push(
            "<span class='searchitem-work'>" + keyArr[i] + '：' + wftCommon.formatTime(item[valArr[i]]) + '</span>'
          )
          break
        case 'capital_amount':
          arr.push(
            "<span class='searchitem-work'>" + keyArr[i] + '：' + wftCommon.formatMoney(item[valArr[i]]) + '</span>'
          )
          break
        case 'eng_name':
          if (item[valArr[i]]) {
            arr.push(
              "<span class='searchitem-work eng_name'>" +
                keyArr[i] +
                '：' +
                wftCommon.formatCont(item[valArr[i]]) +
                '</span>'
            )
          } else {
            isBr = false
          }
          break
        default:
          arr.push(
            "<span class='searchitem-work'>" + keyArr[i] + '：' + wftCommon.formatCont(item[valArr[i]]) + '</span>'
          )
          break
      }
      if (isBr) {
        arr.push('<br/>')
      }
    }
    arr.push(
      "<br/><span class='searchitem-work'>" +
        intl('438015', '公司地址') +
        '：' +
        (item['register_address'] ? item['register_address'] : '--') +
        '</span><br/>'
    )
    return arr.join('')
  },

  searchParam: {
    intellectual_property_merge_search: intl('138649', '不限'),
    patent_search: intl('138749', '专利'),
    trademark_search: intl('138799', '商标'),
    production_search: intl('138756', '作品著作权'),
    software_search: intl('138788', '软件著作权'),
  },
  timeParam: {
    '': intl('138649', '不限'),
    '~1': intl('8900', '今天'),
    '~3': intl('228617', '3天内'),
    '~7': intl('228618', '7天内'),
    '~15': intl('228619', '15天内'),
    '~30': intl('228620', '30天内'),
  },
  jumpCompanyDetaile: (code) => {
    if (!code) return
    // code && wftCommon.linkCompany("Bu3", code)
    return '/Wind.WFC.Enterprise.Web/PC.Front/Company/Company.html?companycode=' + code
  },
  jumpOtherSearch: (prop, data) => {
    if (data == 'risk') {
      const usedInClient = wftCommon.usedInClient()
      const riskUrl = usedInClient
        ? window.location.origin + '/wind.risk.platform/index.html#/check/special/judicature'
        : '//erm.wind.com.cn/wind.risk.platform/index.html#/login'
      window.open(riskUrl)
    } else {
      prop.history.push(data + prop.history.location.search)
    }
  },
}
