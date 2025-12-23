// 企业库首页类型下拉框
import intl from '@/utils/intl'

export const homeSelectType = [
  {
    code: 'all',
    val: '',
    lev: '1',
    name: intl('12074', '全部类型'),
  },
  {
    code: 'basic',
    val: '',
    lev: '2',
    name: intl('134852', '基础信息'),
    children: [
      {
        code: '',
        val: '基础信息',
        lev: '1',
        parentVal: '基础信息',
        name: intl('333833', '全部基础信息'),
      },
      {
        code: intl('451218', '股东变更'),
        val: '股东变更',
        lev: '2',
        parentVal: '基础信息',
        name: intl('451218', '股东变更'),
      },
      {
        code: intl('451225', '工商变更'),
        val: '工商变更',
        lev: '2',
        parentVal: '基础信息',
        name: intl('451225', '工商变更'),
      },
      {
        code: intl('260828', '企业公告'),
        val: '企业公告',
        lev: '2',
        parentVal: '基础信息',
        name: intl('260828', '企业公告'),
      },
      {
        code: intl('138724', '对外投资'),
        val: '对外投资',
        lev: '2',
        parentVal: '基础信息',
        name: intl('138724', '对外投资'),
      },
    ],
  },
  {
    code: 'financial',
    val: '',
    lev: '2',
    name: intl('261899', '金融行为'),
    children: [
      {
        code: 'all-financial',
        val: '金融行为',
        lev: '1',
        parentVal: '金融行为',
        name: intl('333834', '全部金融行为'),
      },
      {
        code: intl('138924', 'PEVC融资'),
        val: 'PEVC融资',
        lev: '2',
        parentVal: '金融行为',
        name: intl('138924', 'PEVC融资'),
      },
      {
        code: intl('40559', '投资事件'),
        val: '投资事件',
        lev: '2',
        parentVal: '金融行为',
        name: intl('40559', '投资事件'),
      },
      {
        code: intl('2171', '并购事件'),
        val: '并购事件',
        lev: '2',
        parentVal: '金融行为',
        name: intl('2171', '并购事件'),
      },
      {
        code: intl('243422', '动产融资'),
        val: '动产融资',
        lev: '2',
        parentVal: '金融行为',
        name: intl('243422', '动产融资'),
      },
    ],
  },
  {
    code: 'business',
    val: '',
    lev: '2',
    name: intl('259010', '经营状况'),
    children: [
      {
        code: 'all-business',
        val: '经营状况',
        lev: '1',
        parentVal: '经营状况',
        name: intl('333853', '全部经营状况'),
      },
      {
        code: intl('352695', '招投标信息'),
        val: '招投标信息',
        lev: '2',
        parentVal: '经营状况',
        name: intl('352695', '招投标信息'),
      },
      {
        code: intl('138468', '上榜信息'),
        val: '上榜信息',
        lev: '2',
        parentVal: '经营状况',
        name: intl('138468', '上榜信息'),
      },
      {
        code: intl('260903', '招聘信息'),
        val: '招聘信息',
        lev: '2',
        parentVal: '经营状况',
        name: intl('260903', '招聘信息'),
      },
    ],
  },
  {
    code: 'lawsuits',
    val: '',
    lev: '2',
    name: intl('138368', '法律诉讼'),
    children: [
      {
        code: 'all-lawsuits',
        val: '法律诉讼',
        lev: '1',
        parentVal: '法律诉讼',
        name: intl('333854', '全部法律诉讼'),
      },
      {
        code: intl('138731', '裁判文书'),
        val: '裁判文书',
        lev: '2',
        parentVal: '法律诉讼',
        name: intl('138731', '裁判文书'),
      },
      {
        code: intl('138657', '开庭公告'),
        val: '开庭公告',
        lev: '2',
        parentVal: '法律诉讼',
        name: intl('138657', '开庭公告'),
      },
      {
        code: intl('138226', '法院公告'),
        val: '法院公告',
        lev: '2',
        parentVal: '法律诉讼',
        name: intl('138226', '法院公告'),
      },
    ],
  },
  {
    code: 'intellectual',
    val: '',
    lev: '2',
    name: intl('120665', '知识产权'),
    children: [
      {
        code: 'all-intellectual',
        val: '知识产权',
        lev: '1',
        parentVal: '知识产权',
        name: intl('333835', '全部知识产权'),
      },
      {
        code: intl('204102', '商标信息'),
        val: '商标信息',
        lev: '2',
        parentVal: '知识产权',
        name: intl('204102', '商标信息'),
      },
      {
        code: intl('149797', '专利信息'),
        val: '专利信息',
        lev: '2',
        parentVal: '知识产权',
        name: intl('149797', '专利信息'),
      },
      {
        code: intl('138756', '作品著作权'),
        val: '作品著作权',
        lev: '2',
        parentVal: '知识产权',
        name: intl('138756', '作品著作权'),
      },
      {
        code: intl('138788', '软件著作权'),
        val: '软件著作权',
        lev: '2',
        parentVal: '知识产权',
        name: intl('138788', '软件著作权'),
      },
    ],
  },
]
// 企业库首页时间下拉框
export const homeSelectDate = [
  {
    code: '365',
    name: intl('72086', '全部时间'),
  },
  {
    code: '1',
    name: intl('8886', '今日'),
  },
  {
    code: '7',
    name: intl('437307', '近一周'),
  },
  {
    code: '30',
    name: intl('437325', '近一月'),
  },
]
