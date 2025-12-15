export type ITechScoreChartOpts = {
  data: {
    name: string
    value: number[]
  }[]
  indicator: {
    name: string
    max: number
  }[]
  style: {
    height: string
    width: string
  }
  radarExtras: {
    name: {
      textStyle: {
        color: string
      }
    }
    radius?: number
  }
  centerTxt?: string
  centerTxtFontSize?: number
  tooltipPos?: string
}
