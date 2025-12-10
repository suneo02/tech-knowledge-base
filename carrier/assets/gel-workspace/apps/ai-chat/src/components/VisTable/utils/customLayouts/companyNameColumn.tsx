import { ColumnDefine } from '@visactor/vtable'
import { VGroup, VText } from '@visactor/vtable'
import { COLUMN_GENERATING_TEXT, ERROR_TEXT, GENERATE_TEXT, REFERENCE_EMPTY_TEXT } from '../../config/status'
import { generateUrlByModule, LinkModule } from 'gel-util/link'
import { usedInClient } from 'gel-util/env'

const generateCompanyLink = (companyCode: string) =>
  generateUrlByModule({ module: LinkModule.COMPANY_DETAIL, params: { companycode: companyCode } })

export const buildCompanyNameColumn = (defaultColumn: ColumnDefine) => {
  return {
    ...defaultColumn,
    isCompanyNameColumn: true,
    customLayout: (args) => {
      const { table, row, col, rect, dataValue } = args
      const { height, width } = rect ?? table.getCellRect(col, row)
      const record = args.table.getRecordByCell(col, row)
      const columnId = args.table.getHeaderField(col, row)
      const companyCode = record[`${columnId}&CODE`]

      const isStatusText = [GENERATE_TEXT, COLUMN_GENERATING_TEXT, REFERENCE_EMPTY_TEXT, ERROR_TEXT].includes(dataValue)

      const getTextStyle = () => {
        if ([GENERATE_TEXT, COLUMN_GENERATING_TEXT].includes(dataValue)) return 'italic'
        return 'normal'
      }

      const container = (
        <VGroup
          attribute={{
            width,
            height,
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            cursor: isStatusText ? 'default' : 'pointer',
          }}
        >
          <VText
            attribute={{
              text: dataValue || '',
              fontSize: 14,
              fill: '#333',
              fontStyle: getTextStyle(),
              textAlign: 'left',
              textBaseline: 'middle',
              cursor: isStatusText ? 'default' : 'pointer',
              boundsPadding: [0, 0, 0, 8],
              // @ts-expect-error textOverflow is supported in runtime
              textOverflow: 'ellipsis',
              lineClamp: 1,
              maxLineWidth: Math.max(0, (width ?? 0) - 16),
              fontFamily: 'Arial,sans-serif',
            }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            stateProxy={(stateName: any) => {
              if (stateName === 'hover' && companyCode) {
                return { fill: '#0596b3' }
              }
              return {}
            }}
            onMouseEnter={(event) => {
              event.currentTarget.addState('hover', true, false)
              event.currentTarget.stage.renderNextFrame()
            }}
            onMouseLeave={(event) => {
              event.currentTarget.removeState('hover', false)
              event.currentTarget.stage.renderNextFrame()
            }}
            onClick={(event) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const anyEvent: any = event
              const button = anyEvent?.button ?? anyEvent?.originalEvent?.button ?? anyEvent?.srcEvent?.button ?? 0
              if (button !== 0) {
                event.stopPropagation?.()
                return
              }
              if (!companyCode || isStatusText) {
                event.stopPropagation?.()
                return
              }
              const companyLink = generateCompanyLink(companyCode)
              if (companyLink) {
                if (usedInClient()) {
                  window.location.href = companyLink
                } else {
                  window.open(companyLink, '_blank', 'noopener,noreferrer')
                }
              }
              event.stopPropagation?.()
            }}
            onContextMenu={(event) => {
              event.preventDefault?.()
              event.stopPropagation?.()
            }}
          />
        </VGroup>
      )

      return {
        rootContainer: container,
        renderDefault: false,
      }
    },
    width: 300,
  }
}
