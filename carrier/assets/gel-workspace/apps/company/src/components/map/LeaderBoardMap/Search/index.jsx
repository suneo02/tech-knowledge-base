import { Select } from '@wind/wind-ui'
import intl from '@/utils/intl'

/**
 * @returns onChange({ oldCode: string, name: string })
 */
export default (props) => {
  // console.log('🚀 ~ props:', props)

  // const [options, setOptions] = useState(props.options)

  // const getOptions = () => {
  //   const chinaMapWithPinyin = localStorage.getItem('ChinaMapWithPinyin')
  //   const list = JSON.parse(chinaMapWithPinyin)?.citylist
  //   if (list) {
  //     const _options = list.map((res) => ({
  //       name: window.en_access_config ? res.p_en : res.p,
  //       key: oldCodeNameMap[res.p],
  //       title: window.en_access_config ? res.p_en : res.p,
  //     }))
  //     setOptions(_options)
  //   } else {
  //     wftCommon.getPinyinMaps().then((data) => {
  //       if (data && Number(data.resultCode) === 200 && data.resultData) {
  //         wftCommon.setPinyinMap(data)
  //         getOptions()
  //       }
  //     })
  //   }
  // }

  // useEffect(() => {
  //   getOptions()
  // }, [])

  return (
    <Select
      allowClear
      placeholder="请选择"
      value={props.value}
      style={{ minWidth: 200 }}
      onChange={(e) => {
        let params
        if (e) {
          params = props?.options.find((res) => res.oldCode === e)
        } else {
          params = { oldCode: '', name: intl('51886', '全国'), code: '' }
        }
        props.onChange(params)
      }}
      data-uc-id="MnQLtOrQUt"
      data-uc-ct="select"
    >
      <Select.Option key="" title={intl('51886', '全国')} data-uc-id="o81OEKJ26z" data-uc-ct="select">
        {intl('51886', '全国')} {`  (${props?.options?.reduce((pre, next) => pre + next.value, 0) || 0})`}
      </Select.Option>
      {props?.options
        ?.filter((res) => res.code)
        ?.map(({ oldCode, name, title, value }) => {
          return (
            <Select.Option key={oldCode} title={title} data-uc-id="u-NrljCc0Q" data-uc-ct="select" data-uc-x={oldCode}>
              {name}
              {`  (${value})`}
            </Select.Option>
          )
        })}
    </Select>
  )
}
