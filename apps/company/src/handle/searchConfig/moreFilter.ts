const moreFilter = [
  {
    title: '联系邮箱',
    titleId: '140100',
    type: 'hasMail',
    menu: [
      {
        title: '不限',
        titleId: '138649',
        dataType: '',
      },
      {
        title: '有联系邮箱',
        titleId: '145822',
        dataType: '1',
      },
      {
        title: '无联系邮箱',
        titleId: '145823',
        dataType: '0',
      },
    ],
  },
  {
    title: '联系电话',
    titleId: '10057',
    type: 'hasTel',
    menu: [
      {
        title: '不限',
        titleId: '138649',
        dataType: '',
      },
      {
        title: '有联系电话',
        titleId: '261917',
        dataType: '1',
      },
      {
        title: '无联系电话',
        titleId: '261918',
        dataType: '0',
      },
    ],
  },
  {
    title: '网址信息',
    titleId: '204142',
    type: 'hasDomain',
    menu: [
      {
        title: '不限',
        titleId: '138649',
        dataType: '',
      },
      {
        title: '有网址信息',
        titleId: '145832',
        dataType: '1',
      },
      {
        title: '无网址信息',
        titleId: '145833',
        dataType: '0',
      },
    ],
  },
  {
    title: '融资信息',
    titleId: '145821',
    type: 'hasFinancing',
    menu: [
      {
        title: '不限',
        titleId: '138649',
        dataType: '',
      },
      {
        title: '有融资信息',
        titleId: '145828',
        dataType: '1',
      },
      {
        title: '无融资信息',
        titleId: '145829',
        dataType: '0',
      },
    ],
  },
  {
    title: '是否上市',
    titleId: '206003',
    type: 'listStatus',
    menu: [
      {
        title: '不限',
        titleId: '138649',
        dataType: '',
      },
      {
        title: 'A股上市',
        titleId: '',
        dataType: 'A',
      },
      {
        title: '港股上市',
        titleId: '',
        dataType: 'HK',
      },
      {
        title: '海外上市',
        titleId: '69771',
        dataType: 'OL',
      },
      {
        title: '新三挂牌',
        titleId: '',
        dataType: 'T',
      },
      {
        title: '新四挂牌',
        titleId: '',
        dataType: 'WSS',
      },
      {
        title: '未上市',
        titleId: '14816',
        dataType: '0',
      },
    ],
  },
  {
    title: '债券信息',
    titleId: '39463',
    type: 'hasDebt',
    menu: [
      {
        title: '不限',
        titleId: '138649',
        dataType: '',
      },
      {
        title: '有债券信息',
        titleId: '145826',
        dataType: '1',
      },
      {
        title: '无债券信息',
        titleId: '145827',
        dataType: '0',
      },
    ],
  },
  {
    title: '招投标',
    titleId: '142026',
    type: 'hasBidding',
    menu: [
      {
        title: '不限',
        titleId: '138649',
        dataType: '',
      },
      {
        title: '有招投标',
        titleId: '214896',
        dataType: '1',
      },
      {
        title: '无招投标',
        titleId: '214897',
        dataType: '0',
      },
    ],
  },
  {
    title: '上榜信息',
    titleId: '138468',
    type: 'hasOnList',
    menu: [
      {
        title: '不限',
        titleId: '138649',
        dataType: '',
      },
      {
        title: '有上榜信息',
        titleId: '145824',
        dataType: '1',
      },
      {
        title: '无上榜信息',
        titleId: '145825',
        dataType: '0',
      },
    ],
  },
  {
    title: '商标信息',
    titleId: '204102',
    type: 'hasBrand',
    menu: [
      {
        title: '不限',
        titleId: '138649',
        dataType: '',
      },
      {
        title: '有商标信息',
        titleId: '145834',
        dataType: '1',
      },
      {
        title: '无商标信息',
        titleId: '145835',
        dataType: '0',
      },
    ],
  },
  {
    title: '专利信息',
    titleId: '149797',
    type: 'hasPatent',
    menu: [
      {
        title: '不限',
        titleId: '138649',
        dataType: '',
      },
      {
        title: '有专利信息',
        titleId: '145836',
        dataType: '1',
      },
      {
        title: '无专利信息',
        titleId: '145837',
        dataType: '0',
      },
    ],
  },
  {
    title: '动产抵押',
    titleId: '138207',
    type: 'hasPledge',
    menu: [
      {
        title: '不限',
        titleId: '138649',
        dataType: '',
      },
      {
        title: '有动产抵押',
        titleId: '145842',
        dataType: '1',
      },
      {
        title: '无动产抵押',
        titleId: '145843',
        dataType: '0',
      },
    ],
  },
  {
    title: '失信信息',
    titleId: '138591',
    type: 'hasBreakPromise',
    menu: [
      {
        title: '不限',
        titleId: '138649',
        dataType: '',
      },
      {
        title: '有失信信息',
        titleId: '145830',
        dataType: '1',
      },
      {
        title: '无失信信息',
        titleId: '145831',
        dataType: '0',
      },
    ],
  },
  {
    title: '税务评级',
    titleId: '271650',
    type: 'hasTaxRating',
    menu: [
      {
        title: '不限',
        titleId: '138649',
        dataType: '',
      },
      {
        title: '有税务评级',
        titleId: '214900',
        dataType: '1',
      },
      {
        title: '无税务评级',
        titleId: '214901',
        dataType: '0',
      },
    ],
  },
  {
    title: '进出口信用',
    titleId: '205419',
    type: 'hasImportExport',
    menu: [
      {
        title: '不限',
        titleId: '138649',
        dataType: '',
      },
      {
        title: '有进出口信用',
        titleId: '214903',
        dataType: '1',
      },
      {
        title: '无进出口信用',
        titleId: '214904',
        dataType: '0',
      },
    ],
  },
  {
    title: '作品著作权',
    titleId: '138756',
    type: 'hasProductionCopyright',
    menu: [
      {
        title: '不限',
        titleId: '138649',
        dataType: '',
      },
      {
        title: '有作品著作权',
        titleId: '145838',
        dataType: '1',
      },
      {
        title: '无作品著作权',
        titleId: '145839',
        dataType: '0',
      },
    ],
  },
  {
    title: '软件著作权',
    titleId: '138788',
    type: 'hasCopyright',
    menu: [
      {
        title: '不限',
        titleId: '138649',
        dataType: '',
      },
      {
        title: '有软件著作权',
        titleId: '145840',
        dataType: '1',
      },
      {
        title: '无软件著作权',
        titleId: '145841',
        dataType: '0',
      },
    ],
  },
]
export { moreFilter }
