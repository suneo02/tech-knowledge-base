import { combineReducers } from 'redux'
import user from '../reducers/user'
import settings from '../reducers/settings'
import findCustomer from '../reducers/findCustomer'
import filterRes from '../reducers/filterRes'
import myCollection from '../reducers/myCollection'
import home from '../reducers/home'
import template from '../reducers/template'
import config from '../reducers/config'
import company from './company'
import tenderingAndBidding from '../reducers/tenderingAndBidding'
import rankingList from '../reducers/rankingList'
import rankingListDetail from '../reducers/rankingListDetail'
import global from '../reducers/global'
import companySearchList from '../reducers/searchList'
import group from '../reducers/group'

const rootReducers = combineReducers({
  user,
  settings,
  findCustomer,
  filterRes,
  myCollection,
  home,
  template,
  config,
  company,
  tenderingAndBidding,
  rankingList,
  rankingListDetail,
  global,
  companySearchList,
  group,
})

export default rootReducers
