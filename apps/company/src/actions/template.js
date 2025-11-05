import * as actionTypes from "./actionTypes";

export const getTemplateList = data => {
  return {
    type: actionTypes.TEMPLATE_LIST,
    data,
  }
}

export const templateQuery = data => {
  return {
    type: actionTypes.TEMPLATE_QUERY,
    data,
  }
}

export const templatePraise = data => {
  return {
    type: actionTypes.TEMPLATE_PRAISE,
    data,
  }
}

export const templateReset = data => {
  return {
    type: actionTypes.TEMPLATE_RESET,
    data,
  }
}
