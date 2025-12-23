import intl from '@/utils/intl'

export const menus = [
  {
    name: intl('138649', '不限'),
    value: '',
    langkey: '',
    children: [],
    isAll: true,
  },
  {
    name: intl('134852', '基础信息'),
    value: '基础信息',
    langkey: '',
    children: [
      {
        name: intl('352693', '全部基础信息'),
        value: '',
        langkey: '',
        isAll: true,
      },
      {
        name: intl('451218', '股东变更'),
        value: '股东变更',
        langkey: '',
      },
      {
        name: intl('451225', ' 工商变更 '),
        value: '工商变更',
        langkey: '',
      },
      {
        name: intl('260828', '企业公告'),
        value: '企业公告',
        langkey: '',
      },
      {
        name: intl('138724', '对外投资'),
        value: '对外投资',
        langkey: '',
      },
    ],
  },
  {
    name: intl('261899', '金融行为'),
    value: '金融行为',
    langkey: '',
    children: [
      {
        name: intl('352713', '全部金融行为'),
        value: '',
        langkey: '',
        isAll: true,
      },
      {
        name: intl('138924', 'PEVC融资'),
        value: 'PEVC融资',
        langkey: '',
      },
      {
        name: intl('40559', '投资事件'),
        value: '投资事件',
        langkey: '',
      },
      {
        name: intl('2171', '并购事件'),
        value: '并购事件',
        langkey: '',
      },
      {
        name: intl('243422', '动产融资'),
        value: '动产融资',
        langkey: '',
      },
    ],
  },
  {
    name: intl('451255', '经营信息'),
    value: '经营状况',
    langkey: '',
    children: [
      {
        name: intl('370839', '全部经营信息'),
        value: '',
        langkey: '',
        isAll: true,
      },
      {
        name: intl('352695', '招投标信息'),
        langkey: '',
        value: '招投标公告',
      },
      {
        name: intl('260903', '招聘信息'),
        value: '招聘信息',
        langkey: '',
      },
    ],
  },
  {
    name: intl('138368', '法律诉讼'),
    value: '法律诉讼',
    langkey: '',
    children: [
      {
        name: intl('352696', '全部法律诉讼'),
        value: '',
        langkey: '',
        isAll: true,
      },
      {
        name: intl('138731', '裁判文书'),
        value: '裁判文书',
        langkey: '',
      },
      {
        name: intl('138657', '开庭公告'),
        value: '开庭公告',
        langkey: '',
      },
      {
        name: intl('138226', '法院公告'),
        value: '法院公告',
        langkey: '',
      },
    ],
  },
  {
    name: intl('120665', '知识产权'),
    value: '知识产权',
    langkey: '',
    children: [
      {
        name: intl('352714', '全部知识产权'),
        langkey: '',
        value: '',
        isAll: true,
      },
      {
        name: intl('204102', '商标信息'),
        value: '商标信息',
        langkey: '',
      },
      {
        name: intl('149797', '专利信息'),
        value: '专利信息',
        langkey: '',
      },
      {
        name: intl('138756', '作品著作权'),
        value: '作品著作权',
        langkey: '',
      },
      {
        name: intl('138788', '软件著作权'),
        value: '软件著作权',
        langkey: '',
      },
    ],
  },
]
