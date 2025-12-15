import { createWFCRequest } from '@/api'
import { useAddConversation } from '@/hooks/useAddConversation'
import { useNavigateWithLangSource } from '@/hooks/useLangSource'
import { formatFilterDisplayString } from '@/pages/SuperChat/CDE/utils/formatFilterDisplayString'
import { useAppDispatch } from '@/store'
import { fetchFilterCategories, selectFilterCategories } from '@/store/CDE'
import { Spin } from '@wind/wind-ui'
import type { CDEFormBizValues, CDEFormConfigItem, CDEFormRef, CDEFormValues, CDEMenuConfigItem } from 'cde'
import { CDEMeasureDefaultForSL, CDEMenu } from 'cde'
import { QueryFilter } from 'gel-api'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { CDEModalOptions } from '../../CDEModal'
import { useAddDataToSheet } from '../../hooks/useAddDataToSheet'
import { useSearchApi } from '../../hooks/useSearchApi'
import Footer from '../Footer'

export interface CDEContainerProps extends CDEModalOptions {
  config?: CDEMenuConfigItem[]
}

const DEFAULT_VALUES: CDEFormBizValues[] = [
  {
    field: 'data_from',
    itemId: '78',
    logic: 'any',
    title: '机构类型',
    value: ['298010000,298020000,298040000'],
  },
  {
    field: 'govlevel',
    itemId: '77',
    logic: 'any',
    title: '营业状态',
    value: ['存续'],
  },
]

const CDEContainer: React.FC<CDEContainerProps> = ({ tableId, sheetId, initialValues: values, onOk }) => {
  const [initialValues, setInitValues] = useState<CDEFormBizValues[]>()
  useEffect(() => {
    setInitValues(values || DEFAULT_VALUES)
  }, [values])
  const [filterCategories, setFilterCategories] = useState<CDEMenuConfigItem[]>([])
  const dispatch = useAppDispatch()
  const reduxFilterCategories = useSelector(selectFilterCategories)

  useEffect(() => {
    dispatch(fetchFilterCategories())
  }, [dispatch])
  // console.log('🚀 ~ reduxFilterCategories:', reduxFilterCategories)

  const [pageLoading, setPageLoading] = useState(false)
  const [currentFilters, setCurrentFilters] = useState<CDEFormBizValues[]>([])
  const navigate = useNavigateWithLangSource()
  const { addConversation, addConversationLoading } = useAddConversation({
    onSuccess: (data) => {
      if (data.Data) {
        navigate(`/super/chat/${data.Data.data.conversationId}?type=CDE`)
      }
    },
  })

  const { addDataToSheet, loading: addDataToSheetLoading } = useAddDataToSheet((res) => {
    if (res.Data) {
      onOk?.(res.Data.data)
    }
  })

  useEffect(() => {
    setPageLoading(addConversationLoading || addDataToSheetLoading)
  }, [addConversationLoading, addDataToSheetLoading])

  const cdeMenuRef = useRef<CDEFormRef>(null)

  const { fetch, loading, data } = useSearchApi()

  useEffect(() => {
    if (reduxFilterCategories) {
      const list = reduxFilterCategories.map((item) => {
        return {
          id: item.categoryId,
          name: item.category,
          value: item.categoryId,
          label: item.category,
          children: item.newFilterItemList,
        }
      })
      setFilterCategories(list as CDEMenuConfigItem[])
    }
  }, [reduxFilterCategories])

  const onValuesChange = (_: CDEFormValues, allValues: CDEFormBizValues[]) => {
    setCurrentFilters(allValues)
    fetch(allValues as QueryFilter[])
  }

  const onSubmit = (pageSize: number, currentTable?: boolean) => {
    cdeMenuRef.current
      ?.submit()
      .then((filters: CDEFormBizValues[]) => {
        const flatList = reduxFilterCategories?.flatMap((item) => item.newFilterItemList)
        const cdeDescription = formatFilterDisplayString(filters, flatList as CDEFormConfigItem[])

        const cdeFilterCondition = {
          pageNum: 1,
          pageSize: pageSize,
          superQueryLogic: {
            filters: filters as QueryFilter[],
            measures: CDEMeasureDefaultForSL,
          },
          order: {
            orderBy: 'count.domain_num',
            orderType: 0,
          },
          largeSearch: false,
          fromTemplate: false,
        }

        if (currentTable) {
          addDataToSheet({
            tableId: tableId || '',
            sheetId: Number(sheetId),
            dataType: 'CDE_FILTER',
            cdeDescription,
            cdeFilterCondition,
            enablePointConsumption: 1,
          })
        } else {
          addConversation({
            cdeDescription,
            cdeFilterCondition,
            conversationType: 'CDE_FILTER',
          })
        }
      })
      .catch((err) => {
        console.error(err)
      })
  }

  const onReset = () => {
    setInitValues(DEFAULT_VALUES)
    setTimeout(() => {
      cdeMenuRef.current?.resetFields()
    }, 200)
    fetch(DEFAULT_VALUES as QueryFilter[])
    setCurrentFilters(DEFAULT_VALUES)
  }

  const init = () => {
    cdeMenuRef.current?.resetFields()
    fetch(initialValues as QueryFilter[])
    setCurrentFilters(initialValues || DEFAULT_VALUES)
  }

  useEffect(() => {
    init()
  }, [initialValues])

  return (
    // @ts-expect-error wind-ui 类型错误
    <Spin spinning={pageLoading}>
      <div
        style={{
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 400,
          height: '100%',
        }}
      >
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <CDEMenu
            ref={cdeMenuRef}
            config={filterCategories}
            onValuesChange={onValuesChange}
            initialValues={initialValues}
            loading={!filterCategories?.length}
          />
        </div>
        <Footer
          tableId={tableId}
          sheetId={sheetId}
          loading={loading}
          total={data?.Data?.page?.total || 0}
          onReset={onReset}
          onSubmit={onSubmit}
          onSave={() => setPageLoading(true)}
          onFinish={() => setPageLoading(false)}
          filters={currentFilters}
          saveSubFunc={createWFCRequest('operation/insert/addsubcorpcriterion')}
        />
      </div>
    </Spin>
  )
}

export default CDEContainer
