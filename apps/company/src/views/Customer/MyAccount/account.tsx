import { sessionStorageManager } from '@/utils/storage'
import { Button, Input, message, Modal } from '@wind/wind-ui'
import React, { useEffect, useState } from 'react'
import { getAllAccountInfo, loginBySwitch, setVerifyCodeForChangeAccount } from '../../../api/userApi'
import accountCorp from '../../../assets/imgs/logo/account-corp.png'
import accountPerson from '../../../assets/imgs/logo/account-person.png'
import { CaptchaComp } from '../../../components/common/captcha'
import intl from '../../../utils/intl'
import { wftCommon } from '../../../utils/utils'

const AccountTypeToName = {
  S23: '企业账户',
  s23: '企业账户',
  312: '个人账户',
}

const AccountPkgToName = {
  EQ_APL_GEL_BS: '免费会员',
  EQ_APL_GEL_VIP: 'VIP会员',
  EQ_APL_GEL_SVIP: 'SVIP会员',
  EQ_APL_GEL_FORTRAIL: '试用会员',
  EQ_APL_GEL_FORSTAFF: '员工账号',
}

export const MyAccount = ({ userPhone }) => {
  const [data, setData] = useState(null)
  const [phone, setPhone] = useState('')
  const [visible, setVisible] = useState(false)
  const [captchaOpen, setCaptchaOpen] = useState(false)
  const [code, setCode] = useState('')
  const [curTab, setCurTab] = useState(null)
  const is_terminal = wftCommon.usedInClient()
  const timeout = 60
  const [time, setTime] = useState(timeout)
  const [currentAccountLogin, setCurrentAccountLogin] = useState(null)

  useEffect(() => {
    setPhone(userPhone)
  }, [userPhone])

  // 使用useEffect来设置和清理定时器
  useEffect(() => {
    if (time < timeout) {
      const timer = setTimeout(() => {
        if (time > 1) {
          setTime(time - 1)
        } else {
          setCaptchaOpen(false)
          setTime(timeout)
        }
      }, 1000)

      // 清理定时器
      return () => clearTimeout(timer)
    }
  }, [time])

  const tipsZh = (
    <div>
      {`${intl('419821', '您可通过手机号')} ${userPhone || '--'} ${intl('419969', '使用全球企业库，网址: ')}`}
      <a href="https://gel.wind.com.cn" target="_blank">
        https://gel.wind.com.cn
      </a>
      <p>
        {intl('437959', `账户间权益独立，若您当前账户权益不足时，您可以切换至更高权益的账户（若有），或进行套餐升级`)}
      </p>
    </div>
  )
  // TODO 翻译
  const tipsEn = tipsZh

  useEffect(() => {
    // 获取用户所有账户信息
    getAllAccountInfo()
      .then((res) => {
        if (res?.ErrorCode == '0' && res?.Data) {
          if (res.Data?.length) {
            res.Data.map((t) => {
              if (t.currentUserLogin) setCurrentAccountLogin(t.userType)
            })
            setData(res.Data)
          } else {
          }
        }
        console.log(res)
      })
      .finally(() => {})
  }, [])

  const onGetCode = () => {
    setCaptchaOpen(true)
    setTime(timeout - 1)
  }
  const onCloseCaptcha = () => {
    setCaptchaOpen(false)
  }

  const onCaptchaSunccess = (result) => {
    setVerifyCodeForChangeAccount({
      lotNumber: result.lotNumber,
      validateResult: result.validateResult,
    }).then((res) => {
      if (res.ErrorCode == '0') {
        message.success('验证码发送成功，请注意查收', 1.5)
      } else {
        message.error('验证码发送失败，请重试', 1.5)
      }
    })
  }

  const onOk = () => {
    loginBySwitch(curTab, code).then(
      (res) => {
        if (res.ErrorCode == '0' && res.Data && res.Data.wsid && res.Data.isSucceed) {
          sessionStorageManager.set('GEL-wsid', res.Data.wsid)
          setVisible(false)
          message.success('切换用户成功，正在为您重新跳转...', 1.5)
          setTimeout(() => {
            window.location.reload()
          }, 2000)
        } else {
          message.error('操作失败，请稍后重试', 1.5)
          setVisible(false)
        }
      },
      () => {
        message.error('操作失败，请稍后重试', 1.5)
        setVisible(false)
      }
    )
  }

  const onChangeEvent = (e) => {
    let val = e.target.value
    val = val.trimStart()

    if (val.length === 0 || val.split(' ').join('').length === 0) {
      setCode('')
    } else if (val.length > 6) {
      val = val.substr(0, 6)
      setCode(val)
    } else {
      val = val.replace(/\\|↵|<|>/g, '')
      setCode(val)
    }
  }

  const tabClickEvent = (t) => {
    if (currentAccountLogin === t.userType) return false
    setCurTab(t.userType)
    if (is_terminal) return
    setVisible(true)
    setCode('')
  }

  return (
    <>
      <div className="customer-title">{intl('20977', '我的账户')}</div>
      <div className="customer-content customer-account-content">
        {data?.length ? (
          <div className="account-card">
            {data?.map((t) => {
              return (
                <div
                  className={`account-card-item  ${currentAccountLogin == t.userType ? 'account-card-item-sel' : ''} `}
                  onClick={() => {
                    return tabClickEvent(t)
                  }}
                >
                  <div className="account-item-tag">
                    <span>当前</span>
                  </div>
                  <img src={t.userType == '312' ? accountPerson : accountCorp} alt="" />
                  <div className="account-label">
                    <div className="account-label-item">
                      <span>账户类型：</span>
                      <span>{AccountTypeToName[t.userType] || '--'}</span>
                    </div>
                    {t.userType == '312' ? null : (
                      <div className="account-label-item">
                        <span>{intl('100016', '所在公司')}：</span>
                        <span>{t.companyName || '--'}</span>
                      </div>
                    )}
                    <div className="account-label-item">
                      <span>{intl('', '账号权益')}：</span>
                      <span>{AccountPkgToName[t.packageName] || '--'}</span>
                    </div>

                    {t.packageName === 'EQ_APL_GEL_BS' ? null : (
                      <div className="account-label-item">
                        <span>{intl('89265', '到期时间')}：</span>
                        <span>{wftCommon.formatTime(t.expireDate)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : null}
        <div className="account-tips">{window.en_access_config ? tipsEn : tipsZh}</div>

        {/* @ts-expect-error */}
        <Modal
          wrapClassName={'account-change-modal'}
          title={'账号切换'}
          visible={visible}
          onCancel={() => {
            setVisible(false)
          }}
          footer={[
            <Button key="confirm" type="primary" onClick={onOk}>
              {intl('19482', '确认')}
            </Button>,
          ]}
        >
          <div>
            <div style={{ marginBottom: '12px' }}>切换账号时需要进行手机验证：</div>
            <Input className={`account-captcha-input`} value={phone} readOnly disabled />

            <div className="account-code-input">
              <Input
                className={`account-captcha-input`}
                value={code}
                placeholder={intl('', '请输入验证码')}
                onChange={onChangeEvent}
              />
              <Button onClick={onGetCode} disabled={time < timeout ? true : false}>
                {time > timeout - 1 ? intl('343424', '获取验证码') : time + 'S ' + intl('343424', '重新获取')}
              </Button>
              <CaptchaComp
                open={captchaOpen}
                onSuccess={onCaptchaSunccess}
                onClose={onCloseCaptcha}
                appName={'wind.ent.web'}
              />
            </div>
          </div>
        </Modal>

        {/* <Table key="customer-account" title={'当前账户权益一览'} dataSource={data || []} columns={accountRows} bordered="dotted" loading={!data} locale pagination={false}></Table> */}
      </div>
    </>
  )
}
