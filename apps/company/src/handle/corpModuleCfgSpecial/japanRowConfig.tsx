// 日本企业 自定义模块
import React from 'react'
import { intlNoIndex } from '@/utils/intl'
import { ICorpPrimaryModuleCfg } from '@/components/company/type'

const intl = intlNoIndex
export const japanRowConfig: ICorpPrimaryModuleCfg = {
  showHistoryChange: {
    title: window.en_access_config ? 'History Changes' : '变更历史',
    cmd: '/detail/company/changehistory',
    modelNum: 'changeHistoryCount',
    thWidthRadio: ['4%', '36%'],
    thName: [intl('28846', '序号'), intl('19528', '时间'), intl('19500', '内容')],
    align: [1, 0, 0],
    fields: ['NO.', 'date|formatTime', 'detail'],
    columns: [
      null,
      null,
      {
        render: (txt, row, idx) => {
          const type = row.type
          const content = row.content
          const before = row.changeBefore
          const reason = row.changeReason ? (
            <div>
              <span>変更の事由：</span>
              <span>{row.changeReason}</span>
            </div>
          ) : null
          if (type === 1) {
            // japan
            return (
              <>
                {reason}
                {before &&
                  before.length &&
                  before.map((t, idx) => {
                    if (before.length > 1) {
                      if (!idx) {
                        return (
                          <div>
                            <span>旧情報：</span>
                            <span>{t}</span>
                          </div>
                        )
                      } else {
                        return (
                          <div>
                            <span>{t}</span>
                          </div>
                        )
                      }
                    } else {
                      return (
                        <div>
                          <span>旧情報：</span>
                          <span>{t}</span>
                        </div>
                      )
                    }
                  })}
              </>
            )
          } else if (type === 2) {
            return content
          }
          return '--'
        },
      },
    ],
    extraParams: (param) => {
      return {
        ...param,
        __primaryKey: param.companycode,
      }
    },
  },
}
