import { combineReducers } from 'redux'
import company from './company'
import config from './config'
import filterRes from './filterRes'
import findCustomer from './findCustomer'
import global from './global'
import group from './group'
import home from './home'
import myCollection from './myCollection'
import rankingList from './rankingList'
import rankingListDetail from './rankingListDetail'
import companySearchList from './searchList'
import settings from './settings'
import template from './template'
import tenderingAndBidding from './tenderingAndBidding'
import user from './user'

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
