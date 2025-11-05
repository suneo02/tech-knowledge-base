import { Button, Col, Modal, Row, Tag } from '@wind/wind-ui'
import QRCode from 'qrcode'
import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import BreadCrumb from '../../components/breadCrumb'
import intl from '../../utils/intl'
import { wftCommon } from '../../utils/utils'
import './index.less'
import './layer.css'
import MyMenu from './myMenu'

import warningIcon from '@/assets/imgs/wx_wo.png'
import { ModalSafeType } from '@/components/modal/ModalSafeType'
import { PrivacyPolicyIframe } from '@/components/user/PrivacyPolicyIframe'
import Table, { TableProps } from '@wind/wind-ui-table'
import { HorizontalTableProps } from '@wind/wind-ui-table/es/HorizontalTable'
import * as HomeActions from '../../actions/home'
import { pointBuriedByModule } from '../../api/pointBuried/bury'
import { getBarCode, getdoctasklist, getPayInvoice, listPayOrder } from '../../api/userApi'
import { applyTrail } from '../../lib/globalModal'
import store from '../../store/store'
import { customerMenus, useCustomerPageTitle } from './handle'
import { TCustomerMenuKey } from './handle/menu'
import { MyAccount } from './MyAccount'
import { getMyListColumn } from './MyList'
import { UserNoteTextCN, UserNoteTextEN } from './UserNote'

const { HorizontalTable } = Table

const pageSize = 10

