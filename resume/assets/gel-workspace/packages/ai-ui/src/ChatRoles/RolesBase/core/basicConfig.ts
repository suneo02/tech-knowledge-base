export const DEFAULT_YAXIS = {
  axisLabel: {
    margin: 8,
    textStyle: {
      fontSize: 12,
      color: '#666666',
    },
  },
  axisTick: {
    length: 0
  }
};

export default {
  title: {
    show: false,
    text: '',
    padding: [5, 0, 15, 0],
    textAlign: 'left',
    left: 0,
    textStyle: {
      width: 200,
      fontSize: 14,
      fontWeight: 'bold',
      color: '#333333',
      lineHeight: 22,
      overflow: 'truncate',
      ellipsis: '...',
    }
  },
  defaultPadding: {
    top: 0,
    bottom: 0,
  },
  textStyle: {
    fontWeight: 'normal',
    overflow: 'truncate',
    ellipsis: '...',
  },
  tooltip: {
    show: false
  },
  background: {
    color: 'transparent',
  },
  legend: {
    // type: 'scroll',
    overflowType: true, // 不为'layout'和false
    itemWidth: 20,
    itemHeight: 10,
    padding: [4, 0, 0, 0],
    textStyle: {
      fontSize: 12,
      padding: [0, 8],
      color: '#333333',
    }
  },
  xAxis: {
    '0:0-xAxis-0': {
      // X轴刻度: 1px / #3E4149 / 长度4px
      axisTick: {
        interval: 0,
        show: true,
        length: 4,
        lineStyle: {
          width: 1,
          color: '#3E4149'
        }
      },
      // 轴标签：12px / 常规体 / #666666 / 距x轴刻度4px，距y轴刻度8px /轴标签最小间距8px
      axisLabel: {
        // interval: 0,
        margin: 12,
        showMinLabel: true,
        showMaxLabel: true,
        textStyle: {
          fontSize: 12,
          color: '#666666',
        },
      },
      // x轴轴线：1px / #3E4149
      axisLine: {
        show: true,
        lineStyle: {
          width: 1,
          color: '#3E4149',
        }
      },
      splitLine: {
        show: false,
      },
      scale: true,
    },
  },
  yAxis: {
    '0:0-yAxis-0': {
      ...DEFAULT_YAXIS
    },
  },
};
