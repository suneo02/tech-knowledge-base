import { ColumnDefine } from '@visactor/vtable'
import { VGroup, VText } from '@visactor/vtable'
import { COLUMN_GENERATING_TEXT, ERROR_TEXT, GENERATE_TEXT, REFERENCE_EMPTY_TEXT } from '../../config/status'
const generateLink = (link: string): string => {
  return `http://${link}`
}

export const buildLinkColumn = (defaultColumn: ColumnDefine) => {
  return {
    ...defaultColumn,
    isCompanyNameColumn: true,
    customLayout: (args) => {
      const { dataValue, rect } = args
      const { width, height } = rect ?? {}

      const enableLink = dataValue && dataValue !== '--'

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
            cursor: enableLink ? 'pointer' : 'default',
          }}
        >
          <VText
            attribute={{
              text: dataValue || '',
              fontSize: 14,
              fontWeight: 400,
              fill: '#333',
              fontStyle: getTextStyle(),
              textAlign: 'left',
              textBaseline: 'middle',
              // cursor: enableLink ? 'pointer' : 'default',
              boundsPadding: [0, 0, 0, 8],
              // @ts-expect-error textOverflow is supported in runtime
              textOverflow: 'ellipsis',
              lineClamp: 1,
              maxLineWidth: Math.max(0, (width ?? 0) - 16),
              // underline: enableLink,
              fontFamily: 'Arial,sans-serif',
            }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            stateProxy={(stateName: any) => {
              if (stateName === 'hover' && enableLink) {
                return { fill: '#00aec7', cursor: 'pointer' }
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
              if (!enableLink) {
                event.stopPropagation?.()
                return
              }
              const links = generateLink(dataValue)
              window.open(links, '_blank', 'noopener,noreferrer')
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
