import React, { useEffect, useState } from 'react'
import PreInput from '@/components/common/search/PreInput'
import intl from '@/utils/intl'
import { getCompanyName } from '@/api/searchListApi.ts'
import { wftCommon } from '@/utils/utils'
import { SwapO } from '@wind/icons'
import './index.less'

const InputChangeComp = ({ type, companyCode, onChangeCorpAction }) => {
  const [showInput, setShowInput] = useState(false)
  const [companycode, setCompanycode] = useState(companyCode)
  const [companyInfo, setCompanyInfo]: any = useState({})

  useEffect(() => {
    console.log('companyCode', companycode)
    if (!companycode) return
    const fn = async () => {
      const res = await getCompanyName({
        companycode: companycode,
      })

      if (!res?.Data) return

      setCompanyInfo(res?.Data)
      onChangeCorpAction &&
        onChangeCorpAction({
          newCode: companycode,
          financial: res?.Data?.is_financial ? true : false,
          newName: res?.Data?.companyName,
        })
    }
    fn()
    return () => {}
  }, [type, companycode])

  return (
    <div className="input-change-comp clearfix">
      {showInput ? (
        <div className="search-relation">
          <div className="search-relation-from">
            <PreInput
              type="text"
              defaultValue={companyInfo?.companyName}
              className="input-search-relation"
              width={280}
              style={{
                display: 'inline-block',
              }}
              autocomplete="off"
              id="inputSearchRelation02"
              maxlength="14"
              selectItem={(t) => {
                setShowInput(false)
                setCompanycode(t?.id)
                setCompanyInfo({
                  companyName: t.name,
                  companyId: t?.id,
                })
              }}
            ></PreInput>
            <span
              onClick={() => {
                setShowInput(false)
              }}
              className="wi-demo-link wi-demo-link-switch"
              style={{
                lineHeight: '36px',
                cursor: 'pointer',
                marginLeft: '50px',
              }}
            >
              {intl('19405', '取消')}
            </span>
          </div>
        </div>
      ) : (
        <div className="input-change-comp-content">
          <span
            className="label"
            onClick={() => {
              wftCommon.linkCompany('Bu3', companycode)
            }}
          >
            {companyInfo?.companyName}
          </span>
          <span
            onClick={() => {
              setShowInput(true)
            }}
            className="switch"
          >
            <SwapO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
            {intl('367453', '切换企业')}
          </span>
        </div>
      )}
    </div>
  )
}

export default InputChangeComp
