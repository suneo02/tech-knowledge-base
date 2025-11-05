import * as actionTypes from "../actions/actionTypes";
import global from '../lib/global';

const initialState = {
  templateList: [],
  pageNum: 0,
  pageSize: 12,
  total: 0,
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.TEMPLATE_LIST:
      // console.log(action)
      if (action.data.code === global.SUCCESS) {
        const { list, pageNum, pageSize, total } = action.data.data;
        return {
          ...state,
          templateList: list,
          pageNum,
          pageSize,
          total,
        }
      }
      break;
    case actionTypes.TEMPLATE_QUERY:
      console.log(action)
      if (action.data.code === global.SUCCESS) {
        return {
          ...state,
          // templateList: action.data.data,
        }
      }
      break;
    case actionTypes.TEMPLATE_PRAISE:
      console.log(action)
      const { code, index } = action.data;
      if (code === global.SUCCESS) {
        state.templateList[index].isPraise = true;
        state.templateList[index].praiseCount += 1;
        return {
          ...state,
        }
      }
      break;
    case actionTypes.TEMPLATE_RESET:
      console.log("TEMPLATE_RESET")
      return initialState;
    default:
      return state;
  }
  return state;
}
export default reducer;