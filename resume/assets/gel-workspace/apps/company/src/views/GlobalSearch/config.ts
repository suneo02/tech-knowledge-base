import { SelectOptionProps } from './components/form/common/select/type'
import intl from '@/utils/intl'

export const globalSearchList = [
  {
    id: '1',
    type: 'select',
    options: [
      { value: '0-100', label: '100万以内' },
      { value: '100-200', label: '100-200万' },
      { value: '200-300', label: '200-300万' },
      { value: '300-500', label: '300-500万' },
      { value: '500-1000', label: '500-1000万' },
    ],
    label: '注册资本',
    suffix: '万',
  },
]

export const organizationType: SelectOptionProps[] = [
  {
    label: intl('138649', '不限'),
    value: '',
    valueId: '',
    condition: '',
  },
  {
    label: intl('412513', '大陆企业'),
    value: 'cn',
    valueId: '298010000,298020000,298040000',
    condition: 'jn',
  },
  {
    label: intl('228611', '政府机关'),
    value: 'adminiOrg',
    valueId: '160300000',
    condition: 'gov',
  },
  {
    label: intl('207783', '社会组织'),
    value: 'socialOrg',
    valueId: '160900000',
    condition: 'sh',
  },
  {
    label: intl('207767', '事业单位'),
    value: 'pubInstitution',
    valueId: '160307000',
    condition: 'sy',
  },
  {
    label: intl('213164', '律所'),
    value: 'lawFirm',
    valueId: '912034101',
    condition: 'lo',
  },
  {
    label: intl('51474', '个体工商户'),
    value: 'indBusHs',
    valueId: '912034101',
    condition: 'lo',
  },
]

export const globalSort = [
  {
    label: intl('138255', '默认排序'),
    value: '-1',
  },
  {
    label: intl('138304', '按成立日期倒序'),
    value: '1',
  },
  {
    label: intl('138305', '按成立日期正序'),
    value: '2',
  },
]

export const chinaSort = [
  {
    label: intl('138255', '默认排序'),
    value: '-1',
  },
  {
    label: intl('138304', '按成立日期倒序'),
    value: '1',
  },
  {
    label: intl('138305', '按成立日期正序'),
    value: '2',
  },
  {
    label: intl('138474', '按注册资本倒序'),
    value: '3',
  },
  {
    label: intl('138475', '按注册资本正序'),
    value: '4',
  },
]

export const createDate = [
  {
    label: intl('138649', '不限'),
    value: '',
  },
  {
    label: intl('138631', '1年内'),
    value: '0-1',
  },
  {
    label: intl('437314', '1~3年'),
    value: '1-3',
  },
  {
    label: intl('437315', '3~5年'),
    value: '3-5',
  },
  {
    label: intl('437295', '5~10年'),
    value: '5-10',
  },
]

