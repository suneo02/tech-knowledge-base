import React, { useMemo, useState } from 'react'
import { getIndustryCodes } from '../../../../lib/utils'
import IndustryCascader from '../../../myCascader/IndustryCascader'
import intl from '../../../../utils/intl'
import { Button } from '@wind/wind-ui'

/**
 * @deprecated
 * 移步 ts 版
 */
const IndustrySelect = (props) => {
  const {
    value,
    industryData = [],
    defaultOption = [],
    changeOptionCallback = () => null,
    industryLv3 = false,
    industryLv4 = false,
    labels4see = [],
    showFooter,
  } = props
  const defaultValue = useMemo(() => {
    // 初始化默认数据
    let resArr = []
    defaultOption.forEach((option, idx) => {
      if (labels4see && labels4see[idx]) {
        resArr.push(getIndustryCodes(option, labels4see[idx])[0])
      } else {
        resArr.push(getIndustryCodes(option))
      }
    })
    return resArr
  }, [defaultOption])

  const [val, setVal] = useState(value)

  const [refresh, setRefresh] = useState(true) // 强制更新组件

  const onChange = (value, label) => {
    let res = []
    let resLabel = []
    value.forEach((item) => {
      res.push(item[item.length - 1])

      resLabel.push(item)
    })
    console.log(res)
    changeOptionCallback(res, resLabel)
  }

  return (
    <>
      <div
        style={{
          height: showFooter ? '450px' : 'auto',
        }}
      >
        {refresh && (
          <IndustryCascader
            {...props}
            value={value}
            placeholder={intl('355853', '请选择查询行业')}
            open={refresh}
            options={industryData}
            defaultValue={defaultOption.length === 0 ? [] : defaultValue}
            onChange={onChange}
            industryLv4={industryLv4}
            industryLv3={industryLv3}
          />
        )}
      </div>
      {showFooter ? (
        <div
          style={{
            right: '12px',
            bottom: '-12px',
            overflow: 'hidden',
            // position: 'absolute',
          }}
        >
          <Button
            style={{
              float: 'right',
              // marginTop: '12px',
            }}
            onClick={() => {
              showFooter.onSubmit && showFooter.onSubmit()
            }}
          >
            {intl('257693', '应用筛选')}
          </Button>
          <Button
            style={{
              // marginTop: '12px',
              // position:'absolute',
              float: 'right',
              marginRight: '12px',
            }}
            onClick={() => {
              setRefresh((pre) => !pre)
              setTimeout(() => {
                setRefresh((pre) => !pre)
              }, 20)
              showFooter.onCLear && showFooter.onCLear()
            }}
          >
            {intl('149222', '清空')}
          </Button>
        </div>
      ) : (
        <></>
      )}
    </>
  )
}

export default IndustrySelect
