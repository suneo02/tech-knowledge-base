import * as actionTypes from "./actionTypes";

export const collectQuery = data => {
  return {
    type: actionTypes.COLLECT_QUERY,
    data,
  }
}

export const clearDatas = () => {
  return {
    type: actionTypes.CLEAR_DATAS,
  }
}

export const getContactByCropid = (data) => {
  return {
    type: actionTypes.GET_CONTACT_COLLECTION,
    data,
  }
}

