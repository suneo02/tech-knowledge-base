// import { ListTable } from '@visactor/vtable'
import DataSource from './mock/dataSource.json?raw'
import Columns from './mock/columns.json?raw'
import { ListTable } from '@visactor/react-vtable'

export const GroupTable = () => {
  const columns = JSON.parse(Columns).result.columns
  const allData = JSON.parse(DataSource).result.data

  const getRecordsWithAjax = (startIndex, num) => {
    // console.log('getRecordsWithAjax', startIndex, num);
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('getRecordsWithAjax', startIndex, num, allData)
        const records = []
        for (let i = 0; i < num; i++) {
          records.push(allData[startIndex + i])
        }
        resolve(records)
      }, 500)
    })
  }

  const loadedData = {}
  const dataSource = {
    get(index) {
      // 每一批次请求100条数据 0-99 100-199 200-299
      const loadStartIndex = Math.floor(index / 100) * 100
      // 判断是否已请求过？
      if (!loadedData[loadStartIndex]) {
        const promiseObject = getRecordsWithAjax(loadStartIndex, 100) // return Promise Object
        loadedData[loadStartIndex] = promiseObject
      }
      return loadedData[loadStartIndex].then((data) => {
        return data[index - loadStartIndex] //获取批次数据列表中的index对应数据
      })
    },
    length: 10000, //all records count
  }

  return (
    <ListTable
      width={'100vw'}
      height={'100vh'}
      columns={columns.map((res) => ({
        ...res,
        width: 200,
        field: res.columnId,
        title: res.columnName,
      }))}
      dataSource={dataSource}
      //   option={
      //     {
      //       // records: allData,
      //       // columns: columns.map((res) => ({
      //       //   ...res,
      //       //   width: 200,
      //       //   field: res.columnId,
      //       //   title: res.columnName,
      //       // })),
      //       // groupBy: ['2haGRR5HR5xuJb'],
      //     }
      //   }
    />
  )
}
