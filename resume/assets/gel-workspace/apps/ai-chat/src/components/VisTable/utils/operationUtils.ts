// 添加列 向左插入列，向右插入列

const operationUtils = () => {
  const addColumn = (col: number, direction?: 'left' | 'right') => {
    console.log('添加列', col, direction)
  }

  return { addColumn }
}

export { operationUtils }
