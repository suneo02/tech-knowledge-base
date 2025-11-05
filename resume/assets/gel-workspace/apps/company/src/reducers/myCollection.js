import * as actionTypes from "../actions/actionTypes";
import global from '../lib/global';

const initialState = {
  indicators: [],
  collections: [],
  pageNum: 1,
  pageSize: 10,
  total: 0,
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_INDICATOR:
      // console.log(action)
      if (action.data.code === global.SUCCESS) {
        action.data.data[0].indicator === "corp_name" && action.data.data.splice(0, 1);
        return {
          ...state,
          indicators: action.data.data,
        }
      }
      break;
    case actionTypes.GET_CONTACT_COLLECTION:
      // console.log(action)
      if (action.data.code === global.SUCCESS) {
        const {data, index} = action.data;
        Object.assign(state.collections[index], data);
        // console.log(state.data[index])
        let dataArr = JSON.parse(JSON.stringify(state.collections));
        return {
          ...state,
          collections: dataArr,
        }
      }
      break;
    case actionTypes.COLLECT_QUERY:
      // console.log(action)
      if (action.data.code === global.SUCCESS) {
        const { pageNum, pageSize } = action.data;
        const { list, total } = action.data.data;
        if (pageNum === 1) {
          return {
            ...state,
            collections: list,
            pageNum,
            pageSize,
            total,
          }
        }
        let collections = JSON.parse(JSON.stringify(state.collections));
        [].push.apply(collections, list);
        return {
          ...state,
          collections,
          pageNum,
          pageSize,
          total,
        }
      } else {
        return {
          ...state,
          collections: []
        }
      }
    case actionTypes.CLEAR_DATAS:
      // console.log(action)
      return {
        ...state,
        collections: [],
        pageNum: 1,
        pageSize: 10,
        total: 1,
      }
    default:
      return state;
  }
  return state;
}
export default reducer;