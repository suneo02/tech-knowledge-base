// import { TYPES } from '@visactor/vtable'

interface CustomCellProps {
  width: number
  height: number
  dataValue: string
  from: 'CDE' | 'AI'
}

export const renderCustomCell = ({ width, height, dataValue, from }: CustomCellProps) => {
  const elements = []

  // if (from) {
  //   const color = from === 'CDE' ? AI_COLORS.ai : AI_COLORS['ai-auto']
  //   const tooltipText = from === 'CDE' ? '该内容由CDE生成' : '该内容由AI自动生成'

  //   elements.push({
  //     type: 'icon',
  //     svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10">
  //         <rect width="10" height="10" fill="${color}" rx="2"/>
  //       </svg>`,
  //     x: width - 18,
  //     y: 8,
  //     width: 10,
  //     height: 10,
  //     cursor: 'pointer',
  //     tooltip: {
  //       style: DEFAULT_TOOLTIP_STYLE,
  //       title: tooltipText,
  //       placement: TYPES.Placement.top,
  //     },
  //     event: {
  //       hover: {
  //         bgColor: 'rgba(0, 0, 0, 0.04)',
  //       },
  //     },
  //   })
  // }

  elements.push({
    type: 'text',
    fill: '#000',
    fontSize: 14,
    fontWeight: 500,
    textBaseline: 'middle',
    text: dataValue,
    x: 12,
    y: height / 2,
    maxLineWidth: width - (from ? 18 + 10 : 0),
    textAlign: 'left',
  })

  return {
    elements,
    expectedHeight: height,
    expectedWidth: width,
  }
}
