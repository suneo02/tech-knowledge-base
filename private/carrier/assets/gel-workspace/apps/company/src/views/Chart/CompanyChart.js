import intl from '../../utils/intl'
import { wftCommon as Common } from '../../utils/utils'
import { myWfcAjax as JQMyWfcAjax } from '../../api/companyApi'
import { VipPopup } from '../../lib/globalModal'
import { pointBuriedByModule } from '../../api/pointBuried/bury'

var d3 = window.d3
var layer = window.layer
let global_isRelease = !Common.isDevDebugger()
let $

export function myWfcAjax(cmd, data, successFun, errorFun) {
  cmd = data?.restfulApi || cmd
  return JQMyWfcAjax(cmd, { noForbiddenWarning: true, ...data })
    .then(successFun)
    .catch(errorFun)
}

let CompanyChart = {
  companyName: decodeURI(Common.getUrlSearch('companyname')) || '--',
  companyCode: Common.getUrlSearch('companycode') || '--',
  companyId: Common.getUrlSearch('companyid') || '--',
  _corpListParams: {},
  chartSearch: null, // 选中的Tab页签对应的浏览器hash值
  chartFromLink: false, // 是否来自外部链接
  chartForF9: false, // 是否f9链接
  chartHeaderHeight: 0, // 图标顶部区域高度
  chartSelect: null, // 记录选中的Tab页签
  rootData: null, // 图表初始数据
  container: null, // d3绘制的图表对应的container元素
  zoom: null, // 记录d3实例zoom事件委托
  svg: null, // d3绘制的图标对应的svg元素
  imgServerIp: 'wx.wind.com.cn',
  cyInstance: null,
  /**
   * 对应的页签Tab，及其点击事件回调
   */
  tabs: {
    linkDWTZ: {
      fun: 'loadDWTZ',
    },
    linkNewGQJG: {
      fun: 'loadNewGQJG',
    },
    linkNewGQCT: {
      fun: 'loadDefaultGQCT',
    },
    linkYSGX: {
      fun: 'loadYSGX',
    },
    linkRZLC: {
      fun: 'loadRZLC',
    },
    linkRZTP: {
      fun: 'loadRZTP',
    },
  },

  /**
   * 对应的页签Tab与对应的hash值绑定关系
   */
  tabsHash: {
    chart_rzlc: {
      idx: 5,
      fun: 'loadRZLC',
    },
    chart_rztp: {
      idx: 6,
      fun: 'loadRZTP',
    },
    chart_ysgx: {
      idx: 7,
      fun: 'loadYSGX',
    },
    chart_dwtz: {
      idx: 15,
      fun: 'loadDWTZ',
    },
    chart_newgqct: {
      idx: 16,
      fun: 'loadDefaultGQCT',
    },
  },

  init: function (chartSearch, companyInfo) {
    if (window.en_access_config) {
      Common.en_access_config = true
    }
    console.log('🚀 ~Common.importExternalScript ~ chartSearch,companyInfo:', chartSearch, companyInfo)
    Common.importExternalScript('./jquery.js').then(() => {
      $ = window.$
      Common.importExternalScript('./layer.js').then(() => {
        layer = window.layer
        CompanyChart.corpTypes = null
        CompanyChart.initFn(chartSearch, companyInfo)
      })
    })
  },

  initFn: function (chartSearch, companyInfo) {
    var { companyName, companyId } = companyInfo
    CompanyChart.companyName = companyName
    CompanyChart.companyNameCN = companyName
    CompanyChart.companyId = companyId
    CompanyChart.companyCode = companyId
    window._CompanyChart = window._CompanyChart || CompanyChart

    var self = this
    var idx = 0
    self.chartSearch = chartSearch

    idx = self.tabsHash[self.chartSearch].idx
    self.chartSelect = $('.nav-tabs').find('.nav-block').eq(idx)
    self.chartSelect.addClass('active')
    $(self.chartSelect).find('.menu-title-underline').addClass('wi-secondary-bg')

    if (CompanyChart.companyCode.length == 15) {
      CompanyChart.companyCode = CompanyChart.companyCode.substr(2, 10)
    }

    setTimeout(function () {
      var pls =
        intl('138677', '企业名称') +
        '、' +
        intl('138733', '法人') +
        '、' +
        intl('32959', '股东') +
        '、' +
        intl('437729', '主要成员') +
        '、' +
        intl('138799', '商标')
      $('.input-toolbar-search').attr('placeholder', pls)
      $('#inputSearchRelation02').attr('placeholder', intl('225183', '请输入公司名称'))
    }, 100)
    if (Common.en_access_config) {
      $('#linkTZCT').text('Invest Penetration')
    }

    self.chartFromLink = self.isFromLink() // 来自外部链接
    self.chartForF9 = self.chartFromLink ? self.isFromF9() : false
    if (!self.chartFromLink) {
      if (!Common.isNoToolbar()) {
        $('.toolbar').show()
      }
      $('#mainNav').show()
    } else {
      $('.wrapper').addClass('noPaddingTop')
      $('.content').height('calc(100vh - 10px)')
      $('#companyChart').height('calc(100vh - 10px)')
    }

    self.chartHeaderHeight =
      ($('.toolbar').length ? $('.toolbar')[0].clientHeight : 0) +
      ($('#mainNav').length ? $('#mainNav')[0].clientHeight : 0) +
      40

    // 绘图
    function pageCall(chartSearch) {
      if (chartSearch !== 'chart_rzlc' && chartSearch !== 'chart_newgqjg') {
        if (chartSearch == 'chart_ysgx') {
          Common.importExternalScript('./cytoscape.min.js').then(() => {
            console.warn('import $ success')
            self[self.tabsHash[chartSearch].fun]('1')
          })
        } else {
          if (!self.tabsHash[chartSearch]) {
            chartSearch = 'chart_gqct'
          }
          self[self.tabsHash[chartSearch].fun]()
        }
        idx = self.tabsHash[chartSearch].idx
        self.chartSelect = $('.nav-tabs').find('.nav-block').eq(idx)
        self.chartSelect.addClass('active')
        $(self.chartSelect).find('.menu-title-underline').addClass('wi-secondary-bg')
      } else {
        self[self.tabsHash[chartSearch].fun]()
      }
    }

    if (Common.is_vip_config || Common.is_svip_config) {
      pageCall(self.chartSearch)
    } else {
      setTimeout(function () {
        pageCall(self.chartSearch)
      }, 500)
    }

    /**
     * 菜单切换
     */
    $('.nav-tabs').on('click', '.nav-block', function (e) {
      // 事件锁
      if ($('#load_data').attr('style').indexOf('block') > -1) {
        return false
      }
      var eles = $('.chart-nav').find('button')
      Array.prototype.forEach.call(eles, function (e) {
        if (!$(e).hasClass('wi-secondary-bg')) {
          $(e).addClass('wi-secondary-bg')
        }
      })
      $('#rContent').find('.syr-type-content').remove()
      $('#rContent').find('.glgx-type-content').remove()
      $('.chart-yskzr').hide() // 疑似实际控制人内容
      $('#companyChart').empty() // 节点清空
      $('#no_data').hide() // 暂无数据
      $('#load_data').show() // 加载中
      $('#companyChart').attr('class', '') // 样式清空
      $('#rContent').removeClass('has-nav')
      $('#toolNav').remove()
      $('#gqjg_title').remove()
      if (CompanyChart.cyInstance) {
        CompanyChart.cyInstance.destroy()
        CompanyChart.cyInstance = null
      }
      if (self.chartSelect) {
        $(self.chartSelect).removeClass('active')
        $(self.chartSelect).find('.menu-title-underline').removeClass('wi-secondary-bg')
      }
      self.chartSelect = $(e.target).closest('.nav-block')
      self.chartSelect.addClass('active')
      $(self.chartSelect).find('.menu-title-underline').addClass('wi-secondary-bg')
      var id = self.chartSelect.find('a').attr('id')
      self.chartSearch = self.chartSelect.find('a').attr('href').split('#')[1]
      if (CompanyChart.gqctParams) CompanyChart.gqctParams.type = 'root'
      if (id == 'linkYSGX') {
        self[self.tabs[id].fun]('1')
      } else if (id == 'linkQYSYR') {
        if (!window.echarts) {
        }
        self[self.tabs[id].fun]()
      } else {
        if (!window.d3) {
          Common.loadJS('../resource/js/d3.min.js', function () {
            self[self.tabs[id].fun]()
          })
          return
        }
        self[self.tabs[id].fun]()
      }
    })

    /**
     * 搜索
     */
    $('.input-toolbar-button').click(function (event) {
      //搜索按钮
      var keyword = $('.input-toolbar-search').val()
      if (keyword && keyword.trim()) {
        window.location.href = 'SearchHomeList.html?keyword=' + keyword
      }
    })

    $('.menu-relation span').on('click', function (e) {
      var str = ''
      str = 'lc=' + CompanyChart.companyCode
      str = str + ('&lcn=' + CompanyChart.companyName)
      var id = $(e.target).attr('id')
      if (id == 'linkToIpo') {
        window.open('ChartIpo.html?' + str)
      } else {
        window.open('ChartPlatForm.html?' + str)
      }
    })

    // 隐藏导航栏
    var nonavtabs = decodeURI(Common.getUrlSearch('nonavtabs'))
    if (nonavtabs) {
      $('.nav-tabs').hide()
      $('.nav-company-name').addClass('wind-gel-nonavtabs')
    }

    var notoolbar = decodeURI(Common.getUrlSearch('notoolbar'))
    if (notoolbar) {
      if (!$('body').hasClass('wind-gel-notoolbar')) {
        $('body').addClass('wind-gel-notoolbar')
      }
    }
  },
  //融资图谱
  loadRZTP: function () {
    //$('#load_data').show();
    var CompanyId = CompanyChart.companyCode
    if (CompanyId && CompanyId.length) {
      if (CompanyId.length == 15) {
        CompanyId = CompanyId.slice(2, 12)
      }
    }
    $('#rContent').find('#toolNav').remove()
    $('#rContent').append('<div id="toolNav"></div>')
    $('#rContent').find('#toolNav').append('<style>.mao-screen-area{margin-left:10px;}</style>')
    var origin = global_isRelease ? '//RiskWebServer' : '//wx.wind.com.cn'
    var hrefStr = origin + '/wind.risk.platform/index.html?from=GEL&CompanyId=' + CompanyId + '#/financeMap'
    $('#companyChart')
      .empty()
      .html('<iframe scrolling="no" src="' + hrefStr + '" frameborder="0" class="companyChartFrame"></iframe>')
    $('#companyChart').find('iframe')[0].onload = function () {
      $('#load_data').hide()
    }
  },
  // 疑似关系
  // fromFilter, 来自过滤区域点击
  loadYSGX: function (lev, checked, fromFilter) {
    pointBuriedByModule(922602100363)
    //疑似关系图谱的数据读取
    var param = {
      companyCode: CompanyChart.companyCode,
      companyName: CompanyChart.companyName,
    }

    $('#load_data').show()
    var htmlArr = []
    $('#rContent').find('#toolNav').remove()
    htmlArr.push('<div id="toolNav">')
    htmlArr.push('<style> .has-nav .mao-screen-area{margin-right:-270px}; </style>')
    htmlArr.push(
      '<div class="chart-example"><span><i></i>' +
        intl('437670', '当前探查') +
        '</span><span><i></i>' +
        intl('138750', '自然人') +
        '</span><span><i></i>' +
        intl('138835', '企业') +
        '</span><span><i></i>' +
        intl('258784', '上市') +
        '</span><span><i></i>' +
        intl('437678', '发债') +
        '</span></div>'
    )
    htmlArr.push('<div class="chart-toolbar" style="display:block;">')
    htmlArr.push('<ul class="wi-secondary-color">')
    htmlArr.push(
      '<li class="chart-header-rate chart-header-rate-other" style="display:none" data-hide="1" data-bury="attrYsgxBury"><span>' +
        '无关联' +
        '</span></li>'
    )
    htmlArr.push('<li class="chart-header-save" data-bury="ysgxSaveBury"><span></span></li>')
    htmlArr.push('<li class="chart-header-reload" data-bury="ysgxReloadBury"><span></span></li>')
    htmlArr.push('</ul></div>')
    $('.loading-failed').remove()
    $('#rContent').find('.chart-nav').remove()
    // 过滤条件
    htmlArr.push('<div class="chart-nav">')
    htmlArr.push(
      '<div class="chart-nav-second"><div class="chart-nav-title">' +
        intl('6672', '关联关系') +
        '</div><button class="chart-nav-btn wi-secondary-bg" data-all="1" data-key="all" >' +
        intl('19498', '全部') +
        '</button><button class="chart-nav-btn " data-key="legalrep">' +
        intl('138733', '法人') +
        '</button><button class="chart-nav-btn " data-key="member">' +
        intl('64504', '高管') +
        '</button><button class="chart-nav-btn " data-key="investctrl">' +
        intl('437677', '对外控股') +
        '</button><button class="chart-nav-btn " data-key="invest">' +
        intl('138724', '对外投资') +
        '</button><button class="chart-nav-btn " data-key="actctrl">' +
        intl('138125', '实际控制') +
        '</button><button class="chart-nav-btn " data-key="branch">' +
        intl('138183', '分支机构') +
        '</button><button class="chart-nav-btn " style="display:none;" data-key="relativeperson">' +
        '亲属' +
        '</button><button style="display:none;" class="chart-nav-btn " data-key="classmate">' +
        '同学' +
        '</button></div>'
    )
    htmlArr.push(
      '<div class="chart-nav-first"><div class="chart-nav-title">' +
        intl('134794', '企业状态') +
        '</div><button class="chart-nav-btn wi-secondary-bg" data-all="1" data-key="全部">' +
        intl('19498', '全部') +
        '</button><button class="chart-nav-btn "   data-key="存续">' +
        intl('240282', '存续') +
        '</button><button class="chart-nav-btn "   data-key="注销">' +
        intl('36489', '注销') +
        '</button>'
    )
    htmlArr.push(
      '<button class="chart-nav-btn " data-key="迁出">' +
        intl('134788', '迁出') +
        '</button><button class="chart-nav-btn " style="font-size:12px;"  data-key="吊销,未注销">' +
        intl('134789', '吊销,未注销') +
        '</button>'
    )
    htmlArr.push(
      '<button class="chart-nav-btn " style="font-size:12px;"  data-key="吊销,已注销">' +
        intl('134790', '吊销,已注销') +
        '</button><button class="chart-nav-btn "  data-key="撤销">' +
        intl('2690', '撤销') +
        '</button>'
    )
    htmlArr.push(
      '<button class="chart-nav-btn "  data-key="停业">' +
        intl('134791', '停业') +
        '</button><button class="chart-nav-btn "  data-key="非正常户">' +
        intl('257686', '非正常户') +
        '</button></div>'
    )
    htmlArr.push('<ul class="chart-nav-slide"></ul>')
    htmlArr.push('</div></div>')

    $('#rContent').append(htmlArr.join(''))
    $('#rContent').addClass('has-nav')

    var params = {
      bindcode: param.companyCode,
      level: lev ? lev : 2,
    }
    if (!fromFilter) {
      params.limit = 30
      params.pagesize = 30
    } else {
      params.pagesize = 100
    }
    params.restfulApi = '/graph/company/getentpatht/' + CompanyChart.companyCode

    myWfcAjax(
      '/graph/',
      params,
      function (data) {
        if (data && data.ErrorCode == '-2') {
          $('#load_data').hide()
          $('#companyChart').show()
          Common.getReloadPart($('#companyChart'), CompanyChart, 'loadYSGX')
          return
        }
        if (data && data.ErrorCode == '-10') {
          //无权限
          VipPopup({ title: intl('138486', '疑似关系'), description: `购买VIP/SVIP套餐，即可查看该企业的疑似关系` })
          CompanyChart.chartNoData(intl('132725', '暂无数据'))
          return
        } else if (data && data.ErrorCode == '-9') {
          //超限
          Common.PupupNoAccess('该模块查询次数已超限，请明日再试', intl('138486', '疑似关系'), function () {
            window.close()
          })
          return
        }
        if (
          data.ErrorCode == 0 &&
          data.Data &&
          data.Data.nodes &&
          data.Data.nodes.length &&
          data.Data.routes &&
          data.Data.routes.length
        ) {
          // $('#load_data').hide();
          // 显示内容

          if (Common.en_access_config) {
            var tmpNodes = []
            var tmpNodesObj = {}
            data.Data.nodes.map(function (t) {
              tmpNodes.push(t)
            })
            Common.zh2en(data.Data.nodes, function (endata) {
              endata.map(function (t, idx) {
                endata[idx].windId = tmpNodes[idx].windId
                tmpNodesObj[tmpNodes[idx].windId] = endata[idx]
              })
              data.Data.nodes = endata
              tmpNodes = endata

              data.Data.paths.map(function (t) {
                t.nodes.map(function (tt) {
                  tt.nodeName = tmpNodesObj[tt.windId].nodeName
                })
              })
              ysgxCall()
            })
          } else {
            ysgxCall()
          }

          function ysgxCall() {
            try {
              var dataSet = (CompanyChart.dataSet = CompanyChart.pathDataChange(
                data.Data,
                checked ? (lev ? lev : 2) : 0,
                fromFilter
              ))
              if (!dataSet.nodes || !dataSet.nodes.length) {
                $('#rContent').removeClass('has-nav')
                $('#toolNav').hide()
                CompanyChart.chartNoData(intl('132725', '暂无数据'))
                $('#check-ysgx').off('change').on('change', CompanyChart.ysgxCbxChangeHandler)
              }
              var tmp = [] // 避免后端生成的节点无序
              var levelObj = {}
              var stateObj = {}
              var _rootNode = null

              for (var i = 0; i < dataSet.nodes.length; i++) {
                // 兼容后端bug
                var state = ''
                var t = dataSet.nodes[i]
                if (t.status) {
                  state = t.status
                } else if (t.props && t.props.status) {
                  state = t.props.status
                }
                var level = t.level

                if (levelObj[level]) {
                  if (!levelObj[level][t.windId]) {
                    levelObj[level][t.windId] = t
                  }
                } else {
                  levelObj[level] = {}
                  levelObj[level][t.windId] = t
                }

                if (t.nodeType === 'company') {
                  if (stateObj[state]) {
                    if (!stateObj[state][t.windId]) {
                      stateObj[state][t.windId] = t
                    }
                  } else {
                    stateObj[state] = {}
                    stateObj[state][t.windId] = t
                  }
                }
                if (param.companyCode.indexOf(t.windId) > -1) {
                  _rootNode = t
                }
              }
              dataSet.levelObj = levelObj
              dataSet.stateObj = stateObj
              // dataSet.nodes = tmp;
              var pathSet = (CompanyChart.pathSet = CompanyChart.pathChange(data.Data.paths))
              CompanyChart._corpListParams.pathSet = pathSet.pathObj
              CompanyChart._corpListParams.companycode = ''
              CompanyChart._corpListParams.companyname = param.companyName
              CompanyChart._corpListParams.rootcode = CompanyChart.companyCode

              // 记录当前有多少企业节点(剔除目标公司)
              for (var iii = 0; iii < dataSet.nodes.length; iii++) {
                var item = dataSet.nodes[iii]
                if (item.nodeType == 'company' && item.windId.indexOf('$') < 0) {
                  if (param.companyCode.indexOf(item.windId) == -1) {
                    if (CompanyChart._corpListParams.companycode) {
                      CompanyChart._corpListParams.companycode += ',' + item.windId
                    } else {
                      CompanyChart._corpListParams.companycode = item.windId
                    }
                  }
                }
              }

              $('#no_data').hide()
              $('#companyChart').css('visibility', 'hidden')
              drawGLLJ2(dataSet, { code: _rootNode.windId })

              $('.chart-header-rate').off('click').on('click', actionOneFn)
              $('.chart-header-reload').off('click').on('click', actionTwoFn)
              $('.chart-header-save').off('click').on('click', actionSaveFn)
              $('.chart-header-list').off('click').on('click', actionThreeFn)
              $('.chart-nav button').off('click').on('click', CompanyChart.filterEventHandler)
              $('.chart-nav .chart-nav-slide').off('click').on('click', actionSlide)
              $('#check-ysgx').off('change').on('change', CompanyChart.ysgxCbxChangeHandler)
            } catch (e) {
              $('#load_data').hide()
              $('#rContent').removeClass('has-nav')
              $('#toolNav').hide()
              CompanyChart.chartNoData(intl('132725', '暂无数据'))
              console.log('疑似关系绘制失败:' + e)
            }
          }
        } else {
          $('#rContent').removeClass('has-nav')
          $('#toolNav').hide()
          CompanyChart.chartNoData(intl('132725', '暂无数据'))
          console.log('疑似关系数据/接口异常')
        }
      },
      function () {
        $('#rContent').removeClass('has-nav')
        $('#toolNav').hide()
        CompanyChart.chartNoData(intl('132725', '暂无数据'))
        console.log('疑似关系服务端异常')
      }
    )

    function drawGLLJ2(root, params) {
      var nodes
      var links
      var rootData = {}
      $.extend(true, rootData, root)
      var cy
      var firstTab = true
      var id = CompanyChart.companyCode

      function maoRefresh() {
        $('.nav-block.active').trigger('click')
      }

      function maoScale(type) {
        var scale = cy.zoom()
        if (type == 1) {
          if (scale > 2.4) {
            layer.msg('足够大了！')
            return
          }
          scale += 0.2
        } else if (type == 2) {
          if (scale <= 0.4) {
            layer.msg('足够小了！')
            return
          }
          scale -= 0.2
        }
        cy.zoom({
          level: scale, // the zoom level
        })
      }

      function getData() {
        drawGraph(root)
      }

      var nodeCenter = params.code
      var colorLeft = '#e26012'
      var colorRight = '#e26012'
      // ycye.cecil modify UI颜色 2020-10-26 start
      var colorCenter = '#f68717'
      var colorRY = '#e05d5d'
      var colorQT = '#2277a2'
      var colorDebt = '#8862ac'
      var colorIpo = '#63a074'
      // ycye.cecil modify UI颜色 2020-10-26 end
      var colorLink = '#fbd14c'
      var colorMore = '#77C4D4'

      var allColor = '#666666'
      // var allColors = ['#9d7fd1', '#e46258', '#fe9d4e', '#fbd14c', '#3cc73e', '#4eb486', '#3db6c6', '#54a4eb', '#1e88e5', '#e26012'];
      // ycye.cecil modify UI颜色 2020-10-26 start
      var allColors = [
        '#2277a2',
        '#f68717',
        '#5fbebf',
        '#e05d5d',
        '#4a588e',
        '#e4c557',
        '#63a074',
        '#906f54',
        '#9da9b4',
        '#8862ac',
        '#9d7fd1',
      ]
      // ycye.cecil modify UI颜色 2020-10-26 end
      var allColorsObj = {
        actctrl: {
          idx: 0,
          txt: Common.en_access_config ? intl('138125') : '控制',
          props: null,
        },
        address: {
          idx: 1,
          txt: '',
          // txt: '地址',
          // props: 'address',
          props: null,
        },
        branch: {
          idx: 2,
          txt: intl('138183', '分支机构'),
          props: null,
        },
        domain: {
          idx: 3,
          txt: '',
          // txt: '域名',
          // props: 'domain',
          props: null,
        },
        invest: {
          idx: 4,
          txt: intl('102836', '投资'),
          props: null,
        },
        legalrep: {
          idx: 5,
          txt: intl('138733', '法人'),
          props: null,
        },
        member: {
          idx: 6,
          txt: intl('64504', '高管'),
          props: 'position',
        },
        tel: {
          idx: 7,
          txt: '',
          // txt: '电话',
          // props: 'tel',
          props: null,
        },
        email: {
          idx: 8,
          txt: '',
          // txt: '邮件',
          // props: 'email',
          props: null,
        },
        investctrl: {
          idx: 9,
          txt: intl('138629', '控股'),
          props: null,
        },
        relativeperson: {
          idx: 10,
          txt: Common.en_access_config ? 'relatives' : '亲属', // 泛概念
          props: 'relateName',
        },
      }

      function drawGraph(data) {
        var clientWidth = window.document.body.clientWidth
        var clientHeight = window.document.body.clientHeight

        // 关联路径探查
        var eles = []
        var activeNode
        var moveTimeer
        var _isFocus = false

        data.entities = []
        data.route = []

        data.nodes.forEach(function (t) {
          var node = {}
          if (t.windId == nodeCenter) {
            if (t.nodeType == 'person') {
              node = {
                Id: t.windId,
                Name: t.nodeName || 'Target',
                Type: t.nodeType,
                rootNode: true,
                color: colorCenter,
              }
            } else {
              node = {
                Id: t.windId,
                Name: t.nodeName || 'Target',
                Type: t.nodeType,
                rootNode: true,
                color: colorCenter,
              }
            }
          } else if (t.nodeType == 'person') {
            node = {
              Id: t.windId,
              Name: t.nodeName || 'N/A',
              category: t.nodeType,
              color: colorRY,
              imgId: t.imageIdT || '',
            }
          } else if (
            t.nodeType == 'email' ||
            t.nodeType == 'domain' ||
            t.nodeType == 'address' ||
            t.nodeType == 'tel'
          ) {
            node = {
              Id: t.windId,
              Name: t.nodeName || 'N/A',
              category: t.nodeType,
              color: colorLink,
            }
          } else {
            node = {
              Id: t.windId,
              Name: t.nodeName || 'N/A',
              category: t.nodeType,
            }
            if (t.isListed == 'true') {
              node.color = colorIpo
              node.isListed = true
            } else if (t.isIssued == 'true') {
              node.color = colorDebt
              node.isIssued = true
            } else if (t.nodeType == 'v') {
              node.color = colorMore
            } else {
              node.color = colorQT
            }
          }
          var len = node.Name.length
          // 文本长度在15以内 不处理
          // 中文超过15处理
          // 英文超过30处理
          if (len > 14) {
            var cnLen = 0
            for (var j = 0; j < len; j++) {
              // 遍历判断字符串中每个字符的Unicode码,大于255则为中文
              if (node.Name.charCodeAt(j) > 255) {
                cnLen += 1
              }
            }
            var enLen = len - cnLen
            var charLen = cnLen * 2 + enLen
            node.charLength = cnLen * 2 + enLen
          }
          eles.push({
            data: {
              id: node.Id,
              name: node.Name,
              category: t.nodeType,
              color: node.color,
              isListed: node.isListed,
              isIssued: node.isIssued,
              imgId: node.imgId || '',
              charLength: node.charLength || null,
            },
          })
          data.entities.push(node)
        })
        delete data.nodes
        data.routes.forEach(function (link) {
          var type = link.relType.split('|')
          var label = ''
          var props = link.props
          var color = ''

          if (type.length > 1) {
            for (var _i = 0; _i < type.length; _i++) {
              var t = type[_i]
              var propObj = link.props[t + '_props']
              var prop = ''
              var _label = ''

              if (allColorsObj[t]) {
                prop = allColorsObj[t].props ? propObj[allColorsObj[t].props] : ''
                _label = allColorsObj[t].txt
              }

              // if (t === 'invest' || t === 'actctrl') {
              //     prop = Common.formatPercent(prop);
              // }

              if (t === 'member') {
                _label = prop
              }

              if (t === 'classmate') {
                var tprops = link.props.classmate_props
                if (tprops) {
                  var schoolName = tprops.schoolName || ''
                  var schoolYear = tprops.year || ''
                  var schoolClass = tprops.class || ''
                  tprops = schoolName ? schoolName + '-' : ''
                  tprops += schoolYear + schoolClass
                }
                _label = tprops ? tprops : '同学'
              }

              if (label) {
                // label = label + ', ' + _label + (prop ? '(' + prop + ')' : '');
                label = label + ', ' + _label
              } else {
                // label = _label + (prop ? '(' + prop + ')' : '');
                label = _label
              }
            }

            if (Common.en_access_config) {
              if (label.indexOf(',') > -1) {
                label = label.split(',')[0]
              }
            }

            if (label == '高管') {
              label = intl('64504')
            } else if (label == '法人') {
              label = intl('138733')
            } else if (label == '同学') {
              label = Common.en_access_config ? 'classmate' : '同学'
            } else if (label == '经理') {
              label = Common.en_access_config ? 'manage' : '经理'
            } else if (label == '董事长') {
              label = Common.en_access_config ? 'chairman' : '董事长'
            } else if (/^[\u4e00-\u9fa5]/.test(label)) {
              label = Common.en_access_config ? '' : label
            }

            eles.push({
              data: {
                source: link.startId,
                target: link.endId,
                label: label,
                _label: label,
                color: allColor,
                sourceNode: link.sourceNode,
                endNode: link.targetNode,
                _routeId: link._routeId,
              },
              classes: 'autorotate',
            })
          } else {
            if (allColorsObj[link.relType]) {
              if (allColorsObj[link.relType].props) {
                var propObj = link.props ? link.props[link.relType + '_props'] : null
                props = propObj ? propObj[allColorsObj[link.relType].props] : ''
                color = allColors[allColorsObj[link.relType].idx]
              } else {
                props = ''
                // color = allColor;
                color = allColors[allColorsObj[link.relType].idx]
              }
              label = allColorsObj[link.relType].txt
            } else {
              label = ''
              props = ''
              color = allColor
            }

            // if (type[0] === 'invest' || type[0] === 'actctrl') {
            //     props = Common.formatPercent(props);
            // }
            // label = label + (props ? '(' + props + ')' : '');

            if (link.relType === 'member') {
              label = props
            }

            if (link.relType === 'classmate') {
              var tprops = link.props.classmate_props
              if (tprops) {
                var schoolName = tprops.schoolName || ''
                var schoolYear = tprops.year || ''
                var schoolClass = tprops.class || ''
                tprops = schoolName ? schoolName + '-' : ''
                tprops += schoolYear + schoolClass
              }
              label = tprops ? tprops : '同学'
            }

            if (Common.en_access_config) {
              if (label.indexOf(',') > -1) {
                label = label.split(',')[0]
              }
            }
            if (label == '高管') {
              label = intl('64504')
            } else if (label == '法人') {
              label = intl('138733')
            } else if (label == '同学') {
              label = Common.en_access_config ? 'classmate' : '同学'
            } else if (label == '经理') {
              label = Common.en_access_config ? 'manage' : '经理'
            } else if (label == '董事长') {
              label = Common.en_access_config ? 'chairman' : '董事长'
            } else if (/^[\u4e00-\u9fa5]/.test(label)) {
              label = Common.en_access_config ? '' : label
            }

            eles.push({
              data: {
                source: link.startId,
                target: link.endId,
                label: label,
                _label: label,
                color: color,
                sourceNode: link.sourceNode,
                endNode: link.targetNode,
                _routeId: link._routeId,
              },
              classes: 'autorotate',
            })
          }
          data.route.push(link)
        })
        delete data.routes
        data.routes = data.route
        delete data.route

        var enSize = 0
        if (Common.en_access_config) enSize = 30
        var corpSize = 77 + enSize
        var personSize = 56 + enSize
        var otherSize = 47 + enSize

        CompanyChart.cyInstance = cy = window.cytoscape({
          container: document.getElementById('companyChart'),
          motionBlur: false,
          textureOnViewport: false,
          wheelSensitivity: 0.1,
          elements: eles,
          minZoom: 0.6,
          maxZoom: 1.6,
          layout: {
            name: 'cose',
            // name: 'preset',
            fit: false,
            componentSpacing: 40,
            nestingFactor: 12,
            padding: 10,
            edgeElasticity: 800,
            idealEdgeLength: function (edge) {
              return 10
            },
            ready: function () {
              $('#screenArea').css('cursor', 'pointer')
              var nodeLength = cy.collection('node').length
              if (nodeLength < 8) {
                cy.zoom({ level: 1.4 })
              } else if (nodeLength >= 8 && nodeLength < 16) {
                cy.zoom({ level: 1.3 })
              } else if (nodeLength >= 15 && nodeLength < 25) {
                cy.zoom({ level: 1.1 })
              } else {
                cy.zoom({ level: 1.01 })
              }
              // cy.collection("edge").addClass("hidetext")
            },
            sort: function (a, b) {
              return b.data('category') - a.data('category')
            },
          },
          style: [
            {
              // 节点初始状态
              selector: 'node',
              style: {
                shape: 'ellipse',
                width: function (ele) {
                  if (ele.data('charLength') && ele.data('charLength') > 31) {
                    return corpSize + (ele.data('charLength') - 30) * 1
                  } else if (ele.data('id') === CompanyChart.companyCode) {
                    return corpSize
                  } else if (ele.data('category') == 'person') {
                    if (ele.data('charLength') && ele.data('charLength') > 14) {
                      return personSize + ele.data('charLength') * 2
                    }
                    return personSize
                  } else if (
                    ele.data('category') == 'email' ||
                    ele.data('category') == 'domain' ||
                    ele.data('category') == 'address' ||
                    ele.data('category') == 'tel'
                  ) {
                    return otherSize
                  } else {
                    return corpSize
                  }
                },
                height: function (ele) {
                  if (ele.data('charLength') && ele.data('charLength') > 31) {
                    return corpSize + (ele.data('charLength') - 30) * 1
                  } else if (ele.data('id') === CompanyChart.companyCode) {
                    return corpSize
                  } else if (ele.data('category') == 'person') {
                    if (ele.data('charLength') && ele.data('charLength') > 14) {
                      return personSize + ele.data('charLength') * 2
                    }
                    return personSize
                  } else if (
                    ele.data('category') == 'email' ||
                    ele.data('category') == 'domain' ||
                    ele.data('category') == 'address' ||
                    ele.data('category') == 'tel'
                  ) {
                    return otherSize
                  } else {
                    return corpSize
                  }
                },
                'background-color': function (ele) {
                  return ele.data('color')
                },
                'background-image': function (ele) {
                  if (!global_isRelease) {
                    return 'none'
                  } else {
                    var imgId = ele.data('imgId')
                    if (imgId && CompanyChart.imgServerIp) {
                      // return 'http://' + CompanyChart.imgServerIp + '/imageWeb/ImgHandler.aspx?imageID=' + imgId;
                      return Common.addWsidForImg(imgId)
                    } else {
                      return 'none'
                    }
                  }
                },
                // 'background-image-crossorigin': 'no', // 单独加的字段
                'background-fit': 'cover cover',
                'background-width': '100%',
                'background-height': '100%',
                'background-image-opacity': 0.8,
                'border-color': function (ele) {
                  if (!global_isRelease) {
                    return '#fff'
                  } else {
                    var imgId = ele.data('imgId')
                    if (imgId && CompanyChart.imgServerIp) {
                      return 'red'
                    } else {
                      return '#fff'
                    }
                  }
                },
                'border-width': 4,
                'border-opacity': function (ele) {
                  if (!global_isRelease) {
                    return 0
                  } else {
                    var imgId = ele.data('imgId')
                    if (imgId && CompanyChart.imgServerIp) {
                      return 0.5
                    } else {
                      return 0
                    }
                  }
                },
                label: function (ele) {
                  var label = ele.data('name')
                  if (label.indexOf(' ') > 0) {
                    var arr = label.split(' ')
                    var tmp = ''
                    for (var i = 0; i < arr.length; i++) {
                      tmp += tmp ? '\n' + arr[i] : arr[i]
                    }
                    label = tmp
                  } else {
                    label = label ? label.replace(/(.{5})(?=.)/g, '$1\n') : 'N/A'
                  }
                  return label
                },
                'z-index-compare': 'manual',
                'z-index': 20,
                color: '#fff',
                'font-size': function () {
                  return 14
                },
                // 'font-family': 'Microsoft YaHei',
                'text-wrap': 'wrap',
                // 'text-max-width': 60,
                'text-halign': 'center',
                'text-valign': 'center',
                'overlay-color': '#fff',
                'overlay-opacity': 0,
                'background-opacity': 1,
              },
            },
            {
              // 连线初始状态
              selector: 'edge',
              style: {
                'line-style': 'solid',
                // 'line-style': 'dashed', // 虚线
                'curve-style': 'bezier',
                'control-point-step-size': 20,
                'target-arrow-shape': 'triangle-backcurve',
                'target-arrow-color': function (ele) {
                  return '#666666'
                },
                'arrow-scale': 0.5,
                'line-color': function (ele) {
                  return ele.data('color')
                },
                'background-color': function (ele) {
                  return ele.data('color')
                },
                width: 0.3,
                'overlay-color': '#fff',
                'overlay-opacity': 0,
                label: function (ele) {
                  return ele.data('label')
                },
                'text-opacity': 1,
                'font-size': 12,
                // 'font-family': 'Microsoft YaHei',
                color: function (ele) {
                  return allColor
                },
              },
            },
            {
              // 边上的文字旋转样式
              selector: '.autorotate',
              style: {
                // 边上的文字是否跟随边旋转
                // "edge-text-rotation": "autorotate"
              },
            },
            {
              selector: '.nodeActive',
              style: {
                'background-color': function (ele) {
                  return ele.data('color')
                },
                'border-color': function (ele) {
                  if (ele.data('id') === nodeCenter) {
                    return colorCenter
                  } else if (ele.data('category') == 'person') {
                    return colorRY
                  } else if (
                    ele.data('category') == 'address' ||
                    ele.data('category') == 'domain' ||
                    ele.data('category') == 'email' ||
                    ele.data('category') == 'tel'
                  ) {
                    return colorLink
                  } else {
                    if (ele.data('isListed')) {
                      return colorIpo
                    } else if (ele.data('isIssued')) {
                      return colorDebt
                    } else {
                      return colorQT
                    }
                  }
                },
                'border-width': 10,
                'border-opacity': 0.5,
                width: function (ele) {
                  if (ele.data('charLength') && ele.data('charLength') > 31) {
                    return corpSize + 2 + (ele.data('charLength') - 30) * 1
                  } else if (ele.data('id') === CompanyChart.companyCode) {
                    return corpSize + 2
                  } else if (ele.data('category') == 'person') {
                    if (ele.data('charLength') && ele.data('charLength') > 14) {
                      return personSize + 2 + ele.data('charLength') * 2
                    }
                    return personSize + 2
                  } else if (ele.data('category') == 'company') {
                    return corpSize + 2
                  } else {
                    return otherSize + 2
                  }
                },
                height: function (ele) {
                  if (ele.data('charLength') && ele.data('charLength') > 31) {
                    return corpSize + (ele.data('charLength') - 30) * 1
                  } else if (ele.data('id') === CompanyChart.companyCode) {
                    return corpSize
                  } else if (ele.data('category') == 'person') {
                    if (ele.data('charLength') && ele.data('charLength') > 14) {
                      return personSize + ele.data('charLength') * 2
                    }
                    return personSize
                  } else if (ele.data('category') == 'company') {
                    return corpSize
                  } else {
                    return otherSize
                  }
                },
              },
            },
            {
              selector: '.nodeHide',
              style: {
                opacity: 0,
                'z-index': 999,
              },
            },
            {
              selector: '.edgeHide',
              style: {
                opacity: 0,
              },
            },
            {
              selector: '.edgeShow',
              style: {
                color: '#666666',
                'text-opacity': 1,
                'font-weight': 400,
                label: function (ele) {
                  return ele.data('label')
                },
                'font-size': 12,
              },
            },
            {
              // 初始状态 线条颜色；鼠标悬浮node时 线条颜色；
              selector: '.edgeActive',
              style: {
                'line-style': 'solid',
                'arrow-scale': 0.8,
                width: 1.5,
                color: '#666666',
                'text-opacity': 1,
                'font-size': 12,
                'font-weight': '600',
                'text-background-color': '#fff',
                'text-background-opacity': 1,
                'source-text-margin-y': 20,
                'target-text-margin-y': 20,
                'z-index-compare': 'manual',
                'z-index': 19,
                'line-color': function (ele) {
                  return ele.data('color')
                },
                'target-arrow-color': function (ele) {
                  return ele.data('color')
                },
                label: function (ele) {
                  return ele.data('label')
                },
              },
            },
            {
              selector: '.hidetext',
              style: { 'text-opacity': 0 },
            },
            {
              selector: '.dull',
              style: { 'z-index': 1, opacity: 0.2 },
            },
            { selector: '.nodeHover', style: { shape: 'ellipse', 'background-opacity': 0.9 } },
            { selector: '.lineFixed', style: { 'overlay-opacity': 0 } },
          ],
        })

        CompanyChart.cyInstance.txtHide = $('.chart-header-rate').attr('data-hide') - 0 ? true : false

        // 画布点击动作
        cy.on('click', function (a) {
          if (a.target === cy) {
            _isFocus = false
            activeNode = null
            cy.collection('node').removeClass('nodeActive')
            cancelHighLight()
          }
        })

        // cy画布上 鼠标按下动作
        cy.on('mousedown', function (event) {
          var coreStyle = cy.style()._private.coreStyle
          coreStyle['active-bg-color'] && (coreStyle['active-bg-color'].value = [0, 255, 0])
          coreStyle['active-bg-color'] && (coreStyle['active-bg-size'].pfValue = 0)
          event.stopPropagation()
          event.preventDefault()
        })

        // 节点点击
        // cy.on('tap', 'node', function(evt) {
        cy.on('click', 'node', function (evt) {
          var node = evt.target
          if (node._private.style['z-index'].value == 20) {
            _isFocus = true
            highLight([node._private.data.id], cy)
            if (node.hasClass('nodeActive')) {
              activeNode = null
              node.removeClass('nodeActive')
              cy.collection('edge').removeClass('edgeActive')
            } else {
              activeNode = node
              cy.collection('node').removeClass('nodeActive')
              cy.collection('edge').removeClass('edgeActive')
              node.addClass('nodeActive')
              node.neighborhood('edge').removeClass('opacity')
              node.neighborhood('edge').addClass('edgeActive')
              node.neighborhood('edge').connectedNodes().removeClass('opacity')
            }
          } else {
            _isFocus = false
            activeNode = null
            cy.collection('node').removeClass('nodeActive')
            cancelHighLight()
          }

          if (node._private.data && node._private.data.id) {
            if (node._private.data.category && node._private.data.category == 'v') {
              $('#companyChart').empty() // 节点清空
              $('#no_data').hide() // 暂无数据
              $('#load_data').show() // 加载中
              $('#companyChart').attr('class', '') // 样式清空
              $('#rContent').removeClass('has-nav')
              $('#toolNav').remove()
              CompanyChart.loadYSGX(1, false, 1)
              return
            }
            if (node._private.data.id.indexOf('$') !== 0) {
              if (node._private.data.category == 'person') {
                Common.chartCardEventHandler({
                  companyCode: node._private.data.id,
                  title: '人物信息',
                  type: 'person',
                  name: node._private.data.name,
                })
              } else {
                Common.chartCardEventHandler({
                  companyCode: node._private.data.id,
                  title: '企业信息',
                  type: 'company',
                  name: node._private.data.name,
                })
              }
            }
          }

          // firstTab = false;
        })

        // node节点上，鼠标按下动作(先于click，顺序大致为：vmosedown-tap-click)
        cy.on('vmousedown', 'node', function (a) {
          a = a.target
          if (!_isFocus) {
            highLight([a._private.data.id], cy)
          }
        })
        // node节点上，鼠标点击(或拖动)释放动作
        cy.on('tapend', 'node', function (a) {
          if (!_isFocus) {
            cancelHighLight()
          }
        })

        // 边线点击
        cy.on('click', 'edge', function (a) {
          _isFocus = false
          activeNode = null
          cy.collection('node').removeClass('nodeActive')
          cancelHighLight()
        })

        // 节点：鼠标悬浮
        cy.on('mouseover', 'node', function (evt) {
          var node = evt.target
          if (node._private.style['z-index'].value == 20) {
            node.addClass('nodeHover')
            if (!_isFocus) {
              cy.collection('edge').removeClass('edgeShow')
              cy.collection('edge').removeClass('edgeActive')
              node.neighborhood('edge').addClass('edgeActive')
            }
          }
        })
        // 节点：鼠标移出
        cy.on('mouseout', 'node', function (evt) {
          evt.target.removeClass('nodeHover')
          if (!_isFocus) {
            cy.collection('edge').removeClass('edgeActive')
          }
        })
        // 线：鼠标移出
        cy.on('mouseover', 'edge', function (evt) {
          // console.log('mouseover-edge-1')
          if (!_isFocus) {
            var edge = evt.target
            cy.collection('edge').removeClass('edgeActive')
            edge.addClass('edgeActive')
            edge.removeClass('hidetext')
          }
        })
        // 线：鼠标移出
        cy.on('mouseout', 'edge', function (evt) {
          // console.log('mouseout-edge-1')
          var edge = evt.target
          if (!_isFocus) {
            edge.removeClass('edgeActive')
            activeNode && activeNode.neighborhood('edge').addClass('edgeActive')

            if (!CompanyChart.cyInstance.txtHide) {
              edge.addClass('hidetext')
            }
          }
        })

        cy.nodes().positions(function (a, b) {
          if (a._private.data.id === nodeCenter) {
            return { x: 900 - 300, y: 900 }
          } else {
            cy.pan({ x: clientWidth - 300 / 2, y: 100 })
          }
        })

        cy.ready(function () {
          var level1Len = 0
          if (CompanyChart.dataSet && CompanyChart.dataSet.levelObj) {
            var level1Obj = CompanyChart.dataSet.levelObj[1]
            level1Len = Object.keys(level1Obj).length + 1
          }
          var len = level1Len // 取出第一层数据量判断初始放大/缩小倍数
          if (len < 8) {
            cy.zoom({ level: 1.2 })
          } else if (len >= 8 && len < 16) {
            cy.zoom({ level: 1.1 })
          } else if (len >= 15 && len < 25) {
            cy.zoom({ level: 1.01 })
          } else {
            cy.zoom({ level: 0.9 })
          }
          setTimeout(function () {
            cy.collection('edge').addClass('lineFixed')
          }, 400)

          $('#load_data').hide()
          cy.center(cy.$('#' + nodeCenter))
          if (cy.$('#' + nodeCenter).length) {
            cy.$('#' + nodeCenter)[0]._isRoot = true
          }

          $('#companyChart').css('visibility', 'visible')
        })
        cy.nodes(function (a) {})

        cy.on('zoom', function () {
          if (cy.zoom() < 0.5) {
            cy.collection('node').addClass('hidetext')
          } else {
            cy.collection('node').removeClass('hidetext')
          }
          setTimeout(function () {
            cy.collection('edge').removeClass('lineFixed')
            cy.collection('edge').addClass('lineFixed')
          }, 200)
        })

        cy.on('pan', function () {
          setTimeout(function () {
            cy.collection('edge').removeClass('lineFixed')
            cy.collection('edge').addClass('lineFixed')
          }, 200)
        })

        function highLight(c, b) {
          b.collection('node').removeClass('nodeActive')
          b.collection('edge').removeClass('edgeActive')
          b.collection('node').addClass('dull')
          b.collection('edge').addClass('dull')
          for (var a = 0; a < c.length; a++) {
            var d = c[a]
            b.nodes(function (a) {
              if (a._private.data.id == d) {
                a.removeClass('dull')
                a.neighborhood('edge').removeClass('dull')
                a.neighborhood('edge').addClass('edgeActive')
                a.neighborhood('edge').connectedNodes().removeClass('dull')
              }
            })
          }
        }

        function cancelHighLight() {
          cy.collection('node').removeClass('nodeActive')
          cy.collection('edge').removeClass('edgeActive')
          cy.collection('node').removeClass('dull')
          cy.collection('edge').removeClass('dull')
        }

        cy._reload = maoRefresh
      }

      function resizeScreen() {
        $('#companyChart').height($('#screenArea').height())
      }

      resizeScreen()
      getData()
    }

    function actionSaveFn(e) {
      pointBuriedByModule(922602100355)
      if ($('#load_data').attr('style').indexOf('block') > -1) {
        return false
      }
      var imgData = CompanyChart.cyInstance.jpg({ full: true, bg: '#ffffff', scale: 1.8 })
      var target = $('[data-id="layer2-node"]')
      Common.saveCanvasImg('[data-id="layer2-node"]', '疑似关联', 3, imgData)
    }

    function actionOneFn(e) {
      pointBuriedByModule(922602100354)
      var val = $(this).attr('data-hide')
      if (val == 1) {
        $(this).removeClass('chart-header-rate-other')
        window._CompanyChart.cyInstance.collection('edge').addClass('hidetext')
        CompanyChart.cyInstance.txtHide = false
        $(this).attr('data-hide', 0)
        $(this).find('span').text('看关联')
      } else {
        $(this).addClass('chart-header-rate-other')
        window._CompanyChart.cyInstance.collection('edge').removeClass('hidetext')
        CompanyChart.cyInstance.txtHide = true
        $(this).attr('data-hide', 1)
        $(this).find('span').text('无关联')
      }
    }

    function actionTwoFn(e) {
      pointBuriedByModule(922602100356)
      if ($('#load_data').attr('style').indexOf('block') > -1) {
        return false
      }
      CompanyChart.cyInstance._reload && CompanyChart.cyInstance._reload()
      var val = $('.chart-header-rate').attr('data-hide') - 0
      if (val) {
        setTimeout(function () {
          window._CompanyChart?.cyInstance?.collection('edge').removeClass('hidetext')
          if (CompanyChart.cyInstance) CompanyChart.cyInstance.txtHide = val ? true : false
        }, 10)
      }
    }

    function actionThreeFn(e) {
      pointBuriedByModule(922602100353)
      CompanyChart._corpListParams.cmd = 'relationpathcorps'
      layer.open({
        title: [intl('138216', '企业列表'), 'font-size:18px;'],
        skin: 'feedback-body',
        type: 2,
        area: ['950px', '720px'], //宽高
        content: '../Company/chartCorpList.html' + window.location.search,
        shadeClose: true,
      })
    }

    function actionSlide(e) {
      var parent = $(e.target).parent()
      var root = $(parent).closest('#rContent')
      var width = $('#screenArea').width()
      if ($(parent).hasClass('chart-hide')) {
        $(parent).removeClass('chart-hide')
        $(root).addClass('has-nav')
        // $(root).find('#companyChart svg').attr('width', $('#screenArea').width() - 300);
      } else {
        $(parent).addClass('chart-hide')
        $(root).removeClass('has-nav')
        // $(root).find('#companyChart svg').attr('width', $('#screenArea').width() + 300);
      }
    }
  },
  pathDataChange: function (data, lev, fromFilter) {
    var paths = data.paths
    var nodeObj = {} // node 对象，有唯一key
    var routeObj = {} // route 对象，有唯一key
    var nodes = [] // node arr
    var links = [] // route arr

    if (lev !== 2 && !fromFilter) {
      if (paths && paths.length && paths.length > 30) {
        paths.length = 30
      }
    }

    if (lev == 2) {
      for (var i = 0; i < paths.length; i++) {
        var nodeInPath = paths[i].nodes
        if (nodeInPath.length > 3) {
          nodeInPath.length = 3
        }
        if (CompanyChart.companyCode.indexOf('1010941206') > -1) {
          // workout 14301316, 屏蔽 安徽明泽投资管理有限公司 当前人物展示
          try {
            var tmpPath = JSON.stringify(nodeInPath)
            if (tmpPath.indexOf('0C1483929A484849A1B36BB7E40B3EE8') > -1) {
              paths[i]._del = 1
              continue
            }
          } catch (e) {}
        }

        if (nodeInPath[nodeInPath.length - 1].nodeType !== 'person') {
          paths[i]._del = 1
          continue
        }
        for (var j = 0; j < nodeInPath.length; j++) {
          var node = nodeInPath[j]
          if (!nodeObj[node.windId]) {
            nodeObj[node.windId] = node
            nodes.push(node)
          } else {
            nodeObj[node.windId].level = node.level
          }
        }
      }
    } else if (lev == 1) {
      for (var i = 0; i < paths.length; i++) {
        var nodeInPath = paths[i].nodes
        if (nodeInPath.length > 2) {
          nodeInPath.length = 2
        }
        if (CompanyChart.companyCode.indexOf('1010941206') > -1) {
          // workout 14301316, 屏蔽 安徽明泽投资管理有限公司 当前人物展示
          try {
            var tmpPath = JSON.stringify(nodeInPath)
            if (tmpPath.indexOf('0C1483929A484849A1B36BB7E40B3EE8') > -1) {
              paths[i]._del = 1
              continue
            }
          } catch (e) {}
        }
        if (nodeInPath[nodeInPath.length - 1].nodeType !== 'person') {
          paths[i]._del = 1
          continue
        }
        for (var j = 0; j < nodeInPath.length; j++) {
          var node = nodeInPath[j]
          if (!nodeObj[node.windId]) {
            nodeObj[node.windId] = node
            nodes.push(node)
          } else {
            nodeObj[node.windId].level = node.level
          }
        }
      }
    } else {
      for (var i = 0; i < paths.length; i++) {
        var nodeInPath = paths[i].nodes
        if (nodeInPath.length > 3) {
          nodeInPath.length = 3
        }
        if (CompanyChart.companyCode.indexOf('1010941206') > -1) {
          // workout 14301316, 屏蔽 安徽明泽投资管理有限公司 当前人物展示 2022-10-21
          try {
            var tmpPath = JSON.stringify(nodeInPath)
            if (tmpPath.indexOf('0C1483929A484849A1B36BB7E40B3EE8') > -1) {
              paths[i]._del = 1
              continue
            }
          } catch (e) {}
        }
        for (var j = 0; j < nodeInPath.length; j++) {
          var node = nodeInPath[j]
          if (!nodeObj[node.windId]) {
            nodeObj[node.windId] = node
            nodes.push(node)
          } else {
            nodeObj[node.windId].level = node.level
          }
        }
      }
    }

    for (var i = 0; i < data.routes.length; i++) {
      var route = data.routes[i]
      var startId = route.startId
      var endId = route.endId
      var _routeId = route.startId + '_' + route.endId
      route._routeId = _routeId
      if (nodeObj[startId] && nodeObj[endId]) {
        links.push(route)
      }
      if (!routeObj[_routeId]) {
        routeObj[_routeId] = route
      }
    }

    var lstPaths = []
    for (var x = 0; x < lstPaths.length; x++) {
      if (!paths[x]._del) {
        lstPaths.push(paths[x])
      }
    }

    if (lev !== 2 && !fromFilter) {
      var vnode = {
        nodeName: Common.en_access_config ? 'More\n ...' : '查看更多\n...',
        isIssued: '',
        isListed: '',
        level: 0,
        docId: '$$More',
        windId: '$$More',
        nodeType: 'v',
        nodeId: '$$More',
        status: '',
      }
      var vlink = {
        endId: '$$More',
        endNode: nodes[0].nodeId,
        props: {},
        relId: '$$More',
        relType: 'v',
        startId: nodes[0].windId,
        startNode: '$$More',
        _routeId: nodes[0].windId + '_' + '$$More',
      }
      var vpath = {
        nodes: [nodes[0], vnode],
        routes: [vlink],
      }
      paths = lstPaths
      paths.push(vpath)
      nodes.push(vnode)
      links.push(vlink)
    }
    return { nodes: nodes, routes: links, nodeObj: nodeObj, routeObj: routeObj }
  },

  pathChange: function (paths) {
    var tmp = Common.chartPathChange(paths)
    CompanyChart.filterPathObj = tmp.filterPathObj
    CompanyChart.allPathObj = tmp.allPathObj
    CompanyChart.statePathObj = tmp.statePathObj
    return tmp
  },

  // 融资历程
  loadRZLC: function () {
    pointBuriedByModule(922602100365)
    $('#load_data').show()
    var parameter = {
      companycode: CompanyChart.companyCode,
      companyid: CompanyChart.companyId,
      pevcGroup: '1',
      showId: true,
    }

    $('#rContent').find('#toolNav').remove()
    $('#rContent').append(
      '<div id="toolNav"><div class="chart-toolbar" style="display:block;"><ul class="wi-secondary-color"><li class="chart-header-reload"><span></span></li></ul></div></div>'
    )
    // $('#rContent').find('#toolNav').append('<style>.mao-screen-area{margin-left:10px;}</style>');
    $('.loading-failed').remove()

    parameter.restfulApi = '/graph/company/getcorpfinancegraph/' + CompanyChart.companyCode

    myWfcAjax(
      'getfinancingevent',
      parameter,
      function (data) {
        // var data = JSON.parse(data);

        if (data && data.ErrorCode == '-2') {
          $('#load_data').hide()
          $('#companyChart').show()
          Common.getReloadPart($('#companyChart'), CompanyChart, 'loadRZLC')
          return
        }

        if (data && data.ErrorCode == '-10') {
          //无权限
          VipPopup({ title: intl('', '融资历程'), description: `购买VIP/SVIP套餐，即可查看该企业的融资历程` })
          CompanyChart.chartNoData(intl('437656', '暂无融资历程数据'))
          return
        } else if (data && data.ErrorCode == '-9') {
          //超限
          Common.PupupNoAccess('该模块查询次数已超限，请明日再试', '融资历程', function () {
            window.close()
          })
          return
        }
        if (data && data.ErrorCode == 0 && data.Data) {
          if (typeof data.Data === 'object' && Object.values(data.Data).every((i) => !i || !i.length)) {
            return CompanyChart.chartNoData(intl('437656', '暂无融资历程数据'))
          }
          var returnData = changeFinanceList(data.Data) //转换融资数据
          var top1 = 0

          if (Common.en_access_config) {
            var newArr = []
            for (var k in returnData.changeData) {
              returnData.changeData[k][0].map(function (tt) {
                newArr.push(tt)
              })
            }
            Common.zh2en(newArr, function (res) {
              for (var k in returnData.changeData) {
                returnData.changeData[k][0] = []
              }
              res.map(function (t) {
                returnData.changeData[t.__year][0].push(t)
              })
              rzlcCallback()
            })
          } else {
            rzlcCallback()
          }

          function rzlcCallback() {
            var changeData = returnData.changeData
            var yearArr = returnData.yearArr
            $('#load_data').hide()
            $('#no_data').hide()

            var maxH = 0
            var maxH1 = 0 // 往下
            var maxH2 = 0 // 往上
            var maxIdx = 0
            var maxTop = 0

            for (var k in changeData) {
              var t = changeData[k]
              var tt = changeData[k]
              tt = tt.join(',').split(',')
              if (t.length % 2) {
                if (t._len > maxH1) {
                  maxH1 = t._len
                }
              } else {
                if (t._len > maxH2) {
                  maxH2 = t._len
                }
                if (tt.length > maxTop) {
                  maxTop = tt.length
                }
              }
            }
            maxH = maxH1 > maxH2 ? maxH1 : maxH2

            $('#companyChart').addClass('chart-rzlc-y')
            var htmlArr = []
            htmlArr.push('<div class="main"><div class="history">')
            var distance = 30
            top1 = distance * maxH + maxTop * 10
            var css1 = 'top:' + top1 + 'px;'
            var left = 0

            htmlArr.push('<div class="history-line" style="' + css1 + '"></div>')
            for (var item = 0; item < yearArr.length; item++) {
              var long = changeData[yearArr[item]] ? changeData[yearArr[item]].join(',').split(',').length : 0
              var len = changeData[yearArr[item]] ? changeData[yearArr[item]].length : 0
              var _len = changeData[yearArr[item]]._len
              _len = _len > 60 ? _len - 1.5 : _len
              var top = item % 2 ? top1 : top1 - _len * distance - 3 * long
              left = 300 * item
              var css = 'top:' + top + 'px;' + 'left:' + left + 'px;'
              var heightcss = item % 2 ? '' : top1 - top
              heightcss = heightcss ? 'height: ' + heightcss + 'px' : ''
              var h2css2 = item % 2 == 0 ? 'date02-h2-top' : ''
              var h2css3 = item % 2 == 0 ? 'position:absolute;' : ''
              htmlArr.push(
                '<div class="history-date" style="' +
                  css +
                  heightcss +
                  '"><ul><h2 class="date02 bounceInDown ' +
                  h2css2 +
                  '" style="' +
                  h2css3 +
                  '"><span>' +
                  yearArr[item] +
                  '</span><i></i></h2>'
              )
              if (item % 2 == 0) {
                changeData[yearArr[item]].reverse()
              }
              for (var i = 0; i < len; i++) {
                var dateKey = ''
                switch (changeData[yearArr[item]][i][0].__type) {
                  case 'SharedBondsInfo':
                    dateKey = 'interestDate'
                    break
                  case 'SharedStockInfoMrs':
                    dateKey = 'listDate'
                    break
                  case 'PEVC':
                    dateKey = 'openTime'
                    break
                  case 'MergerInfo':
                    dateKey = '_firstAfficheDate'
                    break
                  case 'GrantCredit':
                    dateKey = 'endDate'
                    break
                  case 'CompanyABS':
                    dateKey = 'announceDate'
                    break
                  case 'EquityPledged':
                    dateKey = 'regDate'
                    break
                }

                var dateArr = changeData[yearArr[item]][i][0][dateKey]
                if (dateArr.indexOf('-') > -1) {
                  dateArr = dateArr.split('-')
                } else {
                  dateArr = [dateArr.substr(0, 4), dateArr.substr(4, 2), dateArr.substr(6, 2)]
                }
                var dateYear = dateArr[0]
                var dateMoth = dateArr[1] + '.' + dateArr[2]
                htmlArr.push('<li style="margin-left:19px"><h3>' + dateMoth + '</h3><dl>')

                // var maxLen = changeData[yearArr[item]][i].length > 10 ? 11 : changeData[yearArr[item]][i].length;

                for (var j = 0; j < changeData[yearArr[item]][i].length; j++) {
                  htmlArr.push('<dt>')
                  var list_item = ''
                  var enent = changeData[yearArr[item]][i][j]
                  var eventKey = enent.__type
                  switch (eventKey) {
                    case 'SharedStockInfoMrs':
                      list_item =
                        '<h4>' +
                        intl('451226', '发行股票') +
                        '</h4>' +
                        '<span class="each-list-item">' +
                        intl('437657', '首发数量') +
                        ' : ' +
                        Common.formatCont(enent.ipoNumber) +
                        '</span><span class="each-list-item">' +
                        intl('437658', '首发价格') +
                        ' : ' +
                        Common.formatMoney(enent.ipoPrice, [4, enent.marketValueCurrency || '元']) +
                        '</span><span class="each-list-item">' +
                        intl('451227', '股票简称') +
                        ' : ' +
                        Common.formatCont(enent.name) +
                        '</span><span class="each-list-item">' +
                        intl('6440', '股票代码') +
                        ' : ' +
                        Common.formatCont(enent.windCode) +
                        '</span><span class="each-list-item">' +
                        intl('451211', '上市板块') +
                        ' : ' +
                        Common.formatCont(enent.listedBoard) +
                        '</span>'
                      break
                    case 'SharedBondsInfo':
                      list_item =
                        '<h4>' +
                        intl('138664', '发行债券') +
                        '</h4>' +
                        '<span class="each-list-item">' +
                        intl('138630', '实际发行数量') +
                        ' : ' +
                        Common.formatCont(enent.realPublishNumber) +
                        intl('205677', '亿元') +
                        '</span><span class="each-list-item">' +
                        intl('138833', '起息日') +
                        ' : ' +
                        Common.formatTime(enent.interestDate) +
                        '</span><span class="each-list-item">' +
                        intl('138934', '到期日') +
                        ' : ' +
                        Common.formatTime(enent.dueDate) +
                        '</span><span class="each-list-item">' +
                        intl('138892', '债券简称') +
                        ' : ' +
                        Common.formatCont(enent.secName) +
                        '</span><span class="each-list-item">' +
                        intl('437814', '债券代码') +
                        ' : ' +
                        Common.formatCont(enent.windCode) +
                        '</span><span class="each-list-item">' +
                        intl('30690', '票面利率') +
                        ' : ' +
                        Common.formatCont(enent.interestRateForTicket) +
                        '</span>'
                      break
                    case 'PEVC':
                      list_item =
                        '<h4>PE&VC</h4>' +
                        '<span class="each-list-item">' +
                        intl('451238', '融资金额') +
                        ' : ' +
                        Common.formatMoney(enent.financeAmount) +
                        '</span><span class="each-list-item">' +
                        intl('59928', '融资轮次') +
                        ' : ' +
                        Common.formatCont(enent.financeRound) +
                        '</span><span class="each-list-item">' +
                        intl('451212', '投资机构') +
                        ' : ' +
                        enent.investmentCompany +
                        '</span>'
                      break
                    case 'MergerInfo':
                      list_item =
                        '<h4>' +
                        intl('108785', '并购') +
                        '</h4>' +
                        '<span class="each-list-item">' +
                        intl('138565', '参与方类型') +
                        ' : ' +
                        Common.formatCont(enent._dealPartRoleCode) +
                        '</span><span class="each-list-item">' +
                        intl('40645', '并购方式') +
                        ' : ' +
                        Common.formatCont(enent._mergeTypeCode) +
                        '</span><span class="each-list-item">' +
                        intl('138801', '交易价值') +
                        ' ： ' +
                        Common.formatCont(enent._purchaserPayment) +
                        intl('20116', '万') +
                        (enent._moneyCode ? enent._moneyCode : intl('12298', '人民币元')) +
                        '</span>'
                      break
                    case 'CompanyABS':
                      list_item =
                        '<h4>' +
                        intl('138122', 'ABS信息') +
                        '</h4>' +
                        '<span class="each-list-item">' +
                        intl('34886', '项目名称') +
                        ' : ' +
                        Common.formatCont(enent.projectName) +
                        '</span><span class="each-list-item">' +
                        intl('138796', '发行总额(万元)') +
                        ' : ' +
                        Common.formatMoney(enent.issuedAmount, [4, intl('19487', '万元')]) +
                        '</span><span class="each-list-item">' +
                        intl('138655', '发行公告日') +
                        ' : ' +
                        Common.formatCont(enent.announceDate) +
                        '</span><span class="each-list-item">' +
                        intl('138701', '法定到期日') +
                        ' : ' +
                        Common.formatCont(enent.member3) +
                        '</span><span class="each-list-item">' +
                        intl('138621', '基础资产总类') +
                        ' : ' +
                        Common.formatCont(enent.basicAssetsType) +
                        '</span>'
                      break
                    case 'GrantCredit':
                      list_item =
                        '<h4>' +
                        intl('138684', '银行授信') +
                        '</h4>' +
                        '<span class="each-list-item">' +
                        intl('32903', '公告日期') +
                        ' : ' +
                        Common.formatCont(enent.endDate) +
                        '</span><span class="each-list-item">' +
                        intl('24411', '截止日期') +
                        ' : ' +
                        Common.formatCont(enent.endDate) +
                        '</span><span class="each-list-item">' +
                        intl('138822', '授信额度(亿元)') +
                        ' : ' +
                        Common.formatMoney(enent.grantedCreditMoney, [4, intl('205677', '亿元')]) +
                        '</span>'
                      break
                    case 'EquityPledged':
                      list_item =
                        '<h4>' +
                        intl('138281', '股权出质') +
                        '</h4>' +
                        '<span class="each-list-item">' +
                        intl('138447', '出质人') +
                        ' : ' +
                        Common.formatCont(enent.pledgorName) +
                        '</span><span class="each-list-item">' +
                        intl('143251', '出质股权数额（万股）') +
                        ' : ' +
                        Common.formatCont(enent.pledgeAmount) +
                        '</span>'
                      break
                  }
                  htmlArr.push(list_item)
                  htmlArr.push('</dt>')
                }
                htmlArr.push('</dl></li>')
              }
              htmlArr.push('</ul></div>')
            }
            htmlArr.push('</div></div>')
            $('#companyChart').empty().html(htmlArr.join(''))

            if (document.body.clientWidth < left + 600) {
              $('.history-line').css({ width: left + 600 })
            }
          }

          systole()

          function systole() {
            if (!$('.history').length) {
              return
            }
            if (top1 > 360) {
              $('.main').animate(
                {
                  scrollTop: top1 - 180,
                },
                1000
              )
            }
          }

          $('.chart-header-reload').off('click').on('click', rzlrReload)

          function rzlrReload() {
            $('.main').empty()
            CompanyChart.loadRZLC()
          }
        } else {
          CompanyChart.chartNoData(intl('437656', '暂无融资历程数据'))
        }
      },
      function (data) {
        CompanyChart.chartNoData(intl('437656', '暂无融资历程数据'))
      }
    )
    var changeFinanceList = function (arr) {
      function changeItemDate(item, dateKey, newObj, typeMap, type, keepObj) {
        for (var i = 0; i < (item.length > 10 ? 10 : item.length); i++) {
          var newItem = {}
          newItem[dateKey] = item[i][dateKey]
          keepObj.map(function (t) {
            newItem[t] = item[i][t]
          })
          item[i] = newItem
          item[i].__type = type
          if (item[i][dateKey]) {
            var year = item[i][dateKey].substring(0, 4)
            if (!newObj[year]) {
              newObj[year] = []
              newObj[year].push(item[i])
              yearArr.push(year)
              newObj[year]._len = typeMap[item[i].__type] || 0
            } else {
              newObj[year].push(item[i])
              newObj[year]._len = newObj[year]._len + (typeMap[item[i].__type] || 0)
            }
            item[i].__year = year
          }
        }
      }

      var newObj = {}
      var yearArr = []
      var typeMap = {
        SharedStockInfoMrs: 6,
        SharedBondsInfo: 8,
        PEVC: 6,
        MergerInfo: 4.5,
        GrantCredit: 3.8,
        CompanyABS: 6.2,
        EquityPledged: 3,
      }

      for (var k in arr) {
        var data = arr[k]
        switch (k) {
          case 'SharedBondsInfo':
            changeItemDate(data, 'interestDate', newObj, typeMap, 'SharedBondsInfo', [
              'realPublishNumber',
              'interestDate',
              'dueDate',
              'secName',
              'windCode',
              'interestRateForTicket',
            ])
            break
          case 'SharedStockInfoMrs':
            changeItemDate(data, 'listDate', newObj, typeMap, 'SharedStockInfoMrs', [
              'ipoNumber',
              'ipoPrice',
              'marketValueCurrency',
              'name',
              'windCode',
              'listedBoard',
            ])
            break
          case 'PEVC':
            changeItemDate(data, 'openTime', newObj, typeMap, 'PEVC', [
              'financeAmount',
              'financeRound',
              'investmentCompany',
            ])
            break
          case 'MergerInfo':
            changeItemDate(data, '_firstAfficheDate', newObj, typeMap, 'MergerInfo', [
              '_dealPartRoleCode',
              '_mergeTypeCode',
              '_purchaserPayment',
              '_moneyCode',
            ])
            break
          case 'GrantCredit':
            changeItemDate(data, 'endDate', newObj, typeMap, 'GrantCredit', ['endDate', 'grantedCreditMoney'])
            break
          case 'CompanyABS':
            changeItemDate(data, 'announceDate', newObj, typeMap, 'CompanyABS', [
              'projectName',
              'issuedAmount',
              'announceDate',
              'member3',
              'basicAssetsType',
            ])
            break
          case 'EquityPledged':
            changeItemDate(data, 'regDate', newObj, typeMap, 'EquityPledged', ['pledgorName', 'pledgeAmount'])
            break
        }
      }

      // for (var i = 0; i < arr.length; i++) {
      //     if (arr[i].date) {
      //         var year = arr[i].date.substring(0, 4);
      //         if (!newObj[year]) {
      //             newObj[year] = [];
      //             newObj[year].push(arr[i]);
      //             yearArr.push(year)
      //             newObj[year]._len = typeMap[arr[i].eventType] || 0
      //         } else {
      //             newObj[year].push(arr[i]);
      //             newObj[year]._len = newObj[year]._len + (typeMap[arr[i].eventType] || 0);
      //         }
      //     }
      // }

      var changeData = {} //最后要返回的数据
      for (var item in newObj) {
        changeData[item] = []
        var lastDate = ''
        var lastItem = '',
          processDate = [],
          res = []
        for (var i = 0; i < newObj[item].length; i++) {
          if (lastDate != newObj[item][i].date) {
            if (lastItem && lastItem.length > 0) {
              res.push(lastItem)
            }
            lastItem = [newObj[item][i]]
            lastDate = newObj[item][i].date
          } else {
            lastItem.push(newObj[item][i])
          }
        }
        res.push(lastItem)
        changeData[item] = res
        changeData[item]._len = newObj[item]._len
      }
      yearArr = yearArr.sort()
      yearArr = yearArr.reverse()
      var returnObj = { yearArr: yearArr, changeData: changeData }
      return returnObj
    }
  },
  // 重置
  reset: function (params) {
    var eles = $('.chart-nav').find('button')
    Array.prototype.forEach.call(eles, function (e) {
      if (!$(e).hasClass('wi-secondary-bg')) {
        $(e).addClass('wi-secondary-bg')
      }
    })
    $('#rContent').find('.syr-type-content').remove()
    $('#rContent').find('.glgx-type-content').remove()
    $('.chart-yskzr').hide() // 疑似实际控制人内容
    $('#companyChart').empty() // 节点清空
    $('#no_data').hide() // 暂无数据
    $('#load_data').show() // 加载中
    $('#companyChart').attr('class', '') // 样式清空
    $('#rContent').removeClass('has-nav')
    $('#toolNav').remove()
    $('#gqjg_title').remove()
    if (CompanyChart.cyInstance) {
      CompanyChart.cyInstance.destroy()
      CompanyChart.cyInstance = null
    }
  },
  /**
   * 过滤事件handler
   */
  filterEventHandler: function (e) {
    var parent = $(e.target).parent()
    if ($(parent).hasClass('chart-nav-zero')) {
      if ($(e.target).hasClass('wi-secondary-bg')) {
        return
      }
      var idx = $(e.target).attr('data-lev') - 0
      $('#companyChart').empty() // 节点清空
      $('#no_data').hide() // 暂无数据
      $('#load_data').show() // 加载中
      $('#companyChart').attr('class', '') // 样式清空
      $('#rContent').removeClass('has-nav')
      $('#toolNav').remove()
      var checked = $('#check-ysgx').attr('checked') ? true : false
      if (idx == 1) {
        CompanyChart.loadYSGX(idx == 1 ? idx : null, checked, 0)
      } else {
        CompanyChart.loadYSGX(idx == 1 ? idx : null, checked, 1)
      }
      return false
    } else {
      // 全部
      if ($(e.target).attr('data-all') == '1') {
        if ($(e.target).hasClass('wi-secondary-bg')) {
          $(e.target).removeClass('wi-secondary-bg')
        } else {
          $(e.target).addClass('wi-secondary-bg')
          $(e.target).nextAll().removeClass('wi-secondary-bg')
        }
      } else {
        $($(e.target).parent().find('button')[0]).removeClass('wi-secondary-bg')
        if ($(e.target).hasClass('wi-secondary-bg')) {
          $(e.target).removeClass('wi-secondary-bg')
        } else {
          $(e.target).addClass('wi-secondary-bg')
        }
      }
    }
    CompanyChart.filterAction()
  },
  /**
   * 过滤事件action
   */
  filterAction: function () {
    var levelBtns = $('.chart-nav-zero button')
    var stateBtns = $('.chart-nav-first button')
    var labelBtns = $('.chart-nav-second button')
    // var otherBtns = $('.chart-nav-three button');
    var filters = []
    var levelFilter = false
    var stateFilters = []

    if ($(labelBtns[0]).hasClass('wi-secondary-bg')) {
      filters = []
    } else {
      Array.prototype.forEach.call(labelBtns, function (e, idx) {
        if (idx) {
          if (!$(e).hasClass('wi-secondary-bg')) {
            filters.push($(e).attr('data-key'))
          }
        }
      })
    }

    if ($(levelBtns[0]).hasClass('wi-secondary-bg')) {
      levelFilter = true
    }

    if ($(stateBtns[0]).hasClass('wi-secondary-bg')) {
      stateFilters = []
    } else {
      Array.prototype.forEach.call(stateBtns, function (e, idx) {
        if (idx) {
          if (!$(e).hasClass('wi-secondary-bg')) {
            stateFilters.push($(e).attr('data-key'))
          }
        }
      })
    }

    try {
      CompanyChart.filterEdges(stateFilters, filters)
      CompanyChart.filterNodes(levelFilter)
    } catch (e) {
      console.log('过滤失败!')
    }
  },
  /**
   * edge属性过滤
   *
   * @param {any} stateKey 状态过滤条件
   * @param {any} labelKey 线属性过滤条件
   */
  filterEdges: function (stateKey, labelKey) {
    labelKey = labelKey || []
    stateKey = stateKey || []

    var edges = CompanyChart.cyInstance.collection('edge')
    var nodes = CompanyChart.cyInstance.collection('node')

    var allPathObj = CompanyChart.pathSet.allPathObj // 所有path
    var allRouteObj = CompanyChart.dataSet.routeObj // 所有route
    var allStateObj = CompanyChart.dataSet.stateObj // 所有state

    var todoLabelPathArr = []
    var todoStatePathArr = []

    var todoPathObj = {} // 待过滤path obj
    var todoRouteObj = {} // 待过滤route
    var displayRouteObj = {} // 重新绘制route
    var displayPathObj = {} // 重新绘制path

    labelKey.forEach(function (k) {
      todoLabelPathArr = todoLabelPathArr.concat(CompanyChart.pathSet.filterPathObj[k] || [])
    })

    stateKey.forEach(function (key) {
      var obj = allStateObj[key]
      for (var k in obj) {
        todoStatePathArr = todoStatePathArr.concat(CompanyChart.pathSet.statePathObj[k] || [])
      }
    })

    todoStatePathArr.forEach(function (t) {
      var k = t._pathId
      if (!todoPathObj[k]) {
        todoPathObj[k] = t
      }
    })

    todoLabelPathArr.forEach(function (o) {
      var k = o._pathId
      var routes = o.routes
      var len = routes.length
      for (var i = 0; i < routes.length; i++) {
        var route = routes[i]
        var filter = route.filters
        var tag = false
        for (var key in filter) {
          if (labelKey.indexOf(key) > -1) {
            filter[key].show = false
          } else {
            if (!filter[key].show) {
              filter[key].show = true
            }
            tag = true
          }
        }
        if (tag) {
          len--
        }
      }
      if (len) {
        if (!todoPathObj[k]) {
          todoPathObj[k] = o
        }
      }
    })

    // 找出待重绘path
    for (var k in allPathObj) {
      var o = allPathObj[k]
      if (!todoPathObj[k]) {
        if (!displayPathObj[k]) {
          displayPathObj[k] = o
          var t = o.routes
          t.forEach(function (item) {
            if (!displayRouteObj[item._routeId]) {
              for (var key in item.filters) {
                if (labelKey.indexOf(key) < 0) {
                  item.filters[key].show = true
                }
              }
              displayRouteObj[item._routeId] = item
            }
          })
        }
      }
    }

    // 找出待过滤route
    for (var k in allRouteObj) {
      if (!displayRouteObj[k]) {
        if (!todoRouteObj[k]) {
          todoRouteObj[k] = allRouteObj[k]
        }
      }
    }

    // 在图形上过滤route及node
    for (var k in todoRouteObj) {
      edges.forEach(function (t) {
        var item = t._private.data
        if (item._routeId === k) {
          t.style({ display: 'none' })
          t._private.source.style({ display: 'none' })
          t._private.target.style({ display: 'none' })
        }
      })
    }

    // 图形上根据要重绘的path重绘不需要过滤的path及经过的route、node
    nodes.forEach(function (t) {
      var itemNode = t._private.data
      var edges = t._private.edges
      edges.forEach(function (t) {
        var item = t._private.data
        if (displayRouteObj[item._routeId]) {
          var txt = ''
          var obj = displayRouteObj[item._routeId].filters
          for (var kt in obj) {
            var tmp = obj[kt]
            if (tmp.show) {
              txt = txt ? txt + ',' + tmp.txt : tmp.txt
            }
          }
          t._private.data.label = txt
          t.style({ display: '' })
          t._private.source.style({ display: '' })
          t._private.target.style({ display: '' })
          if (!t.hasClass('hidetext')) {
            t.addClass('hidetext')
            t.removeClass('hidetext')
          }
        }
      })

      // 根节点必须显示
      if (t._isRoot) {
        t.style({ display: '' })
      }
    })
  },
  /**
   * 层级过滤
   *
   * @param {any} flg
   * @returns
   */
  filterNodes: function (flg) {
    var edges = CompanyChart.cyInstance.collection('edge')
    var nodes = CompanyChart.cyInstance.collection('node')

    var allLevelObj = CompanyChart.dataSet.levelObj
    var displayLevelObj = {}
    var todoLevelObj = {}

    if (!flg) {
      displayLevelObj = allLevelObj
    } else {
      for (var k in allLevelObj) {
        var item = allLevelObj[k]
        // 目前只支持过滤2层
        if (k < 2) {
          for (var kk in item) {
            displayLevelObj[kk] = item[kk]
          }
        } else {
          for (var kk in item) {
            todoLevelObj[kk] = item[kk]
          }
        }
      }
    }

    // 在图形上过滤route及node
    for (var k in todoLevelObj) {
      edges.forEach(function (t) {
        var item = t._private.data
        var sourceId = item.source
        var endId = item.target
        if (todoLevelObj[sourceId] || todoLevelObj[endId]) {
          t.style({ display: 'none' })
          if (todoLevelObj[sourceId]) {
            t._private.source.style({ display: 'none' })
          }
          if (todoLevelObj[endId]) {
            t._private.target.style({ display: 'none' })
          }
        }
      })
    }

    // 根节点必须显示
    nodes.forEach(function (t) {
      if (t._isRoot) {
        t.style({ display: '' })
      }
    })
  },
  /**
   * 暂无数据
   */
  chartNoData: function (txt) {
    //无数据
    $('#chartNoData').empty()
    $('#no_data').text(txt ? txt : intl('132725', '暂无数据'))
    $('#load_data').hide()
    $('#no_data').show()
  },
  /**
   * 外部链接
   */
  isFromLink: function () {
    var isExternal = Common.getUrlSearch('from')
    if (isExternal && /external_/i.test(isExternal)) {
      return true
    }
    if ((isExternal && isExternal.substring(0, 4) == 'link') || isExternal.substring(0, 4) == 'risk') {
      return true
    }
    return false
  },
  isFromF9: function () {
    var linksource = Common.getUrlSearch('linksource')
    if (linksource && /f9/i.test(linksource)) {
      return true
    }
    return false
  },
}

export default CompanyChart
