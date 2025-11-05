import * as actionTypes from "./actionTypes";

export const getBiddingFilterItems = data => {
  return {
    type: actionTypes.BIDDING_FILTERITEMS,
    data,
  }
}

export const biddingSearch = data => {
  return {
    type: actionTypes.BIDDING_SEARCH,
    data,
  }
}

export const biddingClear = data => {
  return {
    type: actionTypes.BIDDING_CLEAR,
    data,
  }
}

export const biddingSuggest = data => {
  return {
    type: actionTypes.BIDDING_SUGGEST,
    data,
  }
}

export const biddingDetail = data => {
  return {
    type: actionTypes.BIDDING_DETAIL,
    data,
  }
}

export const detailSub = data => {
  return {
    type: actionTypes.BIDDING_DETAIL_SUB,
    data,
  }
}

export const detailSubRel = data => {
  return {
    type: actionTypes.BIDDING_DETAIL_SUB_REL,
    data,
  }
}

export const getBiddigAttachment = data => {
  return {
    type: actionTypes.BIDDING_ATTACHMENT,
    data,
  }
}

export const getBiddigProcess = data => {
  return {
    type: actionTypes.BIDDING_PROCESS,
    data,
  }
}