const Customer = ({ userPackageinfo }) => {
  const type = wftCommon.getQueryString('type') // page type
  useCustomerPageTitle(type)
  const { phone, packageName, expireDate, isTrailed, isbuy = false } = userPackageinfo || {}
  let isShowTime = false // 是否展示到期时间
  let isgotovip = false // 是否升级VIP/SVIP
  let isApplySVIP = false // 是否申请试用SVIP会员
  let showfreephone = false // 是否显示Free的手机号
  let vipType

  // 中文6秒刷一次 4分钟，英文12秒刷一次 12分钟
  const maxNum = window.en_access_config ? 60 : 40
  const time = window.en_access_config ? 12000 : 6000

  // 我的账号初始状态
  const initFilter = () => {
    let type = packageName
    // type = "EQ_APL_GEL_BS"
    if (type && type == 'EQ_APL_GEL_FORTRAIL') {
      type = window.en_access_config ? 'SVIP For Trail' : 'SVIP试用版'
      isShowTime = true
    }
    if (type && type == 'EQ_APL_GEL_FORSTAFF') {
      // 员工权限
      type = 'SVIP (STAFF)'
      isShowTime = true
    }
    if (type && type == 'EQ_APL_GEL_SVIP') {
      type = 'SVIP'
      isShowTime = true
    }
    if (type && type == 'EQ_APL_GEL_VIP') {
      type = 'VIP'
      isShowTime = true
    }
    if (type && type == 'EQ_APL_GEL_EP') {
      type = window.en_access_config ? 'EP' : '企业套餐'
    }
    if (type && type == 'EQ_APL_GEL_BS') {
      type = window.en_access_config ? 'Free' : '免费版'
      if (phone) {
        showfreephone = true
      }
      if (wftCommon.usedInClient() && wftCommon.forbiddenTerminalSales.indexOf(wftCommon.terminalType) > -1) {
        isgotovip = false
      } else {
        if (!isTrailed) {
          if (isbuy) {
            if (!wftCommon.is_overseas_config) {
              isApplySVIP = true
            }
          } else {
            isgotovip = true
          }
        } else {
          isgotovip = true
        }
      }
    }
    vipType = type
  }
  initFilter()

  const defaultMenu = customerMenus.find((i) => i.key === type) || customerMenus[0]
  useEffect(() => {
    // 页面初始化时埋点
    pointBuriedByModule(defaultMenu.buryId)
  }, [])
  const [currentMenu, setCurrentMenu] = useState(defaultMenu)
  const [visible, setVisible] = useState(false)
  const [orderVisible, setOrderVisible] = useState(false)
  const [cancelVisible, setCancelVisible] = useState(false)

  const [listDatas, setListDatas] = useState([]) // 我的数据
  const [orderDatas, setOrderDatas] = useState([]) // 我的订单
  const [pageNo, setPageNo] = useState(1)
  const [total, setTotal] = useState(0)

  const [loading, setLoading] = useState(false)

  // 发票详情
  const [dataSource, setDataSource] = useState<any>({})
  // 现场签到
  const [checkInVisible, setCheckInVisible] = useState(false)
  // 倒计时
  const [checkInSeconds, SetCheckInSeconds] = useState(-1)

  const [debugCount, setDebugCount] = useState(0)

  const ref = useRef(listDatas)
  const IntervalRef = useRef(null)

  const pagination = {
    current: pageNo,
    pageSize: pageSize,
    total: total,
    onChange: (page) => {
      setPageNo(page)
    },
    hideOnSinglePage: false,
    showSizeChanger: false,
    showQuickJumper: true,
  }

  const getMyList = () => {
    setLoading(true)
    getdoctasklist({
      pageNo: pageNo - 1,
      pageSize: pageSize,
    }).then((res) => {
      if (res.Data?.length && res.Data.some((i) => i.status === 0 || i.status === 1)) {
        let count = 0
        if (IntervalRef.current) clearInterval(IntervalRef.current)
        IntervalRef.current = setInterval(() => {
          count++
          setTimeout(() => {
            //
            if (count < maxNum && ref.current.some((i) => i.status === 0 || i.status === 1)) {
              getdoctasklist({
                pageNo: pageNo - 1,
                pageSize: pageSize,
              }).then((result) => {
                wftCommon.zh2enAlwaysCallback(result.Data, (newData) => {
                  setListDatas(newData || [])
                })
                ref.current = result.Data
                setTotal(result.Page?.Records)
              })
            } else {
              clearInterval(IntervalRef.current)
            }
          }, 0)
        }, time)
      }
      wftCommon.zh2enAlwaysCallback(
        res.Data,
        (newData) => {
          setLoading(false)
          setListDatas(newData || [])
        },
        null,
        () => {
          setLoading(false)
        }
      )
      ref.current = res.Data
      setTotal(res.Page?.Records)
    })
  }

  const getMyOrders = () => {
    listPayOrder({
      pageNo: pageNo - 1,
      pageSize: pageSize,
    })
      .then((res) => {
        wftCommon.zh2enAlwaysCallback(res.Data, (newData) => {
          setOrderDatas(newData || [])
        })
        setTotal(res.Page?.Records || 0)
      })
      .catch(() => {})
  }

  useEffect(() => {
    // 清除定时器
    IntervalRef.current && clearInterval(IntervalRef.current)
    switch (type) {
      case 'mylist':
        getMyList()
        break
      case 'myorders':
        getMyOrders()
        break
      default:
        break
    }
  }, [type, pageNo])

  useEffect(() => {
    setPageNo(1)
    setTotal(0)
  }, [type])

  useEffect(() => {
    if (checkInVisible && checkInSeconds > 0) {
      // 1.5s自动刷新
      setTimeout(() => {
        checkIn(false)
      }, 1500)
    }
  }, [checkInSeconds])

  // 申请试用SVIP
  const handleOk = () => {
    applyTrail()
    setVisible(false)
  }

  const renderContent = (type: TCustomerMenuKey) => {
    switch (type) {
      case 'myaccounts':
        if (wftCommon.usedInClient()) {
          return Myaccounts
        }
        return <MyAccount userPhone={phone} />
      case 'mylist':
        return MyList
      case 'myorders':
        return MyOrders
      case 'userpolicy':
        // TODO !!! 样式更合理一些
        return <PrivacyPolicyIframe style={{ height: '100%' }} />
      case 'usernote':
        return UserNote
      case 'exceptions':
        return Exceptions
      case 'contact':
        return Contact
      default:
        break
    }
  }

  // 账号信息
  const Myaccounts = (
    <>
      <div className="customer-title">{intl('432910', '账号信息')}</div>
      <div className="customer-content">
        <p>
          <span className="label">
            {intl('312733', '会员信息')}
            {window.en_access_config ? ':' : '：'}
          </span>
          <span className="myorder-type">{vipType}</span>
          {isgotovip && (
            <span
              className="wi-secondary-color"
              onClick={() => {
                wftCommon.jumpJqueryPage('index.html#/versionPrice?nosearch=1')
              }}
            >
              升级为VIP/SVIP
            </span>
          )}
          {isApplySVIP && (
            <span
              className="wi-secondary-color"
              onClick={() => {
                setVisible(true)
              }}
            >
              申请试用SVIP会员
            </span>
          )}
        </p>
        {isShowTime && (
          <>
            <p>
              <span className="label">
                {intl('89265', '到期时间')}
                {window.en_access_config ? ':' : '：'}
              </span>
              <span className=""> {wftCommon.formatTime(expireDate)}</span>
            </p>
            <p>
              <span className="label">
                {window.en_access_config ? (
                  <>
                    If your Wind Financial Terminal expires, you can continue to use Global Enterprise Library via{' '}
                    <span className="myorder-phone2">
                      {intl('149821', '手机号')}&nbsp;{phone}
                    </span>
                    . Website:
                  </>
                ) : (
                  <>
                    如果WFT账号到期，您可通过
                    <span className="myorder-phone2">
                      {intl('149821', '手机号')}&nbsp;{phone}
                    </span>
                    继续使用全球企业库，网址：
                  </>
                )}
              </span>
              <a href="https://gel.wind.com.cn" target="__blank" onClick={() => pointBuriedByModule(922602101047)}>
                https://gel.wind.com.cn
              </a>
            </p>
          </>
        )}
        {showfreephone && (
          <>
            <p>
              <span className="label">
                {intl('196624', '账号')}
                {window.en_access_config ? ':' : '：'}
              </span>
              <span className="">{phone}</span>
            </p>
          </>
        )}

        <ModalSafeType
          title={intl('31041', '提示')}
          visible={visible}
          onOk={handleOk}
          onCancel={() => {
            setVisible(false)
          }}
        >
          <Row type="flex" justify="space-between" gutter={16}>
            <Col>
              <img
                src={warningIcon}
                style={{
                  color: '#faad14',
                  fontSize: 26,
                }}
              />
            </Col>
            <Col>
              <h4
                style={{
                  marginBottom: '12px',
                }}
              >
                您确认要试用企业库SVIP会员吗？
              </h4>
              <p>
                每人仅限一次试用机会，试用期为三个月，点击确认后将自动为您开通，SVIP会员权益将立即生效，并视为您已阅读并同意全球企业库用户协议和隐私政策。
              </p>
            </Col>
          </Row>
        </ModalSafeType>
      </div>
    </>
  )

  const listColumn = getMyListColumn(getMyList)

  // 我的数据
  const MyList = (
    <>
      <div className="customer-title">{intl('141995', '我的数据')}</div>
      <Table loading={loading} columns={listColumn} dataSource={listDatas} size="large" pagination={pagination}></Table>
    </>
  )

  // 我的订单
  const tickPopup = (tick) => {
    setOrderVisible(true)
    setDataSource(tick)

    if (!tick?.status || tick.status?.code !== 2) {
      // 开票中
      if (tick?.invoiceType && tick.invoiceType?.code == 1) {
      } else {
      }
    }
    setTimeout(function () {
      const canvas = document.querySelector('.tick-code')
      console.log('🚀 ~canvas:', canvas)
      if (canvas) {
        QRCode.toCanvas(canvas, tick?.downLoadUrl, { width: 169 }, function (error) {
          if (error) {
            console.error('qcode error', tick?.downLoadUrl)
            console.error(error)
            window.layer.msg('二维码生成异常!(-4)')
          } else {
            console.log('success!')
          }
        })
      }
    }, 200)
  }

  // 订单列表Column
  const orderColumn: TableProps['columns'] = [
    {
      title: intl('28846', '序号'),
      dataIndex: '',
      width: '8%',
      render: (_data, _row, index) => {
        return (pageNo - 1) * pageSize + index + 1
      },
    },
    {
      title: intl('437754', '订单类型'),
      dataIndex: 'name',
      width: '23%',
      render: (data) => {
        return data || '--'
      },
    },
    {
      title: intl('437756', '订单时间'),
      dataIndex: 'date',
      width: '13%',
      render: (data) => {
        return data || '--'
      },
    },
    {
      title: intl('437755', '支付金额（元）'),
      dataIndex: 'priceYuan',
      width: '14%',
      align: 'right',
      render: (data) => {
        return data.toFixed(2) || '--'
      },
    },
    {
      title: intl('437732', '支付方式'),
      dataIndex: 'type',
      width: '12%',
      render: (data) => {
        return data?.desc || '--'
      },
    },
    {
      title: intl('32098', '状态'),
      dataIndex: 'status',
      width: '12%',
      render: (data) => {
        if (data?.code == 2) {
          return data?.desc
        }
        return data?.desc || '--'
      },
    },
    {
      title: intl('36348', '操作'),
      dataIndex: 'applyInvoice',
      width: '18%',
      render: (_data, full) => {
        const status = full.applyInvoice
        const orderId = full.orderId || ''
        const state = status ? intl('307843', '发票信息') : '--' // 1 已开 0 未开
        const id = status ? orderId : ''
        const css = status ? ' gel-vip-tick-create ' : ''
        return (
          <span
            onClick={() => {
              if (orderId) {
                getPayInvoice(orderId).then((res) => {
                  res.Data && (res.Data.orderId = orderId)
                  tickPopup(res.Data || {})
                })
              }
            }}
            className={css}
            data-status={status}
            data-orderId={orderId}
            data-id={id}
          >
            {state}
          </span>
        )
      },
    },
  ]
  // 公司发票详情
  const corpRows: HorizontalTableProps['rows'] = [
    [
      {
        title: intl('416976', '发票类型'),
        dataIndex: 'type',
        titleWidth: '130px',
        titleAlign: 'left',
        render: (data) => {
          return data || '增值税普通发票'
        },
      },
    ],
    [
      {
        title: intl('416977', '付款金额'),
        dataIndex: 'price',
        titleWidth: '130px',
        titleAlign: 'left',
        render: (data) => {
          return wftCommon.formatMoney(data, [2, '元']) || ' '
        },
      },
    ],
    [
      {
        title: intl('416961', '发票抬头'),
        dataIndex: 'invoiceType',
        titleWidth: '130px',
        titleAlign: 'left',
        render: (data) => {
          return data?.desc || '--'
        },
      },
    ],
    [
      {
        title: intl('32914', '公司名称'),
        dataIndex: 'taxpayerName',
        titleWidth: '130px',
        titleAlign: 'left',
        render: (data) => data || '--',
      },
    ],
    [
      {
        title: intl('416978', '公司税号'),
        dataIndex: 'identificationNumber',
        titleWidth: '130px',
        titleAlign: 'left',
        render: (data) => data || '--',
      },
    ],
    [
      {
        title: intl('438015', '公司地址'),
        dataIndex: 'companyAddress',
        titleWidth: '130px',
        titleAlign: 'left',
        render: (data) => data || '--',
      },
    ],
    [
      {
        title: intl('438034', '公司电话'),
        dataIndex: 'receiverTel',
        titleWidth: '130px',
        titleAlign: 'left',
        render: (data) => data || '--',
      },
    ],
    [
      {
        title: intl('416962', '开户银行'),
        dataIndex: 'bankName',
        titleWidth: '130px',
        titleAlign: 'left',
        render: (data) => data || '--',
      },
    ],
    [
      {
        title: intl('416979', '银行账号'),
        dataIndex: 'bankAccount',
        titleWidth: '130px',
        titleAlign: 'left',
        render: (data) => data || '--',
      },
    ],
    [
      {
        title: intl('10057', '联系电话'),
        dataIndex: 'companyTel',
        titleWidth: '130px',
        titleAlign: 'left',
        render: (data) => data || '--',
      },
    ],
    [
      {
        title: intl('140100', '联系邮箱'),
        dataIndex: 'receiverEmail',
        titleWidth: '130px',
        titleAlign: 'left',
        render: (data) => data || '--',
      },
    ],
    [
      {
        title: intl('416980', '开票备注'),
        dataIndex: 'remark',
        titleWidth: '130px',
        titleAlign: 'left',
        render: (data) => data || '--',
      },
    ],
  ]
  // 个人发票详情
  const personRows: HorizontalTableProps['rows'] = [
    [
      {
        title: intl('416976', '发票类型'),
        dataIndex: 'type',
        titleWidth: '130px',
        titleAlign: 'left',
        render: (data) => {
          return data || '增值税普通发票'
        },
      },
    ],
    [
      {
        title: intl('416977', '付款金额'),
        dataIndex: 'price',
        titleWidth: '130px',
        titleAlign: 'left',
        render: (data) => {
          return wftCommon.formatMoney(data, [2, '元']) || ' '
        },
      },
    ],
    [
      {
        title: intl('416961', '发票抬头'),
        dataIndex: 'invoiceType',
        titleWidth: '130px',
        titleAlign: 'left',
        render: (data) => {
          return data?.desc || '--'
        },
      },
    ],
    [
      {
        title: intl('416981', '个人名称'),
        dataIndex: 'taxpayerName',
        titleWidth: '130px',
        titleAlign: 'left',
        render: (data) => data || '--',
      },
    ],
    [
      {
        title: intl('10057', '联系电话'),
        dataIndex: 'companyTel',
        titleWidth: '130px',
        titleAlign: 'left',
        render: (data) => data || '--',
      },
    ],
    [
      {
        title: intl('140100', '联系邮箱'),
        dataIndex: 'receiverEmail',
        titleWidth: '130px',
        titleAlign: 'left',
        render: (data) => data || '--',
      },
    ],
    [
      {
        title: intl('416980', '开票备注'),
        dataIndex: 'remark',
        titleWidth: '130px',
        titleAlign: 'left',
        render: (data) => data || '--',
      },
    ],
  ]
  const MyOrders = (
    <>
      <div className="customer-title">{intl('153389', '我的订单')}</div>
      <div className="customer-orderList-header">
        <div className="customer-orderList-header-title">
          {' '}
          {intl('358873', '订单和发票须知')} {window.en_access_config ? ':' : '：'}{' '}
        </div>
        <div>1. {intl('358874', '“我的订单”页面仅展示在线支付的订单信息')}</div>
        {/* <div>2. {intl('358893', '线上开票仅支持增值税电子普通发票，若需增值税专用发票，请联系客户经理')}</div> */}
        {/* 上述文案2等支持补开发票后调整回来 2024.08.22 */}
        <div>
          2.{' '}
          {window.en_access_config
            ? 'Currently, invoices can only be issued when doing online payments. If you did not request an invoice at the time of payment, please contact your customer manager to have the invoice reissued.'
            : '当前仅支持在线支付时开具发票，如果支付时未申请发票，请联系专属客户经理补开发票'}
        </div>
        <div>3. {intl('358875', '发票开具后会自动发送到您的邮箱，同时您也可以点击“查看发票”重新扫码获取发票文件')}</div>
      </div>
      <Table
        columns={orderColumn}
        dataSource={orderDatas}
        size="large"
        pagination={total > pageSize ? pagination : null}
      ></Table>
      {/* @ts-expect-error */}
      <Modal
        title={intl('416983', '发票详情')}
        visible={orderVisible}
        onOk={() => {
          setOrderVisible(false)
        }}
        onCancel={() => {
          setOrderVisible(false)
        }}
        footer={null}
      >
        <HorizontalTable
          rows={dataSource?.invoiceType?.code == 1 ? corpRows : personRows}
          dataSource={dataSource}
        ></HorizontalTable>
        {dataSource?.status?.code == 2 ? (
          <>
            <div className="tab-tickdetail-bottom">{intl('419894', '扫描下方链接可下载发票：')}</div>
            <div style={{ textAlign: 'center' }}>
              {' '}
              <canvas className="tick-code"></canvas>{' '}
            </div>
          </>
        ) : (
          <>
            <div className="tab-tickdetail-bottom">{intl('419788', '发票开具中，开具完成后可在此处查看二维码')}</div>
          </>
        )}
      </Modal>
    </>
  )

  // 用户协议
  const UserNote = (
    <>
      {window.en_access_config ? UserNoteTextEN : UserNoteTextCN}
      <ModalSafeType
        visible={cancelVisible}
        title={intl('31041', '提示')}
        width={400}
        onOk={() => {
          setCancelVisible(false)
          window.location.href = '../windLogin.html'
        }}
        onCancel={() => {
          setCancelVisible(false)
        }}
      >
        确认撤销协议吗？
      </ModalSafeType>
    </>
  )

  const handleDebugClick = () => {
    // 蓝信终端加一个查看更新日志的入口方便进行调试
    const lanxin_terminal = window.localStorage.getItem('lanxin_terminal')
    if (!lanxin_terminal) return
    const count = debugCount + 1
    setDebugCount(count)
    if (count === 10) {
      window.open('../Company/updateLog.html')
      setDebugCount(0)
    }
  }

  // 免责声明
  const Exceptions = (
    <>
      <div className="customer-title" onClick={handleDebugClick}>
        {intl('23348', '免责声明')}
      </div>
      <div className="user-note-page">
        <h1> {intl('437818', '全球企业库免责声明')}</h1>
        <p>
          {intl(
            '391696',
            '企业库所有数据来源于公开渠道和第三方提供，万得尊重并倡导保护知识产权，本产品所引用数据及其他信息仅作参考，不代表万得赞同或证实其描述。如对该数据服务存在异议，或发现违法及不良信息，请拨打电话400-820-9463或发送邮件至GelSupport@wind.com.cn，我们将及时处理。'
          )}{' '}
        </p>
      </div>
    </>
  )

  // 生成现场签到二维码
  const checkIn = (e) => {
    if (e) {
      setCheckInVisible(true)
      SetCheckInSeconds(120) // 2min
    } else {
      const time = checkInSeconds - 1
      SetCheckInSeconds(time)
    }
    getBarCode().then((res) => {
      // @ts-expect-error ttt
      if (res.errorCode == '0' && res.data) {
        const url = JSON.stringify(res.data)
        const canvas = document.querySelector('.checkin-code')
        if (canvas) {
          QRCode.toCanvas(canvas, url, { width: 169 }, function (error) {
            if (error) {
              console.error(error)
            } else {
              console.log('success!')
            }
          })
        }
      }
    })
  }

  // 联系我们
  const Contact = (
    <>
      <div className="customer-title">
        {intl('26588', '联系我们')}
        {wftCommon.usedInClient() ? null : (
          // @ts-expect-error ttt
          <Tag type="primary" className="cursor-pointer w-tag-color-1 checkin-tag" onClick={checkIn}>
            {intl('428166', '现场签到')}
          </Tag>
        )}
      </div>

      {/* @ts-expect-error ttt*/}
      <Modal
        title={intl('428166', '现场签到')}
        visible={checkInVisible}
        onCancel={() => {
          SetCheckInSeconds(-1)
          setCheckInVisible(false)
        }}
        footer={null}
      >
        <>
          <div>
            {intl('437960', '此功能用于验证客户经理是否现场服务，请客户经理使用万得之家APP扫描下方二维码进行服务签到')}
          </div>
          <div className={` checkin-code-container  ${checkInSeconds < 1 ? 'checkin-code-expired' : ''} `}>
            <canvas className={`checkin-code`}></canvas>
            {checkInSeconds < 1 ? (
              <div className="checkin-tips">
                {intl('437994', '二维码已失效，请重新加载')}
                <Button type="primary" onClick={checkIn}>
                  {intl('438016', '刷新')}
                </Button>
              </div>
            ) : null}
          </div>
        </>
      </Modal>

      {window.en_access_config ? (
        <div className="user-note-page contact-us">
          <p>Address：3/F Wind Plaza, No.1500 Puming Road, Shanghai </p>
          <p>Service Hotline：400-820-9463</p>
          <p>
            Service Email：<a href="mailto:GELSupport@wind.com.cn">GELSupport@wind.com.cn </a>{' '}
          </p>
          <p>
            Report Email：<a href="mailto:jubao@wind.com.cn">jubao@wind.com.cn </a>
          </p>
          <p>Zip Code：200127</p>
        </div>
      ) : (
        <div className="user-note-page contact-us">
          <p>公司地址：上海浦东新区浦明路1500号万得大厦3层</p>
          <p>客服电话：400-820-9463</p>
          <p>
            服务邮箱：<a href="mailto:GELSupport@wind.com.cn">GELSupport@wind.com.cn </a>{' '}
          </p>
          <p>
            举报邮箱：<a href="mailto:jubao@wind.com.cn">jubao@wind.com.cn </a>
          </p>
          <p>邮政编码：200127</p>
        </div>
      )}
    </>
  )

  return (
    <div className="customer">
      <BreadCrumb subTitle={intl('210156', '用户中心')} width="1280px"></BreadCrumb>

      <div className="container">
        <MyMenu
          style={{
            width: '208px',
            backgroundColor: '#fff',
          }}
          menus={customerMenus}
          current={currentMenu}
          onSelect={(menu) => {
            pointBuriedByModule(menu.buryId)
            // 收藏单独处理
            if (menu.key === 'collect') {
              return wftCommon.jumpJqueryPage('index.html#/companyDynamic?keyMenu=1&nosearch=1')
            }
            if (menu.key === 'bindphone') {
              return store.dispatch(HomeActions.setBindPhoneModal('updateContact'))
            }
            window.location.replace(`#/customer?type=${menu?.key}`)
            setCurrentMenu(menu)
          }}
        />
        <div className="content">{renderContent(currentMenu?.key)}</div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    userPackageinfo: state.home.userPackageinfo,
  }
}

const mapDispatchToProps = () => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Customer)
