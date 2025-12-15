import * as VTable from '@visactor/vtable'
import { StylePropertyFunctionArg } from '@visactor/vtable/es/ts-types'
function getBackgroundColor(args: StylePropertyFunctionArg): string {
  const { row, table } = args
  const index = row - table.frozenRowCount
  if (!(index & 1)) {
    return '#FFF'
  }
  return '#f2f3f3'
}
export const WIND_UI_THEME = VTable.themes.ARCO.extends({
  frameStyle: {
    cornerRadius: 0,
    borderColor: '#ecedee',
    shadowColor: 'transparent',
    shadowBlur: 0,
  },
  selectionStyle: {
    cellBorderColor: '#0596b3',
    cellBgColor: 'rgba(211, 238, 245, .2)',
    inlineRowBgColor: 'rgba(134, 219, 235, .2)',
  },

  cornerHeaderStyle: {
    bgColor: '#e6e7e9',
  },
  headerStyle: {
    bgColor: '#e6e7e9',
    hover: {
      //   cellBorderColor: "#003fff",
      cellBgColor: 'rgba(211,238,245,.6)',
      inlineRowBgColor: 'rgba(211,238,245,.6)',
      inlineColumnBgColor: 'rgba(211,238,245,.6)',
    },
    color: '#333',
  },
  bodyStyle: {
    bgColor: getBackgroundColor,
    hover: {
      cellBgColor: '#d3eef5',
      inlineRowBgColor: '#eaf6fa',
      // inlineColumnBgColor: '#eaf6fa',
    },
  },
  columnResize: {
    lineWidth: 1,
    lineColor: '#0596b3',
    bgColor: 'rgba(211,238,245,.6)',
    width: 3,
    labelBackgroundFill: '#0596b3',
  },
  scrollStyle: {
    visible: 'focus',
    scrollSliderColor: '#0596b3',
    scrollRailColor: '#bac3cc',
    hoverOn: false,
    barToSide: true,
    width: 6,
  },
  dragHeaderSplitLine: {
    lineColor: '#0596b3',
    lineWidth: 1,
  },
})
