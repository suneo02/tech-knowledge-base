import FilterTable from './FilterTable'
import { useEffect, useState } from 'react'
import { getIpoRelationship, getpersoncard } from '../../api/chartApi'
import { wftCommon } from '../../utils/utils'
import { linkToCompany } from '../Charts/handle'

import './ChartCard.less'
import intl from '../../utils/intl'

const ChartCard = (props) => {
  let { cardType, companyCode, nodeType, glgxtype, linkSourceRIME } = window._childParams ? window._childParams : props
  const [dataSource, setDataSource] = useState([])
  const [columns, setColumns] = useState([])
  const [loading, setLoading] = useState(false)
  let glgxPathForChild = false
  let glgxPathObj = {}
  if ([14, 15].indexOf(nodeType) > -1) {
    glgxPathForChild = true // 来自子公司路径展示
  }

  const glgxPath = (id, $sel) => {
    var data = []

    getGlgxPath(glgxPathObj[id], data)
    var rst = ''
    var str = ''
    var vCount = 0
    var hasLeftNodeTypes = [6, 7, 16, 17, 9, 10, 11, 12, 13, 14, 15]
    var hasLeft = false
    var arrowReverseIdx = 0
    if (glgxPathForChild) arrowReverseIdx = 1
    if (hasLeftNodeTypes.indexOf(nodeType) > -1) {
      hasLeft = true
    }
    str += '<div class="glgx-path">关联方认定详情<br>'

    for (var i = 0; i < data.length; i++) {
      var item = null
      item = data[i]
      var nameL = item[0]['name'] ? item[0]['name'] : '--'

      str += '<div class="glgx-path-title">认定' + (i + 1) + '</div>'

      if (item[0]['Id']) {
        str +=
          '<span class="td-span-route-left underline wi-secondary-color wi-link-color" data-name="' +
          nameL +
          '" data-type="' +
          item[0]['type'] +
          '" data-code="' +
          item[0]['Id'] +
          '">' +
          nameL +
          '</span>'
      } else {
        str += '<span class="td-span-route-left underline ">' + nameL + '</span>'
      }
      for (var j = 0; j < item.length - 1; j++) {
        var nameR = item[j + 1]['name'] ? item[j + 1]['name'] : '--'
        var sRate = item[j]['ratio'] || '--'
        if (sRate > 0) {
          sRate = wftCommon.formatPercent(sRate)
        }
        // str += '<span class="td-span-route-right"><b>' + sRate + '</b><i></i></span><br>' + '<span class="wi-secondary-color underline ctrlright wi-link-color" data-name="' + nameL + '" data-type="' + item[j + 1]['type'] + '" data-code="' + item[j + 1]['Id'] + '">' + nameR + '</span>';
        str +=
          '<span class="td-span-route-right  ' +
          (j == arrowReverseIdx && hasLeft ? 'td-span-route-right-reverse' : '') +
          ' "><b>' +
          sRate +
          '</b><i></i></span>' +
          '<span class="wi-secondary-color underline ctrlright wi-link-color" data-name="' +
          nameL +
          '" data-type="' +
          item[j + 1]['type'] +
          '" data-code="' +
          item[j + 1]['Id'] +
          '">' +
          nameR +
          '</span>'
      }
      // str += '</'>'
    }
    str += '</div>'
    console.log(str)
    $sel.closest('td').append(str)
    return str
  }

  const getGlgxPath = (item, data) => {
    var routes = item.routes
    var itemid = item.windId
    data = data || []
    routes.forEach(function (paths) {
      var newpath = []
      var newpathObj = {}
      paths.split('#').forEach(function (t) {
        var lid = t.split('|')[0]
        var rid = t.split('|')[1]
        var props = t.split('|')[2]
        // var propsArr = props.split(',');
        // var propsList = [];
        // propsArr.forEach(function(t) {
        //     if (!/委员会/.test(t)) {
        //         propsList.push(t);
        //     }
        // })
        // if (propsList.length) {
        //     props = propsList.join(',');
        // }
        if (newpathObj[lid] && newpathObj[rid]) {
          var lastNode = newpath[newpath.length - 1]
          if (lastNode.Id !== rid) {
            newpathObj[rid] = {
              name: glgxPathObj[rid].name,
              Id: rid,
              ratio: props,
            }
            newpath.push({
              name: glgxPathObj[rid].name,
              Id: rid,
              ratio: props,
            })
          } else {
            newpathObj[lid] = {
              name: glgxPathObj[lid].name,
              Id: lid,
              ratio: props,
            }
            newpath.push({
              name: glgxPathObj[lid].name,
              Id: lid,
              ratio: props,
            })
          }
        } else {
          if (!newpathObj[lid]) {
            newpathObj[lid] = {
              name: glgxPathObj[lid].name,
              Id: lid,
              ratio: props,
            }
            newpath.push({
              name: glgxPathObj[lid].name,
              Id: lid,
              ratio: props,
            })
          }

          if (!newpathObj[rid]) {
            newpathObj[rid] = {
              name: glgxPathObj[rid].name,
              Id: rid,
              ratio: props,
            }
            newpath.push({
              name: glgxPathObj[rid].name,
              Id: rid,
              ratio: props,
            })
          }
        }
      })
      newpath.reverse()
      data.push(newpath)
    })
    console.log(routes)
  }

  function getRtnData(d, rtndata) {
    if (d.type == nodeType) {
      d.collection &&
        d.collection.forEach(function (t) {
          if (t.windId && !glgxPathObj[t.windId]) {
            glgxPathObj[t.windId] = t
          }
          rtndata.push(t)
        })
    } else {
      var len = d.children.length
      d.collection &&
        d.collection.forEach(function (t) {
          if (t.windId && !glgxPathObj[t.windId]) {
            glgxPathObj[t.windId] = t
          }
        })
      for (var i = 0; i < len; i++) {
        if (rtndata && rtndata.length) {
          break
        }
        getRtnData(d.children[i], rtndata)
      }
    }
  }

  const init = async () => {
    let res = []
    switch (cardType) {
      case 'person':
        res = await getpersoncard({ personid: companyCode })
        setDataSource(res)
        break
      case 'person_beneficiary':
        res = await getpersoncard({ personid: companyCode })
        setDataSource(res)
        break
      case 'company_beneficiary':
        dataSource = await getpersoncard({ personid: companyCode })
        setDataSource(res)
        break
      case 'relation_guarantee':
        dataSource = await getpersoncard({ personid: companyCode })
        setDataSource(res)
        break
      case 'relation_equitypledge':
        dataSource = await getpersoncard({ personid: companyCode })
        setDataSource(res)
        break
      case 'corpList':
        dataSource = await getpersoncard({ personid: companyCode })
        setDataSource(res)
        break
      case 'chartglgx':
        let col = [
          {
            title: intl('28846', '序号'),
            width: '120px',
            dataIndex: 'ranking',
            render: (text, record, index) => {
              return index + 1
            },
          },
          {
            title: intl('29979', '名称'),
            dataIndex: 'name',
            render: (text, record) => {
              return (
                <>
                  <div
                    className="glgx-link"
                    data-code={record?.windId}
                    onClick={(e) => {
                      console.log('🚀 ~init ~ e:', e)
                      var $sel = window.$(e.target)
                      const code = record?.windId || ''
                      if (!code) return false
                      var eles = window.$('.glgx-path')
                      var $target = $sel.siblings('.glgx-path')
                      eles.each(function (idx, t) {
                        if (window.$(t)[0] !== $target[0]) {
                          window.$(t).hide()
                        }
                      })
                      if ($target.length) {
                        if ($target.is(':hidden')) {
                          $target.show()
                        } else {
                          $target.hide()
                        }
                      } else {
                        glgxPath(code, $sel)
                      }

                      setTimeout(() => {
                        window
                          .$('.glgx-path .underline')
                          .off('click')
                          .on('click', (e) => {
                            try {
                              const code = $(e.target).attr('data-code')
                              if (code) {
                                const isCompany = code?.length > 15 ? true : false
                                return linkToCompany(code, isCompany, !isCompany, linkSourceRIME)
                              }
                            } catch (e) {}
                          })
                      }, 100)
                    }}
                    data-uc-id="W3c1ZWmAEbg"
                    data-uc-ct="div"
                  >
                    {text}
                  </div>
                </>
              )
            },
          },
        ]
        setColumns(col)
        setLoading(true)

        res = await getIpoRelationship({
          companycode: companyCode,
          nodeType: nodeType,
          refresh: glgxtype || 4,
          expoVer: 1,
        })
        let rtndata = []
        getRtnData(res.Data, rtndata)
        console.log('🚀 ~init ~ data:', rtndata)
        setDataSource((i) => rtndata)
        setLoading(false)

        break
      default:
        break
    }
  }
  useEffect(() => {
    if (!window.jQuery) {
      wftCommon.importExternalScript('./jquery.js').then(() => {
        init()
      })
    } else {
      init()
    }
  }, [])

  return (
    <FilterTable
      style={{
        height: '294px',
        overflow: 'auto',
      }}
      loading={loading}
      columns={columns}
      dataSource={dataSource}
      size="large"
    ></FilterTable>
  )
}

export default ChartCard
