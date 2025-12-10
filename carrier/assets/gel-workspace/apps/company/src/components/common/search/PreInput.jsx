import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle, useCallback } from 'react'
import { Input } from '@wind/wind-ui'
import { getPreCorpSearchNew, getPreCompanySearch } from '../../../api/homeApi'
import intl from '../../../utils/intl'
import './PreInput.less'
import { debounce, wftCommon } from '../../../utils/utils'
import { CloseCircleF } from '@wind/icons'
import InnerHtml from '@/components/InnerHtml'

/**
 * 预搜索组件
 * @param {*} needHighLight 是否需要展示em高亮字段，默认false
 * @param {*} width 默认宽度400
 * @param {*} pageSize 默认获取5条数据下拉展示
 * @param {*} selectItem 选中后回调
 * @param {*} needRealCode 是否需要返回10位的非加密原始code
 * @param {*} css 传入样式
 */
const PreInput = forwardRef(
  (
    {
      placeholder = intl('315909', '请输入公司名称'),
      width = 400,
      defaultValue = '',
      pageSize = 5,
      needHighLight = false,
      selectItem = null,
      needRealCode = false,
      css = '',
      style = {},
      emptyCallback = null,
      ...props
    },
    ref
  ) => {
    const [list, setList] = useState([])
    const [searchValue, setSearchValue] = useState(defaultValue)
    const [focus, setFocus] = useState(false)
    const inputRef = useRef(null)

    // 为每个组件实例创建独立的防抖函数
    const debounceSearch = useCallback(
      debounce((param, fn) => {
        getPreCompanySearch(param)
          .then((res) => {
            fn && fn(res)
          })
          .catch(() => {
            fn && fn(null)
          })
      }, 300),
      []
    )

    // 暴露方法给父组件
    useImperativeHandle(ref, () => ({
      // 聚焦输入框
      focus: () => {
        inputRef.current?.focus()
      },
      // 失焦输入框
      blur: () => {
        inputRef.current?.blur()
      },
      // 清空输入框
      clear: () => {
        setSearchValue('')
        setList([])
        if (emptyCallback) {
          emptyCallback()
        }
      },
      // 获取当前值
      getValue: () => searchValue,
      // 设置值
      setValue: (value) => {
        setSearchValue(value)
      },
    }))

    useEffect(() => {
      if (defaultValue) setSearchValue(defaultValue)
    }, [defaultValue])

    useEffect(() => {
      // 长度<2 不搜索
      if (!searchValue || searchValue?.length < 2) {
        if (list?.length) {
          setList([])
        }
        return
      }
      debounceSearch(
        {
          queryText: searchValue,
          pageSize,
        },
        (res) => {
          if (res?.code == 0) {
            const lists = res.data?.search || []
            lists.map((t) => {
              // 需要显示高亮，将对应的em标签内信息提出来
              if (needHighLight) {
                t.highlightName = t.corpName
              }
              t.corp_name = t.corpName.replace(/<em>|<\/em>/g, '')
              t.corp_id = t.corpId
              t.corp_name_en = t.corpNameEng ? t.corpNameEng.replace(/<em>|<\/em>/g, '') : ''
            })
            setList(lists)
          } else {
            setList([])
          }
        }
      )
    }, [searchValue, debounceSearch])

    const onChangeEvent = (e) => {
      let val = e.target.value
      val = val.trimStart()
      if (val.length === 0 || val.split(' ').join('').length === 0) {
        setSearchValue('')
        setList([])
      } else {
        val = val.replace(/\\|↵|<|>/g, '')
        setSearchValue(val)
      }
    }
    const onBlurEvent = (e) => {
      setTimeout(() => {
        setFocus(false)
      }, 500)
    }
    const onFocusEvent = (e) => {
      setFocus(true)
    }
    const onSelect = (t) => {
      setSearchValue(t.corp_name)
      if (needRealCode) {
        t.corp_id = getRealCode(t.corp_id)
      }
      selectItem &&
        selectItem({
          id: t.corp_id,
          name: window.en_access_config && t.corp_name_en ? t.corp_name_en : t.corp_name,
        })
    }

    const getRealCode = (code) => {
      if (code?.length === 15) {
        return code.substr(2, 10)
      }
      return code
    }

    const onDelete = () => {
      setSearchValue('')
      setList([])
      if (emptyCallback) {
        emptyCallback()
      }
    }

    return (
      <div
        className={`pre-search-input ${css}`}
        style={{
          width: width,
          ...style,
        }}
      >
        <Input
          ref={inputRef}
          placeholder={placeholder}
          {...props}
          value={searchValue}
          onChange={onChangeEvent}
          onBlur={onBlurEvent}
          onFocus={onFocusEvent}
          data-uc-id="61Atet-SNz"
          data-uc-ct="input"
        />
        {searchValue && (
          <CloseCircleF
            className="pre-search-close"
            onClick={onDelete}
            data-uc-id="1XqUAbafcO"
            data-uc-ct="closecirclef"
          />
        )}
        {focus && list && list.length ? (
          <div className="pre-search-list">
            {list.map((t, idx) => {
              return (
                <div
                  key={t.corp_id || idx}
                  className={`pre-search-list-li ${window.en_access_config ? 'pre-search-list-li-en' : ''}`}
                  onClick={() => {
                    onSelect(t)
                  }}
                  data-uc-id="PJkXC_t0Zb"
                  data-uc-ct="div"
                  data-uc-x={t.corp_id || idx}
                >
                  <InnerHtml html={needHighLight ? t.highlightName : t.corp_name} />
                  {window.en_access_config && t.corp_name_en ? (
                    <span className="pre-search-list-li-tag">{t.corp_name_en}</span>
                  ) : null}
                </div>
              )
            })}
          </div>
        ) : null}
      </div>
    )
  }
)

PreInput.displayName = 'PreInput'

export default PreInput
