import React, { useMemo, useState } from 'react'
import { getIndustryCodes } from '../../../../lib/utils'
import { WindCascade } from '@/components/cascade/WindCascade'
import intl from '../../../../utils/intl'
import { Button } from '@wind/wind-ui'

/**
 * CascaderSelect组件的属性类型
 */
interface CascaderSelectProps {
  value: any[][] // 级联选择器值
  data?: any[] // 级联数据
  defaultOption?: any[] // 默认选项
  changeOptionCallback?: (res: any[], resLabel: any[]) => void // 选项变化回调
  labels4see?: any[] // 标签
  showFooter?: {
    onSubmit?: () => void // 提交回调
    onCLear?: () => void // 清空回调
  }
  maxTagCount?: number | 'responsive' // 最大标签数
}

/**
 *
 *
 */
const CascaderSelect: React.FC<CascaderSelectProps> = (props) => {
  const {
    value,
    data = [],
    defaultOption = [],
    changeOptionCallback = () => null,
    labels4see = [],
    showFooter,
    maxTagCount,
  } = props
  const defaultValue = useMemo(() => {
    // 初始化默认数据
    const resArr = []
    defaultOption.forEach((option, idx) => {
      if (labels4see && labels4see[idx]) {
        resArr.push(getIndustryCodes(option, labels4see[idx])[0])
      } else {
        resArr.push(getIndustryCodes(option))
      }
    })
    return resArr
  }, [defaultOption])

  const [refresh, setRefresh] = useState(true) // 强制更新组件

  const onChange = (cascadeValue) => {
    console.log('🚀 ~ onChange ~ cascadeValue:', cascadeValue)
    const res = []
    const resLabel = []
    cascadeValue.forEach((item) => {
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
          height: showFooter ? '494px' : 'auto',
        }}
      >
        {refresh && (
          <WindCascade
            value={value}
            options={data}
            onChange={onChange}
            placeholder={intl('355853', '请选择查询行业')}
            open={true}
            defaultValue={defaultOption.length === 0 ? [] : defaultValue}
            fieldNames={{ label: 'name', value: 'code' as any, children: 'node' }}
            showSearch
            multiple={true}
            expandTrigger="hover"
            dropdownMatchSelectWidth
            maxTagCount={maxTagCount}
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
              if (showFooter.onSubmit) showFooter.onSubmit()
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
              if (showFooter.onCLear) showFooter.onCLear()
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

export default CascaderSelect