const jyztList = [
  {
    key: 'cn',
    options: [
      {
        label: intl('240282', '存续'),
        value: '存续',
      },
      {
        label: intl('36489', '注销'),
        value: '注销',
      },
      {
        label: intl('134788', '迁出'),
        value: '迁出',
      },
      {
        label: intl('134789', '吊销,未注销'),
        value: '吊销,未注销',
      },
      {
        label: intl('134790', '吊销,已注销'),
        value: '吊销,已注销',
      },
      {
        label: intl('2690', '撤销'),
        value: '撤销',
      },
      {
        label: intl('134791', '停业'),
        value: '停业',
      },
      {
        label: intl('257686', '非正常户'),
        value: '非正常户',
      },
      {
        label: intl('416883', '责令关闭'),
        value: '责令关闭',
      },
    ],
  },
  {
    key: 'hongkong',
    options: [
      {
        label: intl('214863', '仍注册'),
        value: '仍注册',
      },
      {
        label: intl('207800', '已告解散'),
        value: '已告解散',
      },
      {
        label: intl('207801', '已终止营业地点'),
        value: '已终止营业地点',
      },
      {
        label: intl('207802', '已终止营业地点及已告解散'),
        value: '已终止营业地点及已告解散',
      },
      {
        label: intl('207803', '合并后不再是独立的实体'),
        value: '合并后不再是独立的实体',
      },
    ],
  },
  {
    key: 'taiwan',
    options: [
      {
        label: intl('207804', '核准設立'),
        value: '核准設立',
      },
      {
        label: intl('2690', '撤銷'),
        value: '撤銷',
      },
      {
        label: intl('207805', '廢止'),
        value: '廢止',
      },
      {
        label: intl('207806', '解散'),
        value: '解散',
      },
      {
        label: intl('207807', '合併解散'),
        value: '合併解散',
      },
      {
        label: intl('207808', '破產'),
        value: '破產',
      },
      {
        label: intl('207809', '解散已清算完結'),
        value: '解散已清算完結',
      },
      {
        label: intl('207810', '核准設立，但已命令解散'),
        value: '核准設立，但已命令解散',
      },
    ],
  },
  {
    key: 'adminiOrg',
    options: [
      {
        label: intl('207804', '核准設立'),
        value: '核准設立',
      },
      {
        label: intl('2690', '撤銷'),
        value: '撤銷',
      },
      {
        label: intl('207805', '廢止'),
        value: '廢止',
      },
      {
        label: intl('207806', '解散'),
        value: '解散',
      },
      {
        label: intl('207807', '合併解散'),
        value: '合併解散',
      },
      {
        label: intl('207808', '破產'),
        value: '破產',
      },
      {
        label: intl('207809', '解散已清算完結'),
        value: '解散已清算完結',
      },
      {
        label: intl('207810', '核准設立，但已命令解散'),
        value: '核准設立，但已命令解散',
      },
    ],
  },
  {
    key: 'socialOrg',
    options: [
      {
        label: intl('111765', '正常'),
        value: '正常',
      },
      {
        label: intl('2690', '撤销'),
        value: '撤销',
      },
      {
        label: intl('36489', '注销'),
        value: '注销',
      },
    ],
  },
  {
    key: 'pubInstitution',
    options: [
      {
        label: intl('111765', '正常'),
        value: '正常',
      },
      {
        label: intl('207811', '已废止'),
        value: '已废止',
      },
      {
        label: intl('207770', '已注销'),
        value: '已注销',
      },
    ],
  },
  {
    key: 'lawFirm',
    options: [
      {
        label: intl('111765', '正常'),
        value: '正常',
      },
      {
        label: intl('36489', '注销'),
        value: '注销',
      },
      {
        label: intl('271249', '吊销'),
        value: '吊销',
      },
    ],
  },
]

export const outCompanyParam = [
  {
    label: intl('138649', '不限'),
    value: '',
  },
  {
    label: intl('76', '美国'),
    value: 'usa',
  },
  {
    label: intl('79', '加拿大'),
    value: 'can',
  },
  {
    label: intl('68', '新加坡'),
    value: 'sgp',
  },
  {
    label: intl('77', '日本'),
    value: 'jpn',
  },
  {
    label: intl('74', '韩国'),
    value: 'kor',
  },
  {
    label: intl('71063', '德国'),
    value: 'deu',
  },
  {
    label: intl('40879', '法国'),
    value: 'fra',
  },
  {
    label: intl('46899', '意大利'),
    value: 'ita',
  },
  {
    label: intl('78', '英国'),
    value: 'eng',
  },
  {
    label: intl('211694', '泰国'),
    value: 'tha',
  },
  {
    label: intl('53975', '越南'),
    value: 'vie',
  },
  {
    label: intl('211660', '新西兰'),
    value: 'nzl',
  },
  {
    label: intl('224575', '卢森堡'),
    value: 'lux',
  },
  {
    label: intl('226992', '印度'),
    value: 'ind',
  },
  {
    label: intl('226990', '俄罗斯'),
    value: 'rus',
  },
  {
    label: intl('298293', '马来西亚'),
    value: 'mas',
  },
  {
    label: intl('23435', '其他'),
    value: 'oth',
  },
]

