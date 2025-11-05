import * as actionTypes from "./actionTypes";

export const setGlobalSearchKeyWord = data => {
    return {
        type: actionTypes.SET_GLOBAL_SEARCH_KEYWORD,
        data,
    }
}

export const getCompanySearchList = data => {
    return {
        type: actionTypes.SEARCH_COMPANY,
        data,
    }
}

export const getCompanyView = data => {
    return {
        type: actionTypes.VIEW_COMPANY,
        data,
    }
}

export const getCompanyHotView = data => {
    return {
        type: actionTypes.HOT_VIEW_COMPANY,
        data,
    }
}

export const clearCompanyView = data => {
    return {
        type: actionTypes.CLEAR_VIEW,
        data,
    }
}

export const getGroupList = data => {
    return {
        type: actionTypes.SEARCH_GROUP,
        data,
    }
}

export const getGroupHotView = data => {
    return {
        type: actionTypes.HOT_VIEW_GROUP,
        data,
    }
}

export const getJobList = data => {
    return {
        type: actionTypes.SEARCH_JOB,
        data,
    }
}

export const getJobView = data => {
    return {
        type: actionTypes.VIEW_JOB,
        data,
    }
}

export const getJobHotView = data => {
    return {
        type: actionTypes.HOT_VIEW_JOB,
        data,
    }
}

export const getIntellectualList = data => {
    return {
        type: actionTypes.SEARCH_INTELLECTUAL,
        data,
    }
}

export const getIntellectualViewList = data => {
    return {
        type: actionTypes.VIEW_INTELLECTUAL,
        data,
    }
}

export const clearIntellectualFilter= data => {
    return {
        type: actionTypes.CLEAR_FILTER,
        data,
    }
}

export const getBidViewList = data => {
    return {
        type: actionTypes.VIEW_BID,
        data,
    }
}

export const getBidSearchList = data => {
    return {
        type: actionTypes.SEARCH_BID,
        data,
    }
}
export const getCollectlist = data => {
    return {
        type: actionTypes.COLLECT_CLIST,
        data,
    }
}

export const addCollect = data => {
    return {
        type: actionTypes.ADD_COLLECT,
        data,
    }
}

export const getOutCompanySearch = data => {
    return {
        type: actionTypes.SEARCH_OUTCOMPANY,
        data,
    }
}

export const getOutCompanyView = data => {
    return {
        type: actionTypes.VIEW_OUTCOMPANY,
        data,
    }
}

export const getPatentList = data =>{
    return {
        type: actionTypes.SEARCH_PATENT,
        data,
    }
}

export const getPersonList = data =>{
    return {
        type: actionTypes.SEARCH_PERSON,
        data,
    }
}

export const getPersonView = data => {
    return {
        type: actionTypes.VIEW_PERSON,
        data,
    }
}

export const getOverSeaList = data =>{
    return {
        type: actionTypes.SEARCH_GLOBALWORLD,
        data,
    }
}