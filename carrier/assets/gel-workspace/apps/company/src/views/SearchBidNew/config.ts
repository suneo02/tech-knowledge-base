import intl from '@/utils/intl'

export const releaseDate = [
  {
    value: '',
    name: intl('138649', '不限'),
  },
  {
    value: '~3',
    name: intl('313036', '近3天'),
  },
  {
    value: '~7',
    name: intl('313054', '近7天'),
  },
  {
    value: '~30',
    name: intl('313055', '近1月'),
  },
]
export const programStatus = [
  {
    value: '预审阶段',
    label: intl('257788', '预审阶段'),
    no: 1,
    l_name: 'preStage',
    children: [
      {
        label: intl('257791', '资格预审'),
        value: '资格预审公告',
      },
    ],
  },
  {
    value: '招标阶段',
    label: intl('257789', '招标阶段'),
    no: 2,
    l_name: 'biddingStage',
    children: [
      {
        label: intl('257790', '公开招标'),
        value: '公开招标公告',
      },
      {
        label: intl('257637', '询价'),
        value: '询价公告',
      },
      {
        label: intl('257811', '邀请招标'),
        value: '邀请招标公告',
      },
      {
        label: intl('257812', '竞争性谈判'),
        value: '竞争性谈判公告',
      },
      {
        label: intl('257813', '竞争性磋商'),
        value: '竞争性磋商公告',
      },
      {
        label: intl('228625', '单一来源公告'),
        value: '单一来源公告',
      },
      {
        label: intl('228628', '竞价招标公告'),
        value: '竞价招标公告',
      },
      {
        label: intl('333034', '意向公告'),
        value: '意向公告',
      },
    ],
  },
  {
    value: '结果阶段',
    label: intl('257808', '结果阶段'),
    no: 3,
    l_name: 'dealStage',
    children: [
      {
        label: intl('257815', '废标流标'),
        value: '废标流标公告',
      },
      {
        label: intl('257676', '中标'),
        value: '中标公告',
      },
      {
        label: intl('257638', '成交'),
        value: '成交公告',
      },
      {
        label: intl('437332', '竞价结果'),
        value: '竞价结果公告',
      },
      {
        label: intl('333033', '开标公告'),
        value: '开标公告',
      },
      {
        label: intl('336673', '合同及验收'),
        value: '合同及验收公告',
      },
    ],
  },
]
export const money = [
  {
    value: '~500000',
    label: intl('284931', '50万内'),
  },
  {
    value: '500000~1000000',
    label: intl('437330', '50万~100万'),
  },
  {
    value: '1000000~5000000',
    label: intl('138634', '100万~500万'),
  },
  {
    value: '5000000~10000000',
    label: intl('437331', '500万~1000万'),
  },
  {
    value: 'custome',
    label: intl('25405', '自定义'),
  },
]
export const biddingMoney = [
  {
    value: '~500000',
    label: intl('284931', '50万内'),
  },
  {
    value: '500000~1000000',
    label: intl('437330', '50万~100万'),
  },
  {
    value: '1000000~5000000',
    label: intl('138634', '100万~500万'),
  },
  {
    value: '5000000~10000000',
    label: intl('437331', '500万~1000万'),
  },
  {
    value: 'custome',
    label: intl('25405', '自定义'),
  },
]
export const allAnnoc = {
  preStage: ['资格预审公告'],
  biddingStage: [
    '公开招标公告',
    '询价公告',
    '邀请招标公告',
    '竞争性谈判公告',
    '竞争性磋商公告',
    '单一来源公告',
    '竞价招标公告',
    '意向公告',
  ],
  dealStage: ['废标流标公告', '中标公告', '成交公告', '竞价结果公告', '开标公告', '合同及验收公告'],
}
export const showMap = {
  title: 'queryHisShow',
  productName: 'productHisShow',
}