export const corpDescCondition = [
  {
    label: intl('35779', '注册资本'),
    key: 'regRange',
    type: 'select',
    options: [
      {
        label: intl('138649', '不限'),
        value: '',
      },
      {
        label: intl('138090', '100万以下'),
        value: '[0,100]',
      },
      {
        label: intl('138634', '100万~500万'),
        value: '[100,500]',
      },
      {
        label: intl('437331', '500万~1000万'),
        value: '[500,1000]',
      },
      {
        label: intl('437395', '1000万~3000万'),
        value: '[1000,3000]',
      },
      {
        label: intl('437414', '3000万~5000万'),
        value: '[3000,5000]',
      },
      {
        label: intl('138095', '5000万以上'),
        value: '[5000',
      },
    ],
  },
  {
    label: intl('2045', '币种'),
    key: 'capitalType',
    mode: 'multiple',
    type: 'select',
    options: [
      {
        label: intl('12298', '人民币'),
        value: '人民币',
      },
      {
        label: intl('10634', '美元'),
        value: '美元',
      },
      {
        label: intl('23435', '其他'),
        value: '其他',
      },
    ],
  },
  {
    label: intl('138416', '经营状态'),
    key: 'status',
    mode: 'multiple',
    type: 'select',
    options: jyztList[0].options,
  },
  {
    label: intl('60452', '企业类型'),
    key: 'corpType',
    mode: 'multiple',
    showVipIcon: 'vip',
    type: 'select',
    options: [
      {
        label: intl('140129', '有限责任公司'),
        value: '有限责任公司',
      },
      {
        label: intl('140130', '股份有限公司'),
        value: '股份有限公司',
      },
      {
        label: intl('46220', '国有企业'),
        value: '国有企业',
      },
      {
        label: intl('214871', '集体所有制'),
        value: '集体所有制',
      },
      {
        label: intl('214930', '外商投资企业'),
        value: '外商投资企业',
      },
      {
        label: intl('214872', '港澳台投资企业'),
        value: '港澳台投资企业',
      },
      {
        label: intl('214873', '个人独资企业'),
        value: '个人独资企业',
      },
      {
        label: intl('174483', '联营企业'),
        value: '联营企业',
      },
      {
        label: intl('214874', '有限合伙'),
        value: '有限合伙',
      },
      {
        label: intl('214875', '普通合伙'),
        value: '普通合伙',
      },
    ],
  },
  {
    label: intl('145878', '参保人数'),
    key: 'endowmentNum',
    showVipIcon: 'vip',
    type: 'select',
    options: [
      {
        label: intl('138649', '不限'),
        value: '',
      },
      {
        label: intl('214876', '50人以下'),
        value: '[0,50]',
      },
      {
        label: intl('214877', '50~99人'),
        value: '[50,99]',
      },
      {
        label: intl('214878', '100~499人'),
        value: '[100,499]',
      },
      {
        label: intl('214879', '500~999人'),
        value: '[500,999]',
      },
      {
        label: intl('214880', '1000~4999人'),
        value: '[1000,4999]',
      },
      {
        label: intl('214881', '5000~9999人'),
        value: '[5000,9999]',
      },
      {
        label: intl('214943', '10000以上'),
        value: '[10000',
      },
    ],
  },
]

