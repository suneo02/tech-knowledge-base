/**
 * jQuery 转换工具
 */

const fs = require('fs')
const path = require('path')
const dayjs = require('dayjs')
const listDetailConfig = {
  getdoublerandom: {
    rowIdx: 8,
    cmd: 'getspotcheckdetail',
    extraParams: (record, data) => {
      return {
        checkPlanNo: record.check_plan_no,
        checkTaskNo: record.check_task_no,
        companycode: data.companycode,
      }
    },
    iconNode: (ex, re) => {
      return (
        <span className="wi-btn-color expand-icon-getimpexp">
          {' '}
          <i></i>{' '}
        </span>
      )
    },
    notHorizontal: true,
    itemKey: [
      {
        title: intl('145864', '检查事项'),
        key: 0,
        dataIndex: 'check_item',
      },
      {
        title: intl('138492', '检查结果'),
        key: 1,
        dataIndex: 'check_result',
      },
    ],
    rowKey: ['check_item', 'check_result'],
  },
  getteleLics: {
    rowIdx: 4,
    cmd: 'getteleLicsdetail',
    extraParams: (record, data) => {
      return {
        detailId: record.referenceId,
        companycode: data.companycode,
      }
    },
    iconNode: (ex, re) => {
      return (
        <span className="wi-btn-color expand-icon-getimpexp">
          {' '}
          <i></i>{' '}
        </span>
      )
    },
    itemKey: [
      intl('138677', '企业名称'),
      intl('138808', '统一社会信用代码'),
      intl('451206', '法定代表人'),
      intl('205398', '许可证号'),
      intl('411695', '企业所有制性质'),
      intl('35779', '注册资本'),
      intl('205401', '注册属地'),
      intl('35776', '注册地址'),
      intl('205402', '上市情况'),
      intl('6440', '股票代码'),
      intl('205403', '许可证业务种类'),
      intl('205385', '客户服务投诉电话'),
      intl('205391', '用户投诉量'),
      intl('205404', '用户投诉回复率'),
    ],
    rowKey: [
      'corpName',
      'creditCode',
      'legalPerson',
      'licNo',
      'corpNat',
      'regCapital|formatMoney',
      'regAreaCode',
      'regAddress',
      'listed',
      'stockCode',
      'licCat',
      'complaintTel',
      'complaintNum',
      'complaintAnswer|formatPercent',
    ],
  },
  'showLandInfo-0': {
    rowIdx: 5,
    cmd: '/detail/company/getlandannsdetail',
    extraParams: (record, param) => {
      param.detailId = record.referenceId
      param.__primaryKey = param.companycode
      return param
    },
    iconNode: (ex, re) => {
      return (
        <span className="wi-btn-color expand-icon-getimpexp">
          {' '}
          <i></i>{' '}
        </span>
      )
    },
    itemKey: [
      intl('100916', '宗地编号'),
      intl('205383', '行政区'),
      intl('100868', '土地用途'),
      intl('205389', '土地面积(公顷)'),
      intl('205474', '出让年限(年)'),
      intl('205386', '成交价格(万元)'),
      intl('205473', '受让单位'),
      intl('205435', '发布机关'),
      intl('205440', '公示期'),
      intl('138908', '发布日期'),
    ],
    rowKey: [
      'landNode',
      'regionCode',
      'landUsage',
      'landHa',
      'landYeasNum',
      'dealPrice|formatMoney',
      'transferee',
      'relAgency',
      'annStart|formatTime',
      'relDate|formatTime',
    ],
    itemKey1: [
      intl('100916', '宗地编号'),
      intl('205383', '行政区'),
      intl('100868', '土地用途'),
      intl('205389', '土地面积(公顷)'),
      intl('205474', '出让年限(年)'),
      intl('205386', '成交价格(万元)'),
      intl('205473', '受让单位'),
      intl('205435', '发布机关'),
      intl('205440', '公示期'),
      intl('138908', '发布日期'),
    ],
    rowKey1: [
      'landNode',
      'regionCode',
      'landUsage',
      'landHa',
      'landYeasNum',
      'dealPrice|formatMoney',
      'transferee',
      'relAgency',
      'annStart|formatTime',
      'relDate|formatTime',
    ],
    itemKey2: [
      intl('205478', '联系单位'),
      intl('205477', '单位地址'),
      intl('16758', '邮政编码'),
      intl('10057', '联系电话'),
      intl('69149', '联系人'),
      intl('205466', '电子邮件'),
    ],
    rowKey2: ['contactOrg', 'orgAddr', 'postcode', 'contactTel', 'contactPsn', 'email'],
  },
  'showLandInfo-1': {
    rowIdx: 7,
    cmd: '/detail/company/getlandpurchasedetail',
    extraParams: (record, param) => {
      param.detailId = record.referenceId
      param.__primaryKey = param.companycode
      return param
    },
    iconNode: (ex, re) => {
      return (
        <span className="wi-btn-color expand-icon-getimpexp">
          {' '}
          <i></i>{' '}
        </span>
      )
    },
    itemKey: [
      intl('205383', '行政区'),
      intl('205491', '电子监管号'),
      intl('205389', '土地面积(公顷)'),
      intl('205462', '土地资源'),
      intl('205490', '土地来源'),
      intl('100868', '土地用途'),
      intl('205489', '土地级别'),
      intl('205488', '供地方式'),
      intl('205487', '土地使用年限(年)'),
      intl('205386', '成交价格(万元)'),
      intl('205486', '土地使用权人'),
      intl('15854', '行业分类'),
      intl('205485', '约定容积率下限'),
      intl('205484', '约定容积率上限'),
      intl('205436', '合同签订日期'),
      intl('205483', '约定交地时间'),
      intl('205482', '约定开工时间'),
      intl('205481', '约定竣工时间'),
      intl('205480', '实际开工时间'),
      intl('205479', '实际竣工时间'),
      intl('205492', '批准单位'),
    ],
    rowKey: [
      'regionCode',
      'supervisionCode',
      'landHa',
      'landRes',
      'landOrigin',
      'landUsage',
      'levelName',
      'landProvName',
      'landYearsNum',
      'dealPrice|formatMoney',
      'landUser',
      'industry',
      'volRate',
      'maxVolRate',
      'contractDate|formatTime',
      'promiseDeliverTime|formatTime',
      'promiseStartTime|formatTime',
      'promiseEndTime|formatTime',
      'realStartTime|formatTime',
      'realEndTime|formatTime',
      'approver',
    ],
  },
  'showLandInfo-2': {
    rowIdx: 7,
    cmd: '/detail/company/getlandtransdetail',
    extraParams: (record, param) => {
      param.detailId = record.referenceId
      param.__primaryKey = param.companycode
      return param
    },
    iconNode: (ex, re) => {
      return (
        <span className="wi-btn-color expand-icon-getimpexp">
          {' '}
          <i></i>{' '}
        </span>
      )
    },
    itemKey: [
      intl('205410', '宗地标识'),
      intl('100916', '宗地编号'),
      intl('205383', '行政区'),
      intl('205389', '土地面积(公顷)'),
      intl('100868', '土地用途'),
      intl('205489', '土地级别'),
      intl('205439', '原土地使用权人'),
      intl('205438', '现土地使用权人'),
      intl('206119', '土地使用权类型'),
      intl('205487', '土地使用年限(年)'),
      intl('205498', '土地利用状况'),
      intl('205463', '转让方式'),
      intl('205396', '转让价格(万元)'),
      intl('113991', '成交时间'),
    ],
    rowKey: [
      'parcelId',
      'parcelCode',
      'regionCode',
      'landHa',
      'landUsage',
      'landLvl',
      'oldUser',
      'curUser',
      'landPropRight',
      'landYearsNum',
      'landUseState',
      'transType',
      'transPrice|formatMoney',
      'dealTime|formatTime',
    ],
  },
  getdomainname: {
    rowIdx: 6,
    cmd: 'getdomaindetails',
    extraParams: (record, data) => {
      return {
        detailId: record.detailId,
        companycode: data.companycode,
      }
    },
    itemKey: [intl('303754', '网址名称'), intl('303755', '网址关键词'), intl('303736', '网址介绍')],
    rowKey: ['webName', 'webKeyword', 'webIntroduce'],
    iconNode: (ex, re) => {
      return (
        <span className="wi-btn-color expand-icon-getimpexp">
          {' '}
          <i></i>{' '}
        </span>
      )
    },
    dataCallback: (res) => {
      return res.data && res.data.length ? res.data[0] : {}
    },
  },
  'showCompanyNotice-0': {
    // 企业公示 - 股东及出资信息
    rowIdx: 4,
    cmd: 'detail/company/shareholdercontributiondetail',
    extraParams: (record, data) => {
      return {
        relatecode: record.relate_code,
        companycode: data.companycode,
        __primaryKey: data.companycode,
      }
    },
    itemKey: [
      intl('232856', '认缴出资日期'),
      intl('232857', '认缴公示日期'),
      intl('138458', '认缴出资方式'),
      intl('232858', '认缴出资金额（万元）'),
      intl('232859', '实缴出资日期'),
      intl('232860', '实缴公示日期'),
      intl('138127', '实缴出资方式'),
      intl('232861', '实缴出资金额（万元）'),
    ],
    rowKey: [
      'promise_date|formatTime',
      'promise_notice_date|formatTime',
      'promise_method',
      'promise_amount|formatMoneyComma',
      'real_date|formatTime',
      'real_notice_date|formatTime',
      'real_method',
      'real_amount|formatMoneyComma',
    ],
    iconNode: (ex, re) => {
      return (
        <span className="wi-btn-color expand-icon-getimpexp">
          {' '}
          <i></i>{' '}
        </span>
      )
    },
    dataCallback: (res) => {
      return res.data && res.data.length ? res.data[0] : {}
    },
  },
  getimpexp: {
    rowIdx: 4,
    cmd: 'detail/company/impexpdetail',
    title: <span style={{ fontSize: 'small' }}>{intl('138480', '注册信息')}</span>,
    extraParams: (record, data) => {
      return {
        companyid: data.companyid,
        detailId: record.referenceId,
        companycode: data.companycode,
      }
    },
    itemKey: [
      intl('205942', '海关注册编码'),
      intl('205420', '注册海关'),
      intl('205384', '行政地区'),
      intl('205423', '经济地区'),
      intl('205421', '经营类别'),
      intl('205424', '特殊贸易区域'),
      intl('205425', '海关注销标志'),
      intl('205426', '年报情况'),
      intl('451207', '注册日期'),
      intl('205427', '报关有效期'),
      intl('205428', '行业种类'),
      intl('205429', '跨境贸易电子商务类型'),
      intl('34947', '信用等级'),
      intl('205430', '信用信息异常情况'),
    ],
    rowKey: [
      'hsCode',
      'regCust',
      'areaName',
      'ecoName',
      'bizCatName',
      'stzName',
      'customFlag',
      'annualDesc',
      'regDate|formatTime',
      'customExpires|formatTime',
      'industry',
      'bizName',
      'creditLvlName',
      'creditEx',
    ],
    iconNode: (ex, re) => {
      return (
        <span className="wi-btn-color expand-icon-getimpexp">
          {' '}
          <i></i>{' '}
        </span>
      )
    },
    columns: [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      {
        render: (row) => {
          if (row.customExpires == '9999/12/31' || row.customExpires == '99991231') {
            return intl('40768', '长期')
          }
          if (row.customExpires) {
            return wftCommon.formatTime(row.customExpires)
          }

          return '--'
        },
      },
    ],
  },
  // showViolationsPenalties: {
  //     rowIdx: 7,
  //     cmd: '',
  //     itemKey: [intl('20528', '发生日期'), intl('138522', '文号'), intl('336174', '法规依据')],
  //     rowKey:[ 'punishDate|formatTime', 'punishDecisionNo', 'basis', ],
  //     iconNode: (ex, re)=>{
  //         return <span className="wi-btn-color expand-icon-getimpexp">  <i></i>  </span>
  //     }
  // },
  'showStockMortgage-0': {
    rowIdx: 6,
    cmd: '',
    itemKey: [
      intl('138447', '出质人'),
      intl('138446', '质权人'),
      intl('354213', '出质股权标的的企业'),
      intl('205511', '质押股数(万股)'),
      intl('35935', '最新收盘价'),
      intl('126622', '疑似平仓价'),
      intl('354233', '质押日参考市值（万元）'),
      intl('354234', '最新参考市值（万元）'),
      intl('17944', '质押起始日期'),
      intl('17942', '质押截止日期'),
      intl('8870', '解押日期'),
      intl('32903', '公告日期'),
      intl('205513', '是否股权质押回购'),
      intl('313196', '是否解押'),
      [intl('354277', '质押用途')],
      [intl('15314', '相关说明')],
    ],
    rowKey: [
      'pledger_name',
      'pledgee_name',
      'plex_name',
      'amount',
      'price',
      'closedPrice',
      '_marketValue',
      'latestMarketValue',
      'startTime',
      'endTime',
      'releaseDate',
      'announceDate',
      'isBuyback',
      'isRelease',
      '_codeOfPledge',
      'brief',
    ],
    iconNode: (ex, re) => {
      return (
        <span className="wi-btn-color expand-icon-getimpexp">
          {' '}
          <i></i>{' '}
        </span>
      )
    },
    columns: [
      null,
      null,
      null,
      {
        render: (row, txt) => {
          return wftCommon.formatMoney(txt, [4, ' '])
        },
      },
      {
        render: (row, txt) => {
          return wftCommon.formatMoney(txt, [2, ' '])
        },
      },
      {
        render: (row, txt) => {
          return wftCommon.formatMoney(txt, [4, ' '])
        },
      },
      {
        render: (row, txt) => {
          return wftCommon.formatMoney(txt, [4, ' '])
        },
      },
      {
        render: (row, txt) => {
          return wftCommon.formatMoney(txt, [4, ' '])
        },
      },
      null,
    ],
  },
  'showStockMortgage-1': {
    rowIdx: 6,
    cmd: '',
    itemKey: [
      intl('138447', '出质人'),
      intl('138446', '质权人'),
      intl('354213', '出质股权标的的企业'),
      intl('205511', '质押股数(万股)'),
      intl('35935', '最新收盘价'),
      intl('126622', '疑似平仓价'),
      intl('354233', '质押日参考市值（万元）'),
      intl('354234', '最新参考市值（万元）'),
      intl('17944', '质押起始日期'),
      intl('17942', '质押截止日期'),
      intl('8870', '解押日期'),
      intl('32903', '公告日期'),
      intl('205513', '是否股权质押回购'),
      intl('313196', '是否解押'),
      [intl('354277', '质押用途')],
      [intl('15314', '相关说明')],
    ],
    rowKey: [
      'pledger_name',
      'pledgee_name',
      'plex_name',
      'amount',
      'price',
      'closedPrice',
      '_marketValue',
      'latestMarketValue',
      'startTime',
      'endTime',
      'releaseDate',
      'announceDate',
      'isBuyback',
      'isRelease',
      '_codeOfPledge',
      'brief',
    ],
    iconNode: (ex, re) => {
      return (
        <span className="wi-btn-color expand-icon-getimpexp">
          {' '}
          <i></i>{' '}
        </span>
      )
    },
    columns: [
      null,
      null,
      null,
      {
        render: (row, txt) => {
          return wftCommon.formatMoney(txt, [4, ' '])
        },
      },
      {
        render: (row, txt) => {
          return wftCommon.formatMoney(txt, [2, ' '])
        },
      },
      {
        render: (row, txt) => {
          return wftCommon.formatMoney(txt, [4, ' '])
        },
      },
      {
        render: (row, txt) => {
          return wftCommon.formatMoney(txt, [4, ' '])
        },
      },
      {
        render: (row, txt) => {
          return wftCommon.formatMoney(txt, [4, ' '])
        },
      },
      null,
    ],
  },
  'showStockMortgage-2': {
    rowIdx: 6,
    cmd: '',
    itemKey: [
      intl('138447', '出质人'),
      intl('138446', '质权人'),
      intl('354213', '出质股权标的的企业'),
      intl('205511', '质押股数(万股)'),
      intl('35935', '最新收盘价'),
      intl('126622', '疑似平仓价'),
      intl('354233', '质押日参考市值（万元）'),
      intl('354234', '最新参考市值（万元）'),
      intl('17944', '质押起始日期'),
      intl('17942', '质押截止日期'),
      intl('8870', '解押日期'),
      intl('32903', '公告日期'),
      intl('205513', '是否股权质押回购'),
      intl('313196', '是否解押'),
      [intl('354277', '质押用途')],
      [intl('15314', '相关说明')],
    ],
    rowKey: [
      'pledger_name',
      'pledgee_name',
      'plex_name',
      'amount',
      'price',
      'closedPrice',
      '_marketValue',
      'latestMarketValue',
      'startTime',
      'endTime',
      'releaseDate',
      'announceDate',
      'isBuyback',
      'isRelease',
      '_codeOfPledge',
      'brief',
    ],
    iconNode: (ex, re) => {
      return (
        <span className="wi-btn-color expand-icon-getimpexp">
          {' '}
          <i></i>{' '}
        </span>
      )
    },
    columns: [
      null,
      null,
      null,
      {
        render: (row, txt) => {
          return wftCommon.formatMoney(txt, [4, ' '])
        },
      },
      {
        render: (row, txt) => {
          return wftCommon.formatMoney(txt, [2, ' '])
        },
      },
      {
        render: (row, txt) => {
          return wftCommon.formatMoney(txt, [4, ' '])
        },
      },
      {
        render: (row, txt) => {
          return wftCommon.formatMoney(txt, [4, ' '])
        },
      },
      {
        render: (row, txt) => {
          return wftCommon.formatMoney(txt, [4, ' '])
        },
      },
      null,
    ],
  },

  getpermission02: {
    rowIdx: 5,
    cmd: 'detail/company/getadminilicencedetail',
    itemKey: [
      intl('222773', '行政许可决定文书号'),
      intl('222813', '行政许可决定文书名称'),
      intl('222828', '许可编号'),
      intl('222830', '许可证书名称'),
      intl('222771', '许可决定日期'),
      intl('21235', '有效期'),
      intl('138377', '许可机关'),
      intl('13126', '审核类型'),
      intl('138378', '许可内容'),
    ],
    rowKey: [
      'docId',
      'docName',
      'licenceId',
      'licenceName',
      'licenceDate|formatTime',
      'startDate',
      'orgName',
      'type',
      'content',
    ],
    extraParams: (record, data) => {
      return {
        companyid: data.companyid,
        detailId: record.detailId,
        companycode: data.companycode,
      }
    },
    columns: [
      null,
      null,
      null,
      null,
      null,
      {
        render: (row) => {
          if (row.endDate == '9999/12/31' || row.endDate == '99991231') {
            return intl('40768', '长期')
          }
          if (row.startDate || row.endDate) {
            return wftCommon.formatTime(row.startDate) + intl('271245', ' 至 ') + wftCommon.formatTime(row.endDate)
          }
          return '--'
        },
      },
    ],
    // dataCallback: (res)=>{
    //     return res.data && res.data.length ? res.data[0] : {};
    // },
    iconNode: (ex, re) => {
      return (
        <span className="wi-btn-color expand-icon-getimpexp">
          {' '}
          <i></i>{' '}
        </span>
      )
    },
  },
  personCredit: {
    rowIdx: 5,
    cmd: 'detail/company/getadminilicencedetail',
    itemKey: [
      intl('222773', '行政许可决定文书号'),
      intl('222813', '行政许可决定文书名称'),
      intl('222828', '许可编号'),
      intl('222830', '许可证书名称'),
      intl('222771', '许可决定日期'),
      intl('21235', '有效期'),
      intl('138377', '许可机关'),
      intl('13126', '审核类型'),
      intl('138378', '许可内容'),
    ],
    rowKey: [
      'docId',
      'docName',
      'licenceId',
      'licenceName',
      'licenceDate|formatTime',
      'startDate',
      'orgName',
      'type',
      'content',
    ],
    extraParams: (record, data) => {
      return {
        companyid: data.companyid,
        detailId: record.detailId,
        companycode: data.companycode,
      }
    },
    columns: [
      null,
      null,
      null,
      null,
      null,
      {
        render: (row) => {
          if (row.endDate == '9999/12/31' || row.endDate == '99991231') {
            return intl('40768', '长期')
          }
          if (row.startDate || row.endDate) {
            return wftCommon.formatTime(row.startDate) + intl('271245', ' 至 ') + wftCommon.formatTime(row.endDate)
          }
          return '--'
        },
      },
    ],
    // dataCallback: (res)=>{
    //     return res.data && res.data.length ? res.data[0] : {};
    // },
    iconNode: (ex, re) => {
      return (
        <span className="wi-btn-color expand-icon-getimpexp">
          {' '}
          <i></i>{' '}
        </span>
      )
    },
  },
  getfinanciallicence: {
    rowIdx: 5,
    cmd: '', // cmd为空，直接从list中读取detail进行展示
    itemKey: [
      intl('222773', '行政许可决定文书号'),
      intl('222813', '行政许可决定文书名称'),
      intl('205398', '许可证号'),
      intl('222783', '许可证名称'),
      intl('138245', '发证日期'),
      intl('21235', '有效期'),
      intl('138143', '公示日期'),
      intl('138377', '许可机关'),
      intl('13126', '审核类型'),
      intl('138378', '许可内容'),
    ],
    rowKey: [
      'docId',
      'docName',
      'licenceId',
      'licenceName',
      'licenceDate|formatTime',
      'startDate',
      'pubDate|formatTime',
      'orgName',
      'auditType',
      'licenceContent',
    ],
    columns: [
      null,
      null,
      null,
      null,
      null,
      {
        render: (row) => {
          if (row.endDate == '9999/12/31' || row.endDate == '99991231') {
            return intl('40768', '长期')
          }
          if (row.startDate || row.endDate) {
            return wftCommon.formatTime(row.startDate) + intl('271245', ' 至 ') + wftCommon.formatTime(row.endDate)
          }
          return '--'
        },
      },
    ],
    iconNode: (ex, re) => {
      return (
        <span className="wi-btn-color expand-icon-getimpexp">
          {' '}
          <i></i>{' '}
        </span>
      )
    },
  },
  'showChattelmortgage-0': {
    rowIdx: 8,
    cmd: 'getchattlemortgagedetail',
    extraParams: (record, data) => {
      return {
        detailId: record.ob_object_id,
        companycode: data.companycode,
      }
    },
    itemKey: [
      intl('138771', '动产抵押登记编号'),
      intl('138479', '动产抵押登记日期'),
      intl('138309', '履行债务的期限'),
      intl('138391', '抵押权人'),
      intl('138425', '抵押物所有权归属'),
      intl('138331', '抵押权人证件类型'),
      intl('138334', '抵押权人证件号码'),
      intl('138617', '被担保债权数额'),
      intl('138618', '被担保债权种类'),
      intl('138781', '担保范围'),
      intl('138481', '动产抵押登记机构'),
      intl('138488', '动产抵押备注'),
      intl('138620', '抵押物描述'),
    ],
    rowKey: [
      'cm_reg_no',
      'cm_reg_date|formatTime',
      'cm_obligor_deadline|formatTime',
      'cm_mortgage_person_name',
      'cm_dpawn_owner',
      'cm_mortgage_person_card_type',
      'cm_mortgage_person_card_no',
      'cm_zq_amount|formatMoney',
      'cm_zq_type',
      'cm_guarantee_scope',
      'cm_reg_authority',
      'cm_remark',
      'dpawminfo',
    ],
    iconNode: (ex, re) => {
      return (
        <span className="wi-btn-color expand-icon-getimpexp">
          {' '}
          <i></i>{' '}
        </span>
      )
    },
  },
  'showChattelmortgage-1': {
    rowIdx: 8,
    cmd: 'getchattlemortgagedetail',
    extraParams: (record, data) => {
      return {
        detailId: record.ob_object_id,
        companycode: data.companycode,
      }
    },
    itemKey: [
      intl('138771', '动产抵押登记编号'),
      intl('138479', '动产抵押登记日期'),
      intl('138309', '履行债务的期限'),
      intl('138391', '抵押权人'),
      intl('138425', '抵押物所有权归属'),
      intl('138331', '抵押权人证件类型'),
      intl('138334', '抵押权人证件号码'),
      intl('138617', '被担保债权数额'),
      intl('138618', '被担保债权种类'),
      intl('138781', '担保范围'),
      intl('138481', '动产抵押登记机构'),
      intl('138488', '动产抵押备注'),
      intl('138620', '抵押物描述'),
    ],
    rowKey: [
      'cm_reg_no',
      'cm_reg_date|formatTime',
      'cm_obligor_deadline|formatTime',
      'cm_mortgage_person_name',
      'cm_dpawn_owner',
      'cm_mortgage_person_card_type',
      'cm_mortgage_person_card_no',
      'cm_zq_amount|formatMoney',
      'cm_zq_type',
      'cm_guarantee_scope',
      'cm_reg_authority',
      'cm_remark',
      'dpawminfo',
    ],
    iconNode: (ex, re) => {
      return (
        <span className="wi-btn-color expand-icon-getimpexp">
          {' '}
          <i></i>{' '}
        </span>
      )
    },
  },
  'historyshowChattelmortgage-0': {
    rowIdx: 8,
    cmd: 'getchattlemortgagedetail',
    extraParams: (record, data) => {
      return {
        detailId: record.ob_object_id,
        companycode: data.companycode,
      }
    },
    itemKey: [
      intl('138771', '动产抵押登记编号'),
      intl('138479', '动产抵押登记日期'),
      intl('138309', '履行债务的期限'),
      intl('138391', '抵押权人'),
      intl('138425', '抵押物所有权归属'),
      intl('138331', '抵押权人证件类型'),
      intl('138334', '抵押权人证件号码'),
      intl('138617', '被担保债权数额'),
      intl('138618', '被担保债权种类'),
      intl('138781', '担保范围'),
      intl('138481', '动产抵押登记机构'),
      intl('138488', '动产抵押备注'),
      intl('138620', '抵押物描述'),
    ],
    rowKey: [
      'cm_reg_no',
      'cm_reg_date|formatTime',
      'cm_obligor_deadline|formatTime',
      'cm_mortgage_person_name',
      'cm_dpawn_owner',
      'cm_mortgage_person_card_type',
      'cm_mortgage_person_card_no',
      'cm_zq_amount|formatMoney',
      'cm_zq_type',
      'cm_guarantee_scope',
      'cm_reg_authority',
      'cm_remark',
      'dpawminfo',
    ],
    iconNode: (ex, re) => {
      return (
        <span className="wi-btn-color expand-icon-getimpexp">
          {' '}
          <i></i>{' '}
        </span>
      )
    },
  },
  'historyshowChattelmortgage-1': {
    rowIdx: 8,
    cmd: 'getchattlemortgagedetail',
    extraParams: (record, data) => {
      return {
        detailId: record.ob_object_id,
        companycode: data.companycode,
      }
    },
    itemKey: [
      intl('138771', '动产抵押登记编号'),
      intl('138479', '动产抵押登记日期'),
      intl('138309', '履行债务的期限'),
      intl('138391', '抵押权人'),
      intl('138425', '抵押物所有权归属'),
      intl('138331', '抵押权人证件类型'),
      intl('138334', '抵押权人证件号码'),
      intl('138617', '被担保债权数额'),
      intl('138618', '被担保债权种类'),
      intl('138781', '担保范围'),
      intl('138481', '动产抵押登记机构'),
      intl('138488', '动产抵押备注'),
      intl('138620', '抵押物描述'),
    ],
    rowKey: [
      'cm_reg_no',
      'cm_reg_date|formatTime',
      'cm_obligor_deadline|formatTime',
      'cm_mortgage_person_name',
      'cm_dpawn_owner',
      'cm_mortgage_person_card_type',
      'cm_mortgage_person_card_no',
      'cm_zq_amount|formatMoney',
      'cm_zq_type',
      'cm_guarantee_scope',
      'cm_reg_authority',
      'cm_remark',
      'dpawminfo',
    ],
    iconNode: (ex, re) => {
      return (
        <span className="wi-btn-color expand-icon-getimpexp">
          {' '}
          <i></i>{' '}
        </span>
      )
    },
  },
  listInformation: {
    rowIdx: 5,
    cmd: 'detail/company/getrankedcompanydetail',
    extraParams: (record, data) => {
      return {
        option: 'detail',
        companycode: data.companycode,
        rankCode: record.rankCode,
        companyid: data.companyid,
      }
    },
    itemKey: [
      {
        title: intl('12634', '上榜日期'),
        key: 0,
        dataIndex: 'rankYear',
        render: function (data, full) {
          if (full.ratio == 6) {
            return data.substring(0, 4)
          } else if (full.ratio == 5 || full.ratio == 4 || full.ratio == 3) {
            return data.substring(0, 7)
          } else {
            return data
          }
        },
      },
      {
        title: intl('283655', '上榜名次'),
        key: 1,
        dataIndex: 'rankLevel',
      },
    ],
    rowKey: ['rankYear', 'rankLevel'],
    iconNode: (ex, re) => {
      return (
        <span className="wi-btn-color expand-icon-listInformation">
          {' '}
          <i></i>{' '}
        </span>
      )
    },
    notHorizontal: true,
  },
  hzpscxk: {
    rowIdx: 5,
    cmd: 'detail/company/CosmeticsProductionLicenseDetail',
    extraParams: (record, data) => {
      console.log('hzpscxk', record, data)
      return {
        detailId: record.seqId,
      }
    },
    itemKey: [
      intl('138677', '企业名称'),
      intl('138377', '许可机关'),
      intl('222783', '许可证名称'),
      intl('205398', '许可证号'),
      intl('368133', '许可证决定文书号'),
      intl('368113', '许可证决定文书名称'),
      intl('368134', '有效期开始日期'),
      intl('368135', '有效期截止日期'),
      intl('138245', '发证日期'),
      intl('138199', '证书状态'),
      intl('138378', '许可内容'),
    ],
    rowKey: [
      'companyName',
      'apprAuthority',
      'licenseName',
      'licenseNo',
      'licenseDocNo',
      'licenseDocName',
      'startDate',
      'endDate',
      'apprDate',
      'certificateStatus',
      'licenseContent',
    ],
    columns: [
      null,
      null,
      null,
      null,
      null,
      null,
      {
        render: (_, txt) => (txt ? wftCommon.formatTime(txt) : '--'),
      },
      {
        render: (_, txt) => (txt ? wftCommon.formatTime(txt) : '--'),
      },
      {
        render: (_, txt) => (txt ? wftCommon.formatTime(txt) : '--'),
      },
      null,
      null,
    ],
    iconNode: (ex, re) => {
      return (
        <span className="wi-btn-color expand-icon-getimpexp">
          {' '}
          <i></i>{' '}
        </span>
      )
    },
  },
  selectList: {
    rowIdx: 3,
    cmd: 'detail/company/getdirectorydetail',
    extraParams: (record, data) => {
      return {
        companycode: data.companycode,
        companyid: data.companyid,
        category: record.objectId,
      }
    },
    iconNode: (ex, re) => {
      return (
        <span className="wi-btn-color expand-icon-listInformation">
          {' '}
          <i></i>{' '}
        </span>
      )
    },
    notHorizontal: true,
  },
  gettaxcredit1: {
    rowIdx: 4,
    cmd: 'detail/company/gettaxcreditdetail',
    extraParams: (record, data) => {
      console.log(record, data)
      return {
        // companyCode: data.companycode,
        // companyName: window.__GELCOMPANYNAME__,
        // assessTime: record.assessTime,
        __primaryKey: data.companycode,
        seqIdList: record.seqIdList,
      }
    },
    itemKey: [
      {
        title: intl('138539', '纳税人识别号'),
        key: 0,
        dataIndex: 'tax_id_no',
        render: function (data, full) {
          return wftCommon.formatCont(data)
        },
      },
      {
        title: intl('138532', '税务机关'),
        key: 1,
        dataIndex: 'tax_uthority',
      },
    ],
    // itemKey: [intl('138539', '纳税人识别号'), intl('138532', '税务机关')],
    rowKey: ['tax_id_no', 'tax_uthority'],
    iconNode: (ex, re) => {
      return (
        <span className="wi-btn-color expand-icon-listInformation">
          {' '}
          <i></i>{' '}
        </span>
      )
    },
    notHorizontal: true,
  },
  showMerge: {
    rowIdx: 7,
    cmd: 'getmergerinfo',
    extraParams: (record, data) => {
      return {
        pageSize: 10,
        companycode: data.companycode,
        pageNo: 0,
        companyid: data.companyid,
      }
    },
    itemKey: [
      {
        title: intl('59999', '进展描述'),
        key: 0,
        dataIndex: 'tradeIntroduction',
        colSpan: 4,
        render: (text, row) => {
          return row[0].tradeIntroduction
        },
      },
    ],
    rowKey: ['tradeIntroduction'],
    // columns: [
    //   {
    //     render: (row, txt) => {
    //       // if(row.validDateEnd==("9999/12/31"||"99991231")){
    //       //     return intl('40768','长期')
    //       // }
    //       if (row.validDateStart || row.validDateEnd) {
    //         return wftCommon.formatTime(row.validDateStart) + intl('271245', ' 至 ') + wftCommon.formatTime(row.validDateEnd)
    //       }
    //       return '--'
    //     },
    //   },
    // ],
    iconNode: (ex, re) => {
      return (
        <span className="wi-btn-color expand-icon-showMerge">
          {' '}
          <i></i>{' '}
        </span>
      )
    },
  },
  enterpriseDevelopment: {
    rowIdx: 4,
    cmd: '', // cmd为空，直接从list中读取detail进行展示
    itemKey: [
      intl('32914', '公司名称'),
      intl('337893', '资质等级'),
      intl('337874', '资格状态'),
      intl('21235', '有效期'),
      intl('337875', '认定机关'),
      intl('32903', '公告日期'),
      intl('198902', '公告编号'),
      intl('337894', '公告事项'),
    ],
    rowKey: [
      'compName',
      'qualificationLevelName|formatCont',
      'qualificationStatusName|formatCont',
      'validDateStart',
      'certificationBody|formatCont',
      'declarationDate|formatTime',
      'noticeCode|formatCont',
      'noticeInfo|formatCont',
    ],
    columns: [
      null,
      null,
      {
        render: (row, txt, idx) => {
          if (txt) {
            return txt
          } else {
            return intl('36518', '有效')
          }
        },
      },
      {
        render: (row, txt) => {
          // if(row.validDateEnd==("9999/12/31"||"99991231")){
          //     return intl('40768','长期')
          // }
          if (row.validDateStart || row.validDateEnd) {
            return (
              wftCommon.formatTime(row.validDateStart) + intl('271245', ' 至 ') + wftCommon.formatTime(row.validDateEnd)
            )
          }
          return '--'
        },
      },
    ],
    iconNode: (ex, re) => {
      return (
        <span className="wi-btn-color expand-icon-getimpexp">
          {' '}
          <i></i>{' '}
        </span>
      )
    },
  },
  'showComBuInfo-0': {
    rowIdx: 4,
    cmd: 'getprojectsinfodetail',
    // title: <span style={{fontSize: 'small'}}>{'注册信息'}</span>,
    extraParams: (record, data) => {
      return {
        detailId: record.referenceId,
        companycode: data.companycode,
      }
    },
    iconNode: (ex, re) => {
      return (
        <span className="wi-btn-color expand-icon-getstockplexesdetail">
          {' '}
          <i></i>{' '}
        </span>
      )
    },
    itemKey: [
      intl('199999', '项目名称'),
      intl('451240', '所属领域'),
      intl('134893', '团队成员'),
      intl('206243', '项目网址'),
      intl('15431', '项目简介'),
    ],
    rowKey: ['projName', 'domain', 'members', 'corpUrl', 'projDetail'],
  },
}

console.log(listDetailConfig)
