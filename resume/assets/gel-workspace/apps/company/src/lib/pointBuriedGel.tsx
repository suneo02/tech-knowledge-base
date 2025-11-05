import { pointBuriedGel } from '@/api/configApi'

// 首页loading
export const pointHomepageLoad = () => {
  pointBuriedGel('922602100263', '首页', 'homepageView', {
    opActive: 'loading',
    funcType: 'homepageView',
    opEntity: '首页',
  })
}

// 首页加载查企业埋点
export const pointClickCompanyTab = () => {
  pointBuriedGel('922602100125', '首页查企业', 'searchBtnCk', {
    opActive: 'loading',
    funcType: 'searchBtnCk',
    opEntity: '企业',
  })
}

// 搜索公司
export const pointSearchComapny = () => {
  pointBuriedGel('922602100634', '企业搜索', 'preSearchCk', {
    opActive: 'preSearch',
    funcType: 'preSearchCk',
    opEntity: '企业',
  })
}

// 点击企业预搜索的列表
export const pointClickComapnyPreSearch = () => {
  pointBuriedGel('922602100310', '企业', 'preSearchResCk', {
    opActive: 'click',
    funcType: 'preSearchResCk',
    opEntity: '企业',
  })
}

// 点击企业历史记录
export const pointClickComapnyHistory = () => {
  pointBuriedGel('922602100266', '企业历史', 'historyCk', {
    opActive: 'click',
    funcType: 'historyCk',
    opEntity: '企业',
    entityAttribute: '历史记录',
  })
}

// 点击查人物tab
export const pointClickPersionTab = () => {
  pointBuriedGel('922602100332', '首页查人物', 'searchPersionTab', {
    opActive: 'click',
    funcType: 'searchPersionTab',
    opEntity: '人物',
    entityAttribute: '首页查人物',
  })
}

// 点击查人物搜索按钮
export const pointSearchPersion = () => {
  pointBuriedGel('922602100332', '首页查人物', 'searchPersionBtnCk', {
    opActive: 'search',
    funcType: 'searchPersionBtnCk',
    opEntity: '人物',
  })
}

// 点击查集团搜索按钮
export const pointSearchGroup = () => {
  pointBuriedGel('922602100638', '集团系', 'searchCk', {
    opActive: 'click',
    funcType: 'searchCk',
    opEntity: '集团系',
  })
}

// 点击查集团预搜索列表
export const pointClickGroupPreSearch = () => {
  pointBuriedGel('922602100634', '集团系', 'preSearchCk', {
    opActive: 'preSearch',
    funcType: 'preSearchCk',
    opEntity: '集团系',
  })
}

// 点击查关系tab
export const pointClickRelationTab = () => {
  pointBuriedGel('922602100333', '首页查关系', 'searchRelationTab', {
    opActive: 'click',
    funcType: 'searchRelationTab',
    opEntity: '关系',
    entityAttribute: '首页查关系',
  })
}

// 点击查关系搜索按钮
export const pointSearchRelation = () => {
  pointBuriedGel('922602100333', '关系', 'searchRelation', {
    opActive: 'click',
    funcType: 'searchRelation',
    opEntity: '关系',
  })
}

// 点击查关系历史记录
export const pointClickRelationHistory = () => {
  pointBuriedGel('922602100266', '关系', 'historyCk', {
    opActive: 'click',
    funcType: 'historyCk',
    opEntity: '关系',
    entityAttribute: '历史记录',
  })
}

// 点击战略新兴产业
export const pointClickZlxxcy = () => {
  pointBuriedGel('922602100954', '战略性新兴产业', 'baifenzlxxcy', {
    opActive: 'click',
    funcType: 'baifenzlxxcy',
    opEntity: '战略性新兴产业',
  })
}

// 点击银行获客工具
export const pointClickYhhkgj = () => {
  pointBuriedGel('922602100954', '银行获客工具', 'baifenyhhkgj', {
    opActive: 'click',
    funcType: 'baifenyhhkgj',
    opEntity: '银行获客工具',
  })
}

// 特色企业
export const pointClickSpecialList = (opEntity) => {
  pointBuriedGel('922602100638', opEntity, 'searchCk', {
    opActive: 'view',
    funcType: 'searchCk',
    opEntity: opEntity,
  })
}