export const moreFilter = [
  {
    label: intl('140100', '联系邮箱'),
    key: 'hasMail',
    type: 'select',
    options: [
      {
        label: intl('138649', '不限'),
        value: '',
      },
      {
        label: intl('145822', '有联系邮箱'),
        value: '1',
      },
      {
        label: intl('145823', '无联系邮箱'),
        value: '0',
      },
    ],
  },
  {
    label: intl('10057', '联系电话'),
    key: 'hasTel',
    type: 'select',
    options: [
      {
        label: intl('138649', '不限'),
        value: '',
      },
      {
        label: intl('261917', '有联系电话'),
        value: '1',
      },
      {
        label: intl('261918', '无联系电话'),
        value: '0',
      },
    ],
  },
  {
    label: intl('204142', '网址信息'),
    key: 'hasDomain',
    type: 'select',
    options: [
      {
        label: intl('138649', '不限'),
        value: '',
      },
      {
        label: intl('145832', '有网址信息'),
        value: '1',
      },
      {
        label: intl('145833', '无网址信息'),
        value: '0',
      },
    ],
    // showVipIcon: 'svip',
  },
  {
    label: intl('145821', '融资信息'),
    key: 'hasFinancing',
    type: 'select',
    options: [
      {
        label: intl('138649', '不限'),
        value: '',
      },
      {
        label: intl('145828', '有融资信息'),
        value: '1',
      },
      {
        label: intl('145829', '无融资信息'),
        value: '0',
      },
    ],
    // showVipIcon: 'vip',
  },
  {
    label: intl('206003', '是否上市'),
    key: 'hasIpo',
    type: 'select',
    options: [
      {
        label: intl('138649', '不限'),
        value: '',
      },
      {
        label: intl('16277', '已上市'),
        value: '1',
      },
      {
        label: intl('14816', '未上市'),
        value: '0',
      },
    ],
  },
  {
    label: intl('39463', '债券信息'),
    key: 'hasDebt',
    type: 'select',
    options: [
      {
        label: intl('138649', '不限'),
        value: '',
      },
      {
        label: intl('145826', '有债券信息'),
        value: '1',
      },
      {
        label: intl('145827', '无债券信息'),
        value: '0',
      },
    ],
  },
  {
    label: intl('271633', '招投标'),
    key: 'hasBidding',
    type: 'select',
    options: [
      {
        label: intl('138649', '不限'),
        value: '',
      },
      {
        label: intl('214896', '有招投标'),
        value: '1',
      },
      {
        label: intl('214897', '无招投标'),
        value: '0',
      },
    ],
  },
  {
    label: intl('138468', '上榜信息'),
    key: 'hasOnList',
    type: 'select',
    options: [
      {
        label: intl('138649', '不限'),
        value: '',
      },
      {
        label: intl('145824', '有上榜信息'),
        value: '1',
      },
      {
        label: intl('145825', '无上榜信息'),
        value: '0',
      },
    ],
  },
  {
    label: intl('204102', '商标信息'),
    key: 'hasBrand',
    type: 'select',
    options: [
      {
        label: intl('138649', '不限'),
        value: '',
      },
      {
        label: intl('145834', '有商标信息'),
        value: '1',
      },
      {
        label: intl('145835', '无商标信息'),
        value: '0',
      },
    ],
  },
  {
    label: intl('149797', '专利信息'),
    key: 'hasPatent',
    type: 'select',
    options: [
      {
        label: intl('138649', '不限'),
        value: '',
      },
      {
        label: intl('145836', '有专利信息'),
        value: '1',
      },
      {
        label: intl('145837', '无专利信息'),
        value: '0',
      },
    ],
  },
  {
    label: intl('138207', '动产抵押'),
    key: 'hasPledge',
    type: 'select',
    options: [
      {
        label: intl('138649', '不限'),
        value: '',
      },
      {
        label: intl('145842', '有动产抵押'),
        value: '1',
      },
      {
        label: intl('145843', '无动产抵押'),
        value: '0',
      },
    ],
  },
  {
    label: intl('138591', '失信信息'),
    key: 'hasBreakPromise',
    type: 'select',
    options: [
      {
        label: intl('138649', '不限'),
        value: '',
      },
      {
        label: intl('145830', '有失信信息'),
        value: '1',
      },
      {
        label: intl('145831', '无失信信息'),
        value: '0',
      },
    ],
  },
  {
    label: intl('214898', '税务评级'),
    key: 'hasTaxRating',
    type: 'select',
    options: [
      {
        label: intl('138649', '不限'),
        value: '',
      },
      {
        label: intl('214900', '有税务评级'),
        value: '1',
      },
      {
        label: intl('214901', '无税务评级'),
        value: '0',
      },
    ],
  },
  {
    label: intl('205419', '进出口信用'),
    key: 'hasImportExport',
    type: 'select',
    options: [
      {
        label: intl('138649', '不限'),
        value: '',
      },
      {
        label: intl('214903', '有进出口信用'),
        value: '1',
      },
      {
        label: intl('214904', '无进出口信用'),
        value: '0',
      },
    ],
  },
  {
    label: intl('138756', '作品著作权'),
    key: 'hasProductionCopyright',
    type: 'select',
    options: [
      {
        label: intl('138649', '不限'),
        value: '',
      },
      {
        label: intl('145838', '有作品著作权'),
        value: '1',
      },
      {
        label: intl('145839', '无作品著作权'),
        value: '0',
      },
    ],
  },
  {
    label: intl('138788', '软件著作权'),
    key: 'hasCopyright',
    type: 'select',
    options: [
      {
        label: intl('138649', '不限'),
        value: '',
      },
      {
        label: intl('145840', '有软件著作权'),
        value: '1',
      },
      {
        label: intl('145841', '无软件著作权'),
        value: '0',
      },
    ],
  },
]
