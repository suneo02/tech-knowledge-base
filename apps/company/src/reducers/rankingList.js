import * as actionTypes from "../actions/actionTypes";
import global from '../lib/global';

const initialState = {
  suggestList: [],
  suggestPageNum: 1,
  suggestPageSize: 10,
  suggestTotal: 0,
  inputSearchRes: [],
  searchHistory: [],
  visitHistory: [],
  treeMenu: [],
  treeList: [],
  treeListPagination: {
    pageNum: 1,
    pageSize: 10,
    total: 0,
  }
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.RANKINGLIST_SUGGEST:
      if (action.data) {
        return {
          ...state,
          suggestList: action.data.Data || [],
          suggestTotal: action.data.Page.Records || 0
          // suggestPageNum: pageNum,
          // suggestPageSize: pageSize,
          // suggestTotal: total,
        }
      }
      break;
    case actionTypes.RANKINGLIST_INPUT_SEARCH:
      if (action.data.code === global.SUCCESS) {
        const { list } = action.data.data.pageRes;
        return {
          ...state,
          inputSearchRes: list || [],
        }
      }
      break;
    case actionTypes.RANKINGLIST_TREE_SEARCH:
      // console.log(action)
      if (action.data.code === global.SUCCESS) {
        const { directoryTypeDtos } = action.data.data;
        const { list, pageNum, pageSize, total } = action.data.data.pageRes;
        if (action.data.typeName) {
          return {
            ...state,
            treeList: list || [],
            treeListPagination: {
              pageNum,
              pageSize,
              total,
            }
          }
        }
        return {
          ...state,
          treeMenu: directoryTypeDtos || [],
          treeList: list || [],
          treeListPagination: {
            pageNum,
            pageSize,
            total,
          }
        }
      }
      break;
    case actionTypes.ADD_SEARCH_HISTORY:
      // console.log(action)
      if (action.data.code === global.SUCCESS) {
        state.searchHistory.forEach((item, index) => {
          if (item.id === action.data.id) {
            state.searchHistory.splice(index, 1);
          }
        });
        state.searchHistory.unshift({
          id: action.data.id,
          name: action.data.name,
        })
        return {
          ...state,
        }
      }
      break;
    case actionTypes.GET_SEARCH_HISTORY:
      // console.log(action)
      if (action.data.code === global.SUCCESS) {
        return {
          ...state,
          searchHistory: action.data.data || [],
        }
      }
      break;
    case actionTypes.DELETEALL_SEARCH_HISTORY:
      // console.log(action)
      if (action.data.code === global.SUCCESS) {
        return {
          ...state,
          searchHistory: [],
        }
      }
      break;
    case actionTypes.ADD_VISIT_HISTORY:
      // console.log(action)
      if (action.data.code === global.SUCCESS) {
        state.visitHistory.forEach((item, index) => {
          if (item.id === action.data.id) {
            state.visitHistory.splice(index, 1);
          }
        });
        state.visitHistory.unshift({
          id: action.data.id,
          name: action.data.name,
        })
        return {
          ...state,
        }
      }
      break;
    case actionTypes.GET_VISIT_HISTORY:
      // console.log(action)
      if (action.data.code === global.SUCCESS) {
        return {
          ...state,
          visitHistory: action.data.data || [],
        }
      }
      break;
    case actionTypes.DELETEALL_VISIT_HISTORY:
      // console.log(action)
      if (action.data.code === global.SUCCESS) {
        return {
          ...state,
          visitHistory: [],
        }
      }
      break;
    case actionTypes.DELETEONE_VISIT_HISTORY:
      // console.log(action)
      if (action.data.code === global.SUCCESS) {
        state.visitHistory.splice(action.data.index, 1);
        return {
          ...state,
        }
      }
      break;
    case actionTypes.GET_RANKINGLIST_TYPE:
      // console.log(action)
      if (action.data.code === global.SUCCESS) {
        return {
          ...state,
          treeMenu: action.data.data || [],
        }
      }
      break;
    default:
      return state;
  }
  return state;
}
export default reducer;