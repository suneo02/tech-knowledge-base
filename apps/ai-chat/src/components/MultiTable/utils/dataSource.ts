import { data } from '@visactor/vtable'

interface Person {
  id: number
  email: string
  name: string
  lastName: string
  date: string
  tel: string
  sex: 'boy' | 'girl'
  work: string
  city: string
}

const generatePerson = (i: number): Person => {
  return {
    id: i + 1,
    email: `${i + 1}@example.com`,
    name: `小明${i + 1}`,
    lastName: '王',
    date: '2022年9月1日',
    tel: '000-0000-0000',
    sex: i % 2 === 0 ? 'boy' : 'girl',
    work: i % 2 === 0 ? 'back-end engineer' : 'front-end engineer',
    city: 'beijing',
  }
}

const getRecordsWithAjax = (startIndex: number, num: number): Promise<Person[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('加载数据:', startIndex, num)
      const records: Person[] = []
      for (let i = 0; i < num; i++) {
        records.push(generatePerson(startIndex + i))
      }
      resolve(records)
    }, 500)
  })
}

export const createLazyDataSource = (totalCount = 10000) => {
  const loadedData: Record<number, Promise<Person[]>> = {}

  return new data.CachedDataSource({
    get(index: number) {
      const batchSize = 100
      const loadStartIndex = Math.floor(index / batchSize) * batchSize

      if (!loadedData[loadStartIndex]) {
        const promiseObject = getRecordsWithAjax(loadStartIndex, batchSize)
        loadedData[loadStartIndex] = promiseObject
      }

      return loadedData[loadStartIndex].then((data) => {
        return data[index - loadStartIndex]
      })
    },
    length: totalCount,
  })
}

export type { Person }
