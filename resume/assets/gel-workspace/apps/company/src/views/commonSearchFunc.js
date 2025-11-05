import { Tag } from '@wind/wind-ui'
import defaultCompanyImg from '../assets/imgs/default_company.png'
import brand120 from '../assets/imgs/logo/brand120.png'
import { CompanyTagArr } from '../components/company/intro/tag/TagArr'
import Collect from '../components/searchListComponents/collect'
import intl from '../utils/intl'
import { wftCommon } from '../utils/utils'
import { lawStatus } from '../views/singleDetail/patentDetail/patentConfig'
import { getCompanyStateColor } from './SearchFunc/state'
import './SearchList/index.less'
import React from 'react'
import { LinkByRowCompatibleCorpPerson } from '../components/company/link/CorpOrPersonLink'

export const searchCommon = {
  allFilterAdd: (allFilter, select, value, type, multiple) => {
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
  searchCallBack: (item, collectList) => {
    //公司搜索结果展示逻辑
    let companycode = item.corp_id ? item.corp_id : '' //companycode
    let companyid = item.corp_old_id ? item.corp_old_id.replace(/(\n)+|(\r\n)+/g, '') : '' //companyid
    let corp_name = item.corp_name ? item.corp_name.replace(/(\n)+|(\r\n)+/g, '') : '--' //企业名称

    const artificialComp = (
      <LinkByRowCompatibleCorpPerson
        className="item-person"
        classNameWithJump="underline"
        nameKey={'artificial_person_name'}
        row={item}
        idKey={'artificial_person_id'}
        typeKey={'artificial_person_type'}
      />
    )

    let register_address = item.register_address ? item.register_address.replace(/(\n)+|(\r\n)+/g, '') : '--' //注册地址
    let establish_date = item.establish_date ? wftCommon.formatTime(item.establish_date) : '--' //成立日期
    let unit = item.capital_unit ? item.capital_unit : ''
    item.register_capital = item.register_capital ? item.register_capital : item.registerCapital
    let register_capital = item.register_capital ? wftCommon.formatMoney(item.register_capital) + unit : '--' //注册资本
    let industry_name = item.industry_name ? item.industry_name : '--' //所属行业
    let companystate = item.status_after ? item.status_after : ''
    let logo = item.logo ? item.logo : ''
    let stateColor = 'state'

    let highTitle = ''
    let highLitKey = '--'
    let highLight = '--'
    let highLightId = ''
    if (item.highlight) {
      highLitKey = Object.keys(item.highlight)[0]
      if (Object.keys(item.highlight).length == 1 && highLitKey == 'corp_name') {
        item.highlight = null
        highLitKey = '--'
      } else {
        let highLightStr = (highLight = item.highlight[highLitKey] ? item.highlight[highLitKey] : '--')
        if (highLightStr.split('|').length > 1) {
          highLightStr = highLightStr.replace(/<em>|<\/em>/g, '')
          let highLightTemp = highLightStr.split('|')[0]
          let hithLightTempArr = highLightTemp.split('^')
          let newArr = []
          for (let k = 0; k < hithLightTempArr.length; k++) {
            newArr.push(hithLightTempArr[k])
          }
          let newArrStr = newArr.join(' ')
          highLightId = highLightStr.split('|')[1]
          if (highLightId.indexOf('XXXXXX') < 0) {
            highLight = newArrStr
            // highLight = <a className="wi-secondary-color" target="_blank" href={`Person.html?id=${highLightId}'&name=${newArrStr}`}>{newArrStr}</a>;
          } else {
            highLightId = ''
            highLight = <em className="hightlight-color">{newArrStr}</em>
          }
        } else {
          let hithLightTempArr = highLightStr.split('^')
          let newArr = []
          for (let k = 0; k < hithLightTempArr.length; k++) {
            if (/<em>/.test(hithLightTempArr[k])) {
              newArr.push(hithLightTempArr[k])
            }
          }
          let newArrStr = newArr.join(', ')
          if (newArrStr.indexOf('<em') > -1 && newArrStr.indexOf('</em>') > -1) {
            newArrStr = newArrStr.replace(/<em/g, '<em class="hightlight-color"')
          }
          highLight = newArrStr
        }
      }
    }
    if (corp_name.indexOf('<em') > -1 && corp_name.indexOf('</em>') > -1) {
      corp_name = corp_name.replace(/<em/g, '<em class="hightlight-color"')
    }
    switch (highLitKey) {
      case 'artificial_person':
        highTitle = intl('138733', '法人')
        break
      case 'stockname':
        highTitle = intl('451227', '股票简称')
        break
      case 'stockcode':
        highTitle = intl('6440', '股票代码')
        break
      case 'bond_name':
        highTitle = intl('437741', '债券名称')
        break
      case 'bond_code':
        highTitle = intl('437814', '债券代码')
        break
      case 'bond_wind_code':
        highTitle = intl('437742', '债券万得代码')
        break
      case 'fund_name':
        highTitle = intl('7996', '基金名称')
        break
      case 'fund_code':
        highTitle = intl('20591', '基金代码')
        break
      case 'fund_wind_code':
        highTitle = intl('437743', '基金万得代码')
        break
      case 'brand_name2':
        highTitle = intl('437733', '品牌')
        break
      case 'brand_name2_english':
        highTitle = intl('437757', '品牌英文名')
        break
      case 'financing_institution':
        highTitle = intl('14391', '投资方')
        break
      case 'project_name':
        highTitle = intl('34886', '项目名称')
        break
      case 'beneficiaries':
        highTitle = intl('138180', '最终受益人')
        break
      case 'corp_members':
        highTitle = intl('437729', '主要成员')
        break
      case 'stockholder_people':
        highTitle = intl('32959', '股东')
        break
      case 'eng_name':
        highTitle = intl('315688', '企业英文名')
        break
      case 'tel':
        highTitle = intl('4944', '电话')
        break
      case 'mail':
        highTitle = intl('93833', '邮箱')
        break
      case 'brand_name':
        highTitle = intl('138798', '商标名称')
        break
      case 'product_name':
        highTitle = intl('2485', '产品名称')
        break
      case 'main_business':
        highTitle = intl('138753', '主营构成')
        break
      case 'software_copyright':
        highTitle = intl('138788', '软件著作权')
        break
      case 'park_name':
        highTitle = intl('437758', '园区名')
        break
      case 'wechat_name':
        highTitle = intl('222848', '微信公众号名称')
        break
      case 'wechat_code':
        highTitle = intl('437759', '微信公众号号码')
        break
      case 'website_name':
        highTitle = intl('138578', '网站名称')
        break
      case 'goods':
        highTitle = intl('138669', '商品/服务项目')
        break
      case 'online_load_product':
        highTitle = intl('222850', '网贷产品名')
        break
      case 'patent':
        highTitle = intl('138749', '专利')
        break
      case 'former_name':
        highTitle = intl('416849', '企业曾用名')
        break
      case 'corp_short_name':
        highTitle = intl('437731', '公司简称')
        break
      case 'register_address':
        highTitle = intl('35776', '注册地址')
        break
      case 'credit_code':
        highTitle = intl('138808', '统一社会信用代码')
        break
      default:
        highTitle = ''
        break
    }

    stateColor = getCompanyStateColor(companystate)
    let isIpo = ''
    let ipoCodeStr = ''

    // TODO 这里似乎有问题 拿到的始终是 undefined
    let dataFrom = wftCommon.corpFroms[item.data_from]

    let region = item.region ? item.region.split(' ') : null
    let corpType = item.corp_type ? item.corp_type : wftCommon.corpFroms[item.data_from]
    let valueDic = {} //用来存储div块的展示值
    valueDic['isIpo'] = isIpo
    valueDic['companycode'] = companycode
    valueDic['companyid'] = companyid
    valueDic['corp_name'] = corp_name
    valueDic['stateColor'] = stateColor
    valueDic['logo'] = logo
    valueDic['stateStr'] = companystate
    valueDic['ipoCodeStr'] = ipoCodeStr
    valueDic['register_address'] = register_address
    valueDic['highlight'] = item.highlight
    valueDic['highTitle'] = highTitle
    valueDic['highLight'] = highLight
    valueDic['industry_name'] = industry_name
    valueDic['register_capital'] = register_capital
    valueDic['artificial_str'] = artificialComp
    valueDic['establish_date'] = establish_date
    valueDic['corporation_tags3'] = item.corporation_tags3
    valueDic['biz_reg_no'] = item.biz_reg_no ? item.biz_reg_no : '--'
    valueDic['is_mycustomer'] = item.is_mycustomer
    valueDic['AI_trans_flag'] = item.AI_trans_flag || false
    valueDic['corp_name_english'] = item.corp_name_english || ''
    return searchCommon.showSearchBlock(valueDic, dataFrom, region, corpType, collectList)
  },
  showSearchBlock: (valueDic, dataFrom, region, corpType, collectList) => {
    //公司搜索结果卡片展示
    let ZFlist = ['党', '军', '政府机构', '人大', '政协', '法院', '检察院', '共青团', '主席', '民主党派', '人民团体']
    let companyType = ''
    let companyLabel = ''
    let labelState = ''
    let tag = valueDic.corporation_tags3
    let divChannel = (
      <div className="each-searchlist-item">
        {intl('5541', '法人代表')}：{valueDic.artificial_str}
        <span className="item-industry">
          {intl('31801', '行业')}：{valueDic.industry_name}
        </span>
        <span className="item-capital">
          {intl('35779', '注册资本')}：{valueDic.register_capital || valueDic.registerCapital}
        </span>
        <span className="item-date">
          {intl('2823', '成立日期')}：{valueDic.establish_date}
        </span>
        <br />
        <span className="item-address">
          {intl('19414', '地址')}：
          <a
            className="go2DgovMap underline"
            target="_blank"
            href={wftCommon.jumpMap(valueDic.companycode)}
            rel="noreferrer"
          >
            {valueDic.register_address}
          </a>
        </span>
        {valueDic.highlight ? (
          <span className="item-hightlight">
            {valueDic.highTitle}：<span dangerouslySetInnerHTML={{ __html: valueDic.highLight }}></span>
          </span>
        ) : null}
      </div>
    )
    if (region instanceof Array) region = region[0]
    if (dataFrom === '香港注册企业') {
      companyType = 'hkg'
      companyLabel = '' + intl('145882', '中国香港企业')
      divChannel = (
        <div className="each-searchlist-item">
          <span className="item-capital">
            {intl('6228', '公司编号')}：{valueDic.biz_reg_no}
          </span>
          <span className="item-date">
            {intl('2823', '成立日期')}：{valueDic.establish_date}
          </span>
          <br />
          <span className="item-address">
            {intl('19414', '地址')}：
            <a
              className="go2DgovMap underline"
              target="_blank"
              href={wftCommon.jumpMap(valueDic.companycode)}
              rel="noreferrer"
            >
              {valueDic.register_address}
            </a>
          </span>
          {valueDic.highlight ? (
            <span className="item-hightlight">
              {valueDic.highTitle}：<span dangerouslySetInnerHTML={{ __html: valueDic.highLight }}></span>
            </span>
          ) : null}
        </div>
      )
      labelState = 'company-state-hk'
    } else if (region && region.indexOf('台湾地区') != -1) {
      companyType = 'twn'
      companyLabel = '' + intl('224478', '中国台湾企业')
      divChannel = (
        <div className="each-searchlist-item">
          {intl('', '代表人')}：{valueDic.artificial_str}
          <span className="item-capital">
            {intl('6228', '公司编号')}：{valueDic.biz_reg_no}
          </span>
          <span className="item-capital">
            {intl('35779', '注册资本')}：{valueDic.register_capital || valueDic.registerCapital}
          </span>
          <span className="item-date">
            {intl('2823', '成立日期')}：{valueDic.establish_date}
          </span>
          <br />
          <span className="item-address">
            {intl('35776', '注册地址')}：
            <a
              className="go2DgovMap underline"
              target="_blank"
              href={wftCommon.jumpMap(valueDic.companycode)}
              rel="noreferrer"
            >
              {valueDic.register_address}
            </a>
          </span>
          {valueDic.highlight ? (
            <span className="item-hightlight">
              {valueDic.highTitle}：<span dangerouslySetInnerHTML={{ __html: valueDic.highLight }}></span>
            </span>
          ) : null}
        </div>
      )
      labelState = 'company-state-twn'
    } else if (dataFrom === '社会组织') {
      companyType = 'sh'
      companyLabel = '' + corpType
      divChannel = (
        <div className="each-searchlist-item">
          {intl('5541', '法人代表')}：{valueDic.artificial_str}
          <span className="item-capital">
            {intl('35779', '注册资本')}：{valueDic.register_capital || valueDic.registerCapital}
          </span>
          <span className="item-date">
            {intl('207784', '成立登记日期')}：{valueDic.establish_date}
          </span>
          <br />
          <span className="item-address">
            {intl('207785', '住所')}：
            <a
              className="go2DgovMap underline"
              target="_blank"
              href={wftCommon.jumpMap(valueDic.companycode)}
              rel="noreferrer"
            >
              {valueDic.register_address}
            </a>
          </span>
          {valueDic.highlight ? (
            <span className="item-hightlight">
              {valueDic.highTitle}：<span dangerouslySetInnerHTML={{ __html: valueDic.highLight }}></span>
            </span>
          ) : null}
        </div>
      )
      labelState = 'company-state-sh'
    } else if (dataFrom === '律所') {
      companyType = 'lo'
      companyLabel = '律所'
      divChannel = (
        <div className="each-searchlist-item">
          {intl('139921', '负责人')}：{valueDic.artificial_str}
          <span className="item-capital">
            {intl('35779', '注册资本')}：{valueDic.register_capital || valueDic.registerCapital}
          </span>
          <span className="item-date">
            {intl('2823', '成立日期')}：{valueDic.establish_date}
          </span>
          <br />
          <span className="item-address">
            {intl('19414', '地址')}：
            <a
              className="go2DgovMap underline"
              target="_blank"
              href={wftCommon.jumpMap(valueDic.companycode)}
              rel="noreferrer"
            >
              {valueDic.register_address}
            </a>
          </span>
          {valueDic.highlight ? (
            <span className="item-hightlight">
              {valueDic.highTitle}：<span dangerouslySetInnerHTML={{ __html: valueDic.highLight }}></span>
            </span>
          ) : null}
        </div>
      )
      labelState = 'company-state-hk'
    } else if (dataFrom === '事业单位') {
      companyType = 'sy'
      companyLabel = '事业单位'
      divChannel = (
        <div className="each-searchlist-item">
          {intl('139921', '负责人')}：{valueDic.artificial_str}
          <span className="item-capital">
            {intl('207786', '开办资金')}：{valueDic.register_capital}
          </span>
          <br />
          <span className="item-address">
            {intl('207785', '住所')}：
            <a
              className="go2DgovMap underline"
              target="_blank"
              href={wftCommon.jumpMap(valueDic.companycode)}
              rel="noreferrer"
            >
              {valueDic.register_address}
            </a>
          </span>
          {valueDic.highlight ? (
            <span className="item-hightlight">
              {valueDic.highTitle}：<span dangerouslySetInnerHTML={{ __html: valueDic.highLight }}></span>
            </span>
          ) : null}
        </div>
      )
      labelState = 'company-state-sy'
    } else if (ZFlist.indexOf(dataFrom) > -1) {
      //政府机构
      companyType = 'zf'
      companyLabel = '' + dataFrom
      divChannel = (
        <div className="each-searchlist-item">
          <span className="item-address">
            {intl('1588', '办公地址')}：
            <a
              className="go2DgovMap underline"
              target="_blank"
              href={wftCommon.jumpMap(valueDic.companycode)}
              rel="noreferrer"
            >
              {valueDic.register_address}
            </a>
          </span>
          {valueDic.highlight ? (
            <span className="item-hightlight">
              {valueDic.highTitle}：<span dangerouslySetInnerHTML={{ __html: valueDic.highLight }}></span>
            </span>
          ) : null}
        </div>
      )
      labelState = 'company-state-hk'
    }
    var corpEnName = valueDic.corp_name_english || ''
    var corpEnNameFromAi = valueDic.AI_trans_flag || false
    return (
      <div className="div_Card">
        <div className="div_Card_left">
          <div className="div_Card_left_top">
            <div className="div_logo">
              <img
                width="66"
                className="div_Card_left_logo"
                src={wftCommon.getlogoAccess(valueDic.logo, '', 6683)}
                onError={(e) => {
                  e.target.src = defaultCompanyImg
                }}
              />
            </div>
            <h4>
              <span
                className="div_Card_name"
                dangerouslySetInnerHTML={{ __html: valueDic.corp_name }}
                onClick={() => valueDic.companycode && wftCommon.linkCompany('Bu3', valueDic.companycode)}
              ></span>

              {window.en_access_config && corpEnName ? (
                <div className="div_Card_name_en">
                  {' '}
                  <span> {corpEnName} </span>{' '}
                  {corpEnNameFromAi ? <i>{intl('362293', '该翻译由AI提供')} </i> : null}{' '}
                </div>
              ) : null}
            </h4>

            <div className="item-list item-list-corp">
              {valueDic.stateStr ? (
                <Tag color={valueDic.stateColor} type="primary">
                  {valueDic.stateStr}
                </Tag>
              ) : null}
              {labelState ? <span className={`item-tag-list ${labelState}`}>{companyLabel}</span> : null}
              {tag ? tag.map((item) => searchCommon.showTag(item)) : null}
            </div>
          </div>
          {divChannel}
          <div className="list-opeation">
            <Collect state={valueDic.is_mycustomer} list={collectList} code={valueDic.companycode} />
          </div>
        </div>
      </div>
    )
  },
  /**
   *
   * @param {*} tagItem  该参数为 单个 tag CompanyTagArr 为多个 tag
   * @returns
   */
  showTag: (tagItem) => {
    return <CompanyTagArr tagArr={[tagItem]} size="small" />
  },
  showIntelluctalBlock: (item, type) => {
    let tag = item.search_tag
    let topContent = ''
    let bottomContent = ''
    let state = ''
    let showTag = ''
    let title = ''
    let h5Id = ''
    let jumpUrl = ''
    let canClick = ''
    let assigneeList = ''
    let corpUrl = ''
    let titleEnName = ''
    if (tag == '商标' || type == 'trademark_search') {
      let ImgSrc = '../assets/imgs/no_photo.png'
      let imgId = item.trademark_image ? item.trademark_image : ''
      corpUrl = wftCommon.getCompanyUrlForF9(item.applicant_ch_name_id)
      let url = corpUrl
        ? `<a href="${corpUrl}" class='underline' ${corpUrl.indexOf('CommandParam') == '-1' ? 'target="blank"' : ''} > ${
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
              e.target.src = brand120
            }}
            className="big-logo"
            width="60"
            src={wftCommon.addWsidForImg(ImgSrc)}
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
      let a = wftCommon.getPathByKey(item.lawStatus, 'code', lawStatus)
      let content = ''
      if (a && a.length > 0) {
        content = intl(a[a.length - 1].enCode, a[a.length - 1].name)
      }
      content = wftCommon.formatCont(content)
      if (item.assignee && item.assignee.length > 0) {
        for (let i = 0; i < item.assignee.length; i++) {
          if (item.assignee[i].mainBodyId) {
            corpUrl = wftCommon.getCompanyUrlForF9(item.assignee[i].mainBodyId)
            let jump = `<a class="mar-r-5 underline search-work-link" ${corpUrl.indexOf('CommandParam') == '-1' ? 'target="blank"' : ''} href="${corpUrl}">${
              item.assignee[i].mainBodyName ? item.assignee[i].mainBodyName : '--'
            }</a>`
            jumpZLQR += jump
          } else {
            let jump = `<span class="mar-r-5">${item.assignee[i].mainBodyName ? item.assignee[i].mainBodyName : '--'}</span>`
            jumpZLQR += jump
          }
        }
      }
      if (item.applicant && item.applicant.length > 0) {
        for (let i = 0; i < item.applicant.length; i++) {
          if (item.applicant[i].mainBodyId) {
            corpUrl = wftCommon.getCompanyUrlForF9(item.applicant[i].mainBodyId)
            let jump = `<a class="mar-r-5 underline search-work-link" ${corpUrl.indexOf('CommandParam') == '-1' ? 'target="blank"' : ''} href="${corpUrl}">${
              item.applicant[i].mainBodyName ? item.applicant[i].mainBodyName : '--'
            }</a>`
            jumpSQR += jump
          } else {
            let jump = `<span class="mar-r-5">${item.applicant[i].mainBodyName ? item.applicant[i].mainBodyName : '--'}</span>`
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
          ? `<a href="${corpUrl}" class='underline' ${corpUrl.indexOf('CommandParam') == '-1' ? 'target="blank"' : ''} > ${item.owner_name ? item.owner_name : '--'} </a>`
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
      let name_id = item.new_owner_name_and_id
      let person = ''
      if (name_id && name_id.length > 0) {
        for (let i = 0; i < name_id.length; i++) {
          let tmpName = name_id[i].name
          let tmpId = name_id[i].id
          if (tmpId) {
            corpUrl = wftCommon.getCompanyUrlForF9(tmpId)
            person += `<a class="mar-r-5 underline search-work-link" ${corpUrl.indexOf('CommandParam') == '-1' ? 'target="blank"' : ''}  href="${corpUrl}">${
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
    let arr = []
    for (var i = 0; i < valArr.length; i++) {
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
      let usedInClient = wftCommon.usedInClient()
      let riskUrl = usedInClient
        ? window.location.origin + '/wind.risk.platform/index.html#/check/special/judicature'
        : '//erm.wind.com.cn/wind.risk.platform/index.html#/login'
      window.open(riskUrl)
    } else {
      prop.history.push(data + prop.history.location.search)
    }
  },
}
