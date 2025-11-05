import { VGroup, VText, VImage } from '@visactor/vtable'
const multiTableRenderUitls = ({ width, height, columnId, cellInfo, cellValue }) => {
  const runContainer = () => {
    const container = (
      <VGroup
        id="container"
        attribute={{
          width,
          height,
          display: 'flex',
          flexWrap: 'wrap',
          alignContent: 'center',
        }}
      >
        <VGroup
          attribute={{
            width: width - 30,
            height,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <VText
            attribute={{
              text: cellValue,
              fontSize: 13,
              fontFamily: 'sans-serif',
              fill: 'black',
              overflow: 'hidden',
              boundsPadding: [0, 0, 0, 10],
            }}
          ></VText>
        </VGroup>
        <VGroup attribute={{ width: 30, height, display: 'flex', alignItems: 'center', opacity: 0 }}>
          <VImage
            attribute={{
              width: 20,
              height: 20,
              image:
                '<svg t="1742368233557" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1671" width="200" height="200"><path d="M516.5 869c-49.4 0-97.3-9.7-142.5-28.8-43.6-18.4-82.7-44.8-116.3-78.4s-60-72.7-78.4-116.3c-19.1-45.1-28.8-93.1-28.8-142.5s9.7-97.3 28.8-142.5c18.4-43.6 44.8-82.7 78.4-116.3 33.6-33.6 72.7-60 116.3-78.4 45.1-19.1 93.1-28.8 142.5-28.8s97.3 9.7 142.5 28.8c43.6 18.4 82.7 44.8 116.3 78.4 33.6 33.6 60 72.7 78.4 116.3 19.1 45.1 28.8 93.1 28.8 142.5s-9.7 97.3-28.8 142.5c-18.4 43.6-44.8 82.7-78.4 116.3-33.6 33.6-72.7 60-116.3 78.4-45.1 19.1-93.1 28.8-142.5 28.8z m0-660c-162.1 0-294 131.9-294 294s131.9 294 294 294 294-131.9 294-294-131.9-294-294-294z" p-id="1672"></path><path d="M436 341.3L676.1 497 436 652.6z" p-id="1673"></path></svg>',
              boundsPadding: [0, 5, 0, 5],
              opacity: 0.05,
              cursor: 'pointer',
            }}
            onMouseEnter={(event) => {
              event.currentTarget.addState('hover', true, false)
              event.currentTarget.stage.renderNextFrame()
            }}
            onMouseLeave={(event) => {
              event.currentTarget.removeState('hover', false)
              event.currentTarget.stage.renderNextFrame()
            }}
            onClick={() => {
              message.info(`列：${columnId}, 行：${cellInfo.rowId}`)
            }}
            stateProxy={(stateName: string) => {
              console.log('🚀 ~ columns ~ stateName:', stateName)
              if (stateName === 'hover') {
                return {
                  opacity: 1,
                }
              }
            }}
          ></VImage>
        </VGroup>
      </VGroup>
    )
    return container
  }
  return { runContainer }
}

export default multiTableRenderUitls
